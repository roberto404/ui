
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import moment from 'moment';


/* !- Constants */

const DEFAULT_STYLE = {
  fill: '#d9d9d9',
  color: '#000000',
  // fontSize: 12,
  fontFamily: 'sans-serif',
};


/**
 * Calendar component
 */
class Days extends Component
{
  render()
  {
    const days = [];
    const {
      rowNum,
      colNum,
      rowHeight,
      colWidth,
      firstDayIndex,
      lastDayIndex,
      calendarCoord,
      startDate,
      // moment,
    } = this.props;

    for (let i = 0; i < rowNum * colNum; i += 1)
    {
      const row = Math.floor(i / colNum);
      const col = i % colNum;
      const x = calendarCoord.x + (col * colWidth);
      const y = calendarCoord.y + (row * rowHeight);
      const isThisMonth = i >= firstDayIndex && i < lastDayIndex;
      const day = isThisMonth ? i + 1 - firstDayIndex : '';
      const date = moment(startDate).add(day - 1, 'days').unix() * 1000;


      const dayClassNames = {
        day: true,
        visible: isThisMonth,
      };

      Object
        .keys(this.props.classNames)
        .forEach((index) =>
        {
          if (this.props.classNames[index].indexOf(day) !== -1)
          {
            dayClassNames[index] = true;
          }
        });


      const dayClasses = classNames(dayClassNames);

      days.push(
        <g
          key={i}
          className={dayClasses}
        >
          <rect
            x={x}
            y={y}
            width={colWidth}
            height={rowHeight}
            fill={DEFAULT_STYLE.fill}
            onClick={() => this.props.onChange(date)}
          />
          { i >= firstDayIndex && i < lastDayIndex &&
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
        </g>,
      );
    }

    return (
      <g id="days">
        {days}
        {/* <rect
          x={this.context.calendarCoord.x}
          y={this.context.calendarCoord.y}
          width={this.context.calendarWidth}
          height={this.context.calendarHeight}
          fill="red"
          fillOpacity="1"
          ref={(ref) =>
          {
            this.calendar = ref;
          }}
        /> */}
        {/* <g id="items">
          { this.getDays().map(event =>
            (
              <Rectangle
                {...event}
                key={`${event.id}-${event.col}`}
              />
            ),
          )}
        </g> */}
      </g>
    );
  }
}

/**
 * propTypes
 * @type {Object}
 */
Days.propTypes =
{
};

/**
 * defaultProps
 * @type {Object}
 */
Days.defaultProps =
{
};

export default Days;
