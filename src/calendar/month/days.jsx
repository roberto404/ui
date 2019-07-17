
import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';


/* !- Constants */

import types from './types';

const DEFAULT_STYLE = {
  fill: '#d9d9d9',
  color: '#000000',
  // fontSize: 12,
  fontFamily: 'sans-serif',
};


/**
 * Day
 */
export const Day = ({
  i,
  className,
  firstDayIndex,
  lastDayIndex,
  rectangle,
  text,
}) => (
  <g
    className={className}
  >
    {rectangle}
    { i >= firstDayIndex && i < lastDayIndex && text }
  </g>
);

/**
 * propTypes
 * @type {Object}
 */
Day.propTypes =
{
  firstDayIndex: types.firstDayIndex.isRequired,
  lastDayIndex: types.lastDayIndex.isRequired,
  className: PropTypes.string.isRequired,
  i: PropTypes.number.isRequired,
  rectangle: PropTypes.element.isRequired,
  text: PropTypes.element.isRequired,
};

/**
 * defaultProps
 * @type {Object}
 */
Day.defaultProps =
{
};

/**
 * Days
 */
const Days = ({
  rowNum,
  colNum,
  rowHeight,
  colWidth,
  firstDayIndex,
  lastDayIndex,
  calendarCoord,
  startDate,
  className,
  onClick,
  UI,
}) =>
{
  const days = [];

  for (let i = 0; i < rowNum * colNum; i += 1)
  {
    const row = Math.floor(i / colNum);
    const col = i % colNum;
    const x = calendarCoord.x + (col * colWidth);
    const y = calendarCoord.y + (row * rowHeight);
    const isThisMonth = i >= firstDayIndex && i < lastDayIndex;
    const day = isThisMonth ? i + 1 - firstDayIndex : '';
    const date = moment(startDate).add(day - 1, 'days').unix() * 1000;

    /**
     * className of day
     */
    const dayClassName = ['day'];

    if (isThisMonth)
    {
      dayClassName.push('visible');
    }

    Object
      .keys(className)
      .forEach((index) =>
      {
        if (className[index].indexOf(day) !== -1)
        {
          dayClassName.push(index);
        }
      });

    const props = {
      i,
      className: dayClassName.join(', '),
      x,
      y,
      colWidth,
      rowHeight,
      onClick,
      date,
      firstDayIndex,
      lastDayIndex,
      day,
      isThisMonth,
    };

    days.push(
      <UI
        key={i}
        {...props}
        rectangle={
          <rect
            x={x}
            y={y}
            width={colWidth}
            height={rowHeight}
            fill={DEFAULT_STYLE.fill}
            onClick={() => onClick({ date, className: dayClassName })}
          />
        }
        text={
          <text
            x={x + (colWidth / 2)}
            y={y + (rowHeight / 2)}
            fill={DEFAULT_STYLE.color}
            fontSize={`${colWidth * 0.4}px`}
            fontFamily={DEFAULT_STYLE.fontFamily}
            alignmentBaseline="middle"
            textAnchor="middle"
          >
            {day}
          </text>
        }
      />,
    );
  }

  return (
    <g id="days">
      {days}
    </g>
  );
};

/**
 * propTypes
 * @type {Object}
 */
Days.propTypes =
{
  rowNum: types.rowNum.isRequired,
  colNum: types.colNum.isRequired,
  rowHeight: types.rowHeight.isRequired,
  colWidth: types.colWidth.isRequired,
  firstDayIndex: types.firstDayIndex.isRequired,
  lastDayIndex: types.lastDayIndex.isRequired,
  calendarCoord: types.calendarCoord.isRequired,
  startDate: types.startDate.isRequired,
  className: types.className.isRequired,
  onClick: types.onClick.isRequired,
  UI: types.UI.isRequired,
};

/**
 * defaultProps
 * @type {Object}
 */
Days.defaultProps =
{
};

export default Days;
