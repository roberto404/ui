
// import clamp from '@1studio/utils/math/clamp';
import clamp from '@1studio/utils/math/clamp';
import PropTypes, { checkPropTypes } from '@1studio/utils/propType';


/* !- Constants */

import {
  ONE_DAY,
  ONE_HOUR,
  Y_MOVEMENT_ACCURANCY,
} from './constants';





/**
 * Unixtime to calendar position.
 * Convert start, end unix time to calendar position.
 * @param  {Object} event   { start, end }
 * @param  {Object} context { startHour, endHour, startDate } <= calendar props
 * @return {Object}         { startCol, startRow, endCol, endRow }
 */
export const getEventPosition = (event, context) =>
{
  if (
    checkPropTypes(context, PropTypes.shape({
      startHour: PropTypes.number.isRequired,
      endHour: PropTypes.number.isRequired,
      startDate: PropTypes.instanceOf(Date).isRequired,
    }).isRequired)
  )
  {
    return event;
  }

  const {
    startHour,
    endHour,
    startDate,
  } = context;

  const eventStartDate = new Date(event.start);
  const eventEndDate = new Date(event.end);

  /**
   * Timezone differences
   * '2018-03-26' - '2018-03-25' => 23h
   * GMT+0200 - GMT+0100
   * @type {Integer}
   */
  const timeZoneOffset =
    (startDate.getTimezoneOffset() - new Date(event.start).getTimezoneOffset()) * 60 * 1000;

  /**
   * Event start time bigining from this column
   * @type {Integer}
   */
  const startCol = Math.ceil((event.start + 1 - startDate.getTime()) / ONE_DAY);
  const endCol = Math.ceil((event.end + 1 - startDate.getTime()) / ONE_DAY);

  /**
   * Event start time bigining from this row
   * @type {Integer}
   */
  const startRow = clamp(eventStartDate.getHours() - startHour + 1, startHour, endHour);
  const endRow = clamp(eventEndDate.getHours() - startHour + 1, startHour, endHour);

  return {
    ...event,
    startCol,
    startRow,
    endCol,
    endRow,
  };
};

/**
 * Event position to coordinate.
 * Convert position to SVG Rectangle props.
 * @param  {Object} e       event { start, end }
 * @param  {Object} context calendar context
 * @return {Object}          ...event, rect = [{ x, y, width, height }]}
 */
export const getEventCoordinate = (e, context) =>
{
  const {
    startDate,
    endDate,
    rowHeight,
    calendarCoord,
    calendarWidth,
    rowNum,
  } = context;

  const eventStartDate = new Date(e.start.replace(/-/g, '/'));
  const eventEndDate = new Date(e.end.replace(/-/g, '/'));

  const event = getEventPosition({
    ...e,
    start: clamp(eventStartDate.getTime(), startDate.getTime(), endDate.getTime()),
    end: clamp(eventEndDate.getTime(), startDate.getTime(), endDate.getTime()),
  }, context);


  /**
   * Calendar length in millisecond
   * @type {[type]}
   */
  const calendarMillisec = endDate.getTime() - startDate.getTime();


  event.x = ((event.start - startDate.getTime()) / calendarMillisec) * calendarWidth;
  event.width = (((event.end - startDate.getTime()) / calendarMillisec) * calendarWidth) - event.x;

  event.x += calendarCoord.x;
  event.y = calendarCoord.y + (rowNum * rowHeight);
  event.height = rowHeight;

  return event;
};

/**
 * Coordinate to Unixtime.
 * Convert Rectangle (x,y,height) to calendar start, end unixtime.
 *
 * @param  {Object} rect   {x, y, width, height}
 * @param  {Object} context { startDate, rowHeight, colWidth, calendarCoord }
 * @return {Object}         { start, end }
 */
export const getEventDate = (rect, context, ENABLEACCURANCY: boolean = true) =>
{
  const {
    startDate,
    rowHeight,
    colWidth,
    calendarCoord,
    moment,
  } = context;


  const col = Math.round((rect.x - calendarCoord.x) / colWidth);
  const row = (rect.y - calendarCoord.y) / rowHeight;

  let start = moment(startDate).add(col, 'days').add(row, 'hours').unix() * 1000;
  let end = start + Math.round(rect.height / rowHeight * ONE_HOUR);

  if (Y_MOVEMENT_ACCURANCY && ENABLEACCURANCY)
  {
    const accurancyTime = Y_MOVEMENT_ACCURANCY * 60 * 1000;
    start = Math.round(start / accurancyTime) * accurancyTime;

    const accurancyHour = Y_MOVEMENT_ACCURANCY / 60;
    const hour = Math.round((rect.height / rowHeight) / accurancyHour) * accurancyHour;

    end = start + Math.round(hour * ONE_HOUR);
  }

  // console.log(new Date(start));
  // console.log(new Date(end));
  return { start, end };
}

const getEventData = (event, context) =>
{

}


export default getEventData;
