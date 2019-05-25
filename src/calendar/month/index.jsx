
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';


/* !- React Elements */

import Days from './days';
import Title from './title';
import XAxis from './xaxis';


/**
 * Calendar component
 */
class Calendar extends Component
{
  constructor(props, context)
  {
    super(props);

    this.state = this.compileState(props, context);
  }

  componentDidMount()
  {
    if (!this.props.width)
    {
      this.setState(
        this.compileState({
          ...this.props,
          width: this.element.offsetWidth,
        }),
      );
    }
  }

  componentWillReceiveProps(nextProps)
  {
    this.setState(
      this.compileState({
        ...nextProps,
        width: nextProps.width || this.element.offsetWidth,
      }),
    );
  }

  /**
   * Determine state
   * @param  {Object} props {width, height}
   * @param  {Object} context {moment}
   */
  compileState(props, context = this.context)
  {
    const next = {
      // moment: context.moment,
      classNames: props.classNames,
      width: props.width,
      height: props.height || props.width,
      colNum: 7,
      startDate: new Date(props.year, props.month - 1, 1),
    };
    next.endDate = moment(next.startDate).endOf('month').toDate();

    // year validate
    // mounth validate
    //
    //
    //
    //
    //

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
    return (
      <div
        className="calendar month"
        ref={(ref) =>
        {
          this.element = ref;
        }}
      >
        { this.state.colWidth > 0 &&
        <svg
          id={this.props.id}
          width={this.state.width}
          height={this.state.height}
        >
          { this.props.disableTitle === false &&
          <Title
            label={moment(this.state.startDate).format('YYYY. MMMM')}
            center={{
              x: this.state.calendarWidth / 2,
              y: this.state.rowHeight / 2,
            }}
          />
          }

          <XAxis {...this.state} />

          <Days
            {...this.state}
            onChange={this.props.onChange}
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
  // id: PropTypes.string.isRequired,
  /**
   * SVG canvas width
   */
  width: PropTypes.number,
  /**
   * SVG canvas height
   */
  height: PropTypes.number,
  /**
   * x-Axis visibility
   */
  // xAxis: PropTypes.bool,

  /**
   * Invoke when hover events, default layer popup
   */
  // onEventMouseEnter: PropTypes.oneOfType([
  //   PropTypes.func,
  //   PropTypes.oneOf(['']),
  // ]),

  /**
   * Invoke when hover off
   */
  // onEventMouseLeave: PropTypes.oneOfType([
  //   PropTypes.func,
  //   PropTypes.oneOf(['']),
  // ]),

  /**
   * Days classes
   * @example
   * classNames={{
   *   active: [5, 6, 7],
   *   inactive: [2, 3, 4],
   * }}
   */
  classNames: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.number)),
};

//
// /**
//  * [id description]
//  */
// id: PropTypes.string,
// /**
//  * SVG canvas width
//  */
// svgWidth: PropTypes.number,
// /**
//  * SVG canvas height
//  */
// svgHeight: PropTypes.number,
// /**
//  * Calendar start date
//  */
// startDate: PropTypes.instanceOf(Date),
// /**
//  * Calendar end date
//  */
// endDate: PropTypes.instanceOf(Date),
// /**
//  * X axis start hour
//  */
// startHour: PropTypes.number,
// /**
//  * X axis finish hour
//  */
// endHour: PropTypes.number,
// /**
//  * Relative top right coordinates where calendar start
//  * @type {[type]}
//  */
// calendarCoord: PropTypes.shape({ x: PropTypes.number, y: PropTypes.number }),
// /**
//  * Relative calendar width
//  */
// calendarWidth: PropTypes.number,
// /**
//  * Relative calendar height
//  */
// calendarHeight: PropTypes.number,
// /**
//  * Total rows number
//  */
// rowNum: PropTypes.number,
// /**
//  * Total columns number
//  */
// colNum: PropTypes.number,
// /**
//  * One row height
//  */
// rowHeight: PropTypes.number,
// /**
//  * One column width
//  */
// colWidth: PropTypes.number,
// /**
//  * Handler when create new calendar event
//  */
// onAddEvent: PropTypes.func,
// /**
//  * Handler when edit current calendar event
//  */
// onEditEvent: PropTypes.func,
//
// onEventMouseEnter: PropTypes.func,
// onEventMouseLeave: PropTypes.func,
//
// firstDayIndex: PropTypes.number,
// lastDay: PropTypes.number,
// lastDayIndex: PropTypes.number,
// classNames: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.number)),


/**
 * defaultProps
 * @type {Object}
 */
Calendar.defaultProps =
{
  width: 0,
  height: 0,
  // xAxis: true,
  // yAxis: true,
  // onEventMouseEnter: '',
  // onEventMouseLeave: '',
  classNames: {},
  disableTitle: false,
};




// Calendar.contextTypes =
// {
//   moment: PropTypes.func.isRequired,
// };

export default Calendar;
