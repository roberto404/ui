
import clamp from '@1studio/utils/math/clamp';
import PropTypes, { checkPropTypes } from '@1studio/utils/propType';
import moment from 'moment';

/* !- Constants */

import {
  ONE_DAY,
  ONE_HOUR,
  Y_MOVEMENT_ACCURANCY,
} from '../constants';


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
  const startCol = Math.ceil((event.start + timeZoneOffset + 1 - startDate.getTime()) / ONE_DAY);
  const endCol = Math.ceil((event.end + timeZoneOffset + 1 - startDate.getTime()) / ONE_DAY);

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
 * Convert Date (start, end) to coordinate (SVG Rectangle props).
 * @param  {Object} e       event { start, end }
 * @param  {Object} context calendar context
 * @return {Object}          ...event, rect = [{ x, y, width, height }]}
 */
export const getEventCoordinate = (e, context) =>
{
  const {
    startHour,
    endHour,
    startDate,
    endDate,
    colNum,
    rowHeight,
    colWidth,
    calendarCoord,
    calendarHeight,
  } = context;

  const eventStartDate = moment(e.start).toDate();
  const eventEndDate = moment(e.end).toDate();

  const event = getEventPosition({
    ...e,
    start: clamp(eventStartDate.getTime(), startDate.getTime(), endDate.getTime()),
    end: clamp(eventEndDate.getTime(), startDate.getTime(), endDate.getTime()),
  }, context);


  if (!(event.startCol <= colNum && event.endCol >= 1))
  {
    return event;
  }

  /**
   * This determine event minutes y coordinate
   * @type {Integer}
   */

  const startY = Math.round((rowHeight *
    (eventStartDate.getHours() - startHour + (eventStartDate.getMinutes() / 60)))
    + calendarCoord.y);

  const endY = Math.round((rowHeight *
    (eventEndDate.getHours() - startHour + (eventEndDate.getMinutes() / 60)))
    + calendarCoord.y);

  /**
   * Determine how many columns affacted
   * @type {[type]}
   */
  const eventColNum = event.endCol - event.startCol;

  event.rect = [];

  for (let i = 0; i <= eventColNum; i += 1)
  {
    let props = {};

    // event affected one day
    if (eventColNum === 0 && eventEndDate < endDate && eventStartDate > startDate)
    {
      props = {
        x: (colWidth * (event.startCol - 1)) + calendarCoord.x,
        y: startY,
        height: endY - startY,
      };
    }
    // more day, this is the first day
    else if (i === 0 && eventStartDate > startDate)
    {
      // const startY = (rowHeight * (startRow - 1)) + calendarCoord.y + startMinutes;

      props = {
        x: (colWidth * (event.startCol - 1)) + calendarCoord.x,
        y: startY,
        height: calendarHeight - startY + calendarCoord.y,
      };
    }
    // more day, this is the middle days (full day)
    else if (i < eventColNum || eventEndDate > endDate || (i === 0 && eventStartDate > startDate))
    {
      props = {
        x: (colWidth * (event.startCol + i - 1)) + calendarCoord.x,
        y: calendarCoord.y,
        height: calendarHeight,
      };
    }
    // more day, this is the last day
    else
    {
      props = {
        x: (colWidth * (event.startCol + i - 1)) + calendarCoord.x,
        y: calendarCoord.y,
        height: endY - calendarCoord.y,
      };
    }

    if (props.height)
    {
      event.rect.push({
        ...props,
        width: colWidth,
        col: event.startCol + i,
      });
    }
  }
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
export const getEventDate = (rect, context, ENABLEACCURANCY = true) =>
{
  const {
    startDate,
    startHour,
    rowHeight,
    colWidth,
    calendarCoord,
  } = context;


  const col = Math.round((rect.x - calendarCoord.x) / colWidth);
  const row = (rect.y - calendarCoord.y) / rowHeight;

  let start = moment(startDate).add(col, 'days').add(row + startHour, 'hours').unix() * 1000;
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
