
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';


/* !- Redux Actions */

import * as LayerActions from '../../layer/actions';


/* !- React Elements */

import Columns from './columns';
import Events from './events';
import XAxis from './xaxis';
import XGrid from './xgrid';
import YAxis from './yaxis';
import YGrid from './ygrid';
import ToolTip from './toolTip';


/* !- Constants */

import { ONE_DAY, DATE_FORMAT_HTML5 } from '../constants';


/**
 * Calendar component
 */
class Calendar extends Component
{
  constructor(props, context)
  {
    super(props);

    const state = {
      xAxisWidth: 80,
      yAxisHeight: 50,
      startHour: props.startHour,
      endHour: props.endHour,
    };

    this.state = {
      ...state,
      ...this.init(props, context, state),
    };
  }

  getChildContext()
  {
    return {
      id: this.props.id,
      svgWidth: this.state.width,
      svgHeight: this.props.height,
      startDate: this.state.startDate,
      endDate: this.state.endDate,
      startHour: this.state.startHour,
      endHour: this.state.endHour,
      calendarCoord: this.state.calendarCoord,
      calendarWidth: this.state.calendarWidth,
      calendarHeight: this.state.calendarHeight,
      rowNum: this.state.rowNum,
      colNum: this.state.colNum,
      rowHeight: this.state.rowHeight,
      colWidth: this.state.colWidth,
      onAddEvent: this.props.onAddEvent,
      onEditEvent: this.props.onEditEvent,
      onEventMouseEnter: this.props.onEventMouseEnter || ((data, event) =>
      {
        if (data.project)
        {
          this.context.store.dispatch(
            LayerActions.popover(<ToolTip title={data.project} />, { event }),
          );
        }
      }),
      onEventMouseLeave: this.props.onEventMouseLeave || (() =>
      {
        if (this.context.store.getState().layer.element.props.id === 'ToolTip')
        {
          this.context.store.dispatch(LayerActions.close());
        }
      }),
    };
  }

  componentDidMount()
  {
    if (!this.props.width)
    {
      this.setState(
        this.init({
          ...this.props,
          width: this.element.offsetWidth,
        }),
      );
    }
  }

  componentWillReceiveProps(nextProps)
  {
    this.setState(
      this.init({
        ...nextProps,
        width: nextProps.width || this.element.offsetWidth,
      }),
    );
  }

  /**
   * Determine context
   * @param  {Object} props {width, height, start, end}
   */
  init(props, context = this.context, state = this.state || {})
  {
    const next = {
      width: props.width,
      height: props.height,
    };

    next.startDate = moment(`${props.start}T0:00`, DATE_FORMAT_HTML5).toDate();
    next.endDate = moment(`${props.end}T23:59`, DATE_FORMAT_HTML5).toDate();

    next.calendarCoord = {
      x: state.xAxisWidth * +props.xAxis,
      y: state.yAxisHeight * +props.yAxis,
    };

    next.rowNum = state.endHour - state.startHour;
    next.colNum = Math.ceil((next.endDate.getTime() - next.startDate.getTime()) / ONE_DAY);

    next.colWidth = Math.floor((props.width - next.calendarCoord.x) / next.colNum);
    next.rowHeight = Math.floor((props.height - next.calendarCoord.y) / next.rowNum);

    next.calendarHeight = next.rowHeight * next.rowNum;
    next.calendarWidth = next.colWidth * next.colNum;

    return next;
  }

  render()
  {
    return (
      <div
        className="calendar"
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

          { this.props.xAxis &&
          <XAxis />
          }

          { this.props.yAxis &&
          <YAxis
            primary={new Date('2018-02-05 0:00')}
            secondary={new Date('2018-02-08 0:00')}
            element="..."
          />
          }

          <Columns />

          <XGrid />

          <YGrid />

          <Events />
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
  id: PropTypes.string.isRequired,
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
  xAxis: PropTypes.bool,
  /**
   * X axis start hour
   */
  startHour: PropTypes.number,
  /**
   * X axis finish hour
   */
  endHour: PropTypes.number,
  /**
   * y-Axis visibility
   */
  yAxis: PropTypes.bool,
  /**
   * Invoke when hover events, default layer popup
   */
  onEventMouseEnter: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.oneOf(['']),
  ]),
  /**
   * Invoke when hover off
   */
  onEventMouseLeave: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.oneOf(['']),
  ]),
};


/**
 * defaultProps
 * @type {Object}
 */
Calendar.defaultProps =
{
  width: 0,
  height: 0,
  xAxis: true,
  startHour: 0,
  endHour: 24,
  yAxis: true,
  onEventMouseEnter: '',
  onEventMouseLeave: '',
};


/**
 * childContextTypes
 * @type {Object}
 */
Calendar.childContextTypes =
{
  /**
   * [id description]
   */
  id: PropTypes.string,
  /**
   * SVG canvas width
   */
  svgWidth: PropTypes.number,
  /**
   * SVG canvas height
   */
  svgHeight: PropTypes.number,
  /**
   * Calendar start date
   */
  startDate: PropTypes.instanceOf(Date),
  /**
   * Calendar end date
   */
  endDate: PropTypes.instanceOf(Date),
  /**
   * X axis start hour
   */
  startHour: PropTypes.number,
  /**
   * X axis finish hour
   */
  endHour: PropTypes.number,
  /**
   * Relative top right coordinates where calendar start
   * @type {[type]}
   */
  calendarCoord: PropTypes.shape({ x: PropTypes.number, y: PropTypes.number }),
  /**
   * Relative calendar width
   */
  calendarWidth: PropTypes.number,
  /**
   * Relative calendar height
   */
  calendarHeight: PropTypes.number,
  /**
   * Total rows number
   */
  rowNum: PropTypes.number,
  /**
   * Total columns number
   */
  colNum: PropTypes.number,
  /**
   * One row height
   */
  rowHeight: PropTypes.number,
  /**
   * One column width
   */
  colWidth: PropTypes.number,
  /**
   * Handler when create new calendar event
   */
  onAddEvent: PropTypes.func,
  /**
   * Handler when edit current calendar event
   */
  onEditEvent: PropTypes.func,

  onEventMouseEnter: PropTypes.func,
  onEventMouseLeave: PropTypes.func,
};


Calendar.contextTypes =
{
  store: PropTypes.object.isRequired,
};

export default Calendar;
