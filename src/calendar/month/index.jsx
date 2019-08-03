
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';


/* !- React Elements */

import Days, { Day } from './days';
import Title from './title';
import XAxis from './xaxis';


/**
 * Calendar component
 */
class Calendar extends Component
{
  componentDidMount()
  {
    if (!this.props.width)
    {
      this.forceUpdate();
    }
  }

  /**
   * Determine state
   * @param  {Object} props
   *  - className: apply function and generate object { active: [5, 6, 7], ... }
   *  - width
   *  - height
   *  - colNum
   *  - startDate
   *  - endDate
   *  - firstDayIndex
   *  - lastDayIndex
   *  - startDateAbsolute
   *  - rowNum
   *  - calendarCoord
   *  - colWidth
   *  - rowHeight
   *  - calendarHeight
   *  - calendarWidth
   */
  compileState(props)
  {
    const startDate = new Date(props.year, props.month - 1, 1);

    const className = (typeof this.props.className === 'function') ?
      this.props.className(new Date(startDate)) : this.props.className;

    const next = {
      className,
      width: props.width,
      height: props.height || props.width,
      colNum: 7,
      UI: props.UI,
      startDate,
    };

    next.endDate = moment(next.startDate).endOf('month').toDate();

    /**
     * First day rectangle index of current month
     */
    next.firstDayIndex = (next.startDate.getDay() || 7) - 1;
    next.lastDayIndex = next.firstDayIndex + next.endDate.getDate();

    next.startDateAbsolute = moment(next.startDate).subtract(next.firstDayIndex, 'days').toDate();

    next.rowNum = Math.ceil(next.lastDayIndex / next.colNum);

    next.calendarCoord = {
      x: 0,
      y: next.height / (next.rowNum + 1 + 2) * 2.5,
    };

    next.colWidth = Math.floor((next.width - next.calendarCoord.x) / next.colNum);
    next.rowHeight = Math.floor((next.height - next.calendarCoord.y) / next.rowNum);

    next.calendarHeight = next.rowHeight * next.rowNum;
    next.calendarWidth = next.colWidth * next.colNum;

    return next;
  }

  render()
  {
    const state = this.compileState({
      ...this.props,
      width: this.props.width || (this.element ? this.element.offsetWidth : 200),
    });

    return (
      <div
        className="calendar month"
        ref={(ref) =>
        {
          this.element = ref;
        }}
      >
        { state.colWidth > 0 &&
        <svg
          id={this.props.id}
          width={state.width}
          height={state.height}
        >
          { this.props.disableTitle === false &&
          <Title
            label={moment(state.startDate).format('YYYY. MMMM')}
            center={{
              x: state.calendarWidth / 2,
              y: state.rowHeight / 2,
            }}
          />
          }

          <XAxis {...state} />

          <Days
            {...state}
            onClick={this.props.onClick}
          />
        </svg>
        }
      </div>
    );
  }
}

/**
 * propTypes
 * @type {Object}
 */
Calendar.propTypes =
{
  /**
   * Value of SVG #id
   */
  id: PropTypes.string,
  /**
   * Year
   */
  year: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  /**
   * Month
   */
  month: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  /**
   * SVG canvas width
   */
  width: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  /**
   * SVG canvas height
   */
  height: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  /**
   * Days classes
   * @example
   * className={{
   *   active: [5, 6, 7],
   *   inactive: [2, 3, 4],
   * }}
   *
   * // -> function
   * () => ({ active: [], inactive: [] })
   */
  className: PropTypes.oneOfType([
    PropTypes.objectOf(PropTypes.arrayOf(PropTypes.number)),
    PropTypes.func,
  ]),
  /**
   * Disable Year and Month
   */
  disableTitle: PropTypes.bool,
  /**
   * Invoke when click to day
   * @type {Object}
   */
  onClick: PropTypes.func,
  /**
   * Custom day UI
   * @example
   * ({ rectangle, text, className, x, y, colWidth, rowHeight, isThisMonth, day }) => (
     <g className={className}>
       {rectangle}
       {text}
       { isThisMonth && day > 18 && day < 24 &&
       <circle
         cx={x + colWidth - (colWidth / 5)}
         cy={y + rowHeight - (colWidth / 5)}
         r={colWidth / 10}
         fill="red"
       />
       }
     </g>
   )
   */
  UI: PropTypes.func,
};


/**
 * defaultProps
 * @type {Object}
 */
Calendar.defaultProps =
{
  id: 'calendar',
  width: 0,
  height: 0,
  className: {},
  disableTitle: false,
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1,
  onClick: () => null,
  UI: Day,
};

export default Calendar;
