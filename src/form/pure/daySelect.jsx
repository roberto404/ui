import React from 'react';
import PropTypes from 'prop-types';
import floor from 'lodash/floor';
import capitalizeFirstLetter from '@1studio/utils/string/capitalizeFirstLetter';
import classNames from 'classnames';

import moment from 'moment';


/* !- React Elements */

import Field from '../../form/formField';


/* !- Constants */

const DIMENSION_DIVIDER = '0.6';

/**
 * Use fetchData, determine the start date to Dynamic Caroussel
 * @type {string}
 */
const start = moment().startOf('week').subtract(1, 'weeks').format('YYYY-MM-DD');

/**
 * DaySelect Dynamic Caroussel helper
 * @param  {String} field Form field name, which store selected date value
 * @param  {Function} [onChange] invoke when value change
 * @param  {String} [value=current week] start value
 * @param  {Integer} [width] component width, default 100%
 * @return {Function}       Dynamic Caroussel component fetchData props
 */
export const fetchData = (field, onChange, value = start, width) =>
  (page) =>
  {
    const items = [];

    for (let i = 0; i < 3; i += 1)
    {
      items.push({
        id: i,
        slide: <DaySelect
          id={field}
          width={width}
          start={moment(value, 'YYYY-MM-DD').add((page + i) * 7, 'days').format('YYYY-MM-DD')}
          onChange={onChange}
        />,
      });
    }

    return items;
  };


/**
* Date selector, UI based on iOS mobile calendar view
*
* @extends Field
* @example
*
* <DaySelect
*   id="dayselect"
*   start="2018-03-23"
* />
*/
class DaySelect extends Field
{
  constructor(props)
  {
    super(props);

    this.state = {
      width: props.width,
      height: props.height,
    };
  }

  /* !- Handlers */

  /**
   * Extends default onChangeHandler
   * @private
   * @override
   * @emits
   * @param  {Object} event
   * @return {void}
   */
  onChangeDateHandler = (event) =>
  {
    this.onChangeHandler(
      moment(event.currentTarget.dataset.unix * 1000).format(this.props.dateFormat),
    );
  }

  componentDidMount()
  {
    super.componentDidMount();
    this.initWidth();
  }

  componentWillReceiveProps(nextProps)
  {
    this.initWidth(nextProps);
  }

  initWidth(props = this.props)
  {
    if (!props.width)
    {
      const state = {};
      state.width = this.element.offsetWidth;

      if (!props.height)
      {
        state.height = state.width / props.days;
      }

      this.setState(state);
    }
  }

  render()
  {
    /**
     * SVG based on this days of collection.
     * @type {Array} { id: unixtime, date: moment }
     */
    const days = [];

    for (let i = 0; i < this.props.days; i += 1)
    {
      const date = moment(this.props.start, this.props.dateFormat).add(i, 'days');

      days.push({
        id: date.unix(),
        classNames: classNames({
          today: moment().startOf('day').unix() === date.unix(),
          current: moment(this.state.value).unix() === date.unix(),
          weekend: ['0', '6'].indexOf(date.format('d')) !== -1,
        }),
        date,
      });
    }


    const dayWidth = floor(this.state.width / days.length, 1);
    const dayHeight = this.state.height || dayWidth;

    const radius = Math.min(dayWidth, dayHeight) / 2 * DIMENSION_DIVIDER;

    return (
      <div
        className="field dayselect-field"
        ref={(ref) =>
        {
          this.element = ref;
        }}
      >

        { this.label }

        { dayWidth > 0 && dayHeight > 0 &&
        <svg
          width={dayWidth * days.length}
          height={dayHeight}
        >
          {
            days.map((day, i) => (
              <g
                key={day.id}
                id={day.classNames}
              >
                <circle
                  cx={(i + 0.5) * dayWidth}
                  cy={dayHeight - radius}
                  r={radius}
                  fill="black"
                />
                <text
                  x={(i + 0.5) * dayWidth}
                  y={(dayHeight - (radius * 2)) / 2}
                  alignmentBaseline="middle"
                  textAnchor="middle"
                  fill="black"
                  fontSize={(dayHeight - (radius * 2)) * DIMENSION_DIVIDER}
                  fontFamily="sans-serif"
                >
                  {capitalizeFirstLetter(day.date.format('dd'))}
                </text>
                <text
                  x={(i + 0.5) * dayWidth}
                  y={dayHeight - radius}
                  alignmentBaseline="middle"
                  textAnchor="middle"
                  fill="white"
                  fontSize={radius}
                  fontFamily="sans-serif"
                >
                  {day.date.format('D')}
                </text>
                <rect
                  x={i * dayWidth}
                  y={0}
                  width={dayWidth}
                  height={dayHeight}
                  fill="transparent"
                  data-unix={day.id}
                  onClick={this.onChangeDateHandler}
                />
              </g>
            ))
          }
        </svg>
        }

        {/* { this.state.value &&
        <div className="value">
          {moment(this.state.value, this.props.dateFormat).format(this.props.dateLongFormat)}
        </div>
        } */}

        { this.state.error &&
          <div className="error">{this.state.error}</div>
        }
      </div>
    );
  }
}

/**
 * propTypes
 * @override
 * @type {Object}
 */
DaySelect.propTypes =
{
  ...DaySelect.propTypes,
  /**
   * Start date on the day selector component
   */
  start: PropTypes.string.isRequired,
  /**
   * Number of days of day selector component
   */
  days: PropTypes.number,
  /**
   * Moment date format
   */
  dateFormat: PropTypes.string,
  /**
   * Form field formated moment date format
   */
  dateLongFormat: PropTypes.string,
  /**
   * SVG width
   */
  width: PropTypes.number,
  /**
   * SVG height
   */
  height: PropTypes.number,
};

/**
 * defaultProps
 * @type {Object}
 */
DaySelect.defaultProps =
{
  ...DaySelect.defaultProps,
  width: 0,
  height: 0,
  days: 7,
  dateFormat: 'YYYY-MM-DD',
  dateLongFormat: 'YYYY. MMM. D., dddd',
};

export default DaySelect;
