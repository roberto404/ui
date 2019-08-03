import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';


/* !- React Elements */

import Field from '../formField';
import CalendarMonth from '../../calendar/month';


/* !- Constants */

import types from '../../calendar/month/types';
import { DATE_FORMAT_HTML5 } from '../../calendar/constants';


/**
 * CalendarMonth Dynamic Caroussel helper
 * @param  {String} field Form field name, which store selected date value
 * @param  {Function} [onChange] invoke when value change
 * @param  {String} [value=current week] start value
 * @param  {Integer} [width] component width, default 100%
 * @return {Function}       Dynamic Caroussel component fetchData props
 */
export const fetchData = (field, onChange, value, width, initDate) =>
  (page) =>
  {
    const items = [];

    for (let i = -1; i < 2; i += 1)
    {
      const actualPage = page + i;
      const actualDate = moment(initDate).add(actualPage, 'months');

      items.push({
        id: i,
        slide: <CalendarMonthForm
          id={field}
          dateFormat={DATE_FORMAT_HTML5}
          value={value}
          year={actualDate.format('YYYY')}
          month={actualDate.format('MM')}
          width={width}
          onChange={onChange}
          freezeMonth
        />,
      });
    }

    return items;
  };


/**
* Day selector. Component show selected year/month month-calendar
* where you can select one day.
* If you want more month you can use Dynamic Caroussel.
*
* @extends Field
* @example
*
* <CalendarMonth
*   id="dayselect"
*   year={2019}
*   month={8}
*   width={200}
*   dateFormat="MM-DD-YYYY"
* />
*
* @example Responsive
*
* <div style={{ width: '300px' }}>
*   <CalendarMonth
*     id="dayselect"
*   />
* </div>
*
* @example locale (hungary)
*
* import moment from 'moment';
* moment.locale('hu');
*
*/
class CalendarMonthForm extends Field
{
  constructor(props)
  {
    super(props);

    this.state.width = props.width;
    this.state.height = props.height;
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
  onChangeDateHandler = ({ date }) =>
  {
    const valueDate = moment(this.getValue());
    const selectedDate = moment(date);

    selectedDate.hour(parseInt(valueDate.format('H')));
    selectedDate.minute(parseInt(valueDate.format('m')));

    const value = selectedDate.format(this.props.dateFormat);

    if (this.props.onClick({ value }))
    {
      this.onChangeHandler(value);
    }
  }

  componentDidMount()
  {
    super.componentDidMount();
    this.initWidth();
  }

  componentWillReceiveProps(nextProps)
  {
    super.componentWillReceiveProps(nextProps);
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
        state.height = state.width;
      }

      this.setState(state);
    }
  }

  render()
  {
    const startDate = new Date(this.props.year, this.props.month - 1, 1);
    const valueMoment = moment(this.getValue(this.props), this.props.dateFormat);

    const className = (typeof this.props.className === 'function') ?
      this.props.className(startDate) : this.props.className;

    const active = this.props.freezeMonth === false || valueMoment.format('YYYYMM') === moment(startDate).format('YYYYMM') ?
      [parseInt(valueMoment.format('D'))] : [];

    const year = (this.props.freezeMonth) ?
      startDate.getFullYear() : valueMoment.toDate().getFullYear();

    const month = (this.props.freezeMonth) ?
      startDate.getMonth() : valueMoment.toDate().getMonth();

    return (
      <div
        className="field calendar-month-field"
        ref={(ref) =>
        {
          this.element = ref;
        }}
      >

        { this.label }

        <CalendarMonth
          {...this.props}
          month={month + 1}
          year={year}
          className={{
            active,
            ...className,
          }}
          onClick={this.onChangeDateHandler}
        />

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
CalendarMonthForm.propTypes =
{
  ...CalendarMonthForm.propTypes,
  /**
   * Moment date format
   */
  dateFormat: PropTypes.string,
  /**
   * SVG width
   */
  width: PropTypes.number,
  /**
   * SVG height
   */
  height: PropTypes.number,
  /**
   * Calendar Classes
   */
  className: types.className,
  /**
   * CalendarMonth always visible the start date.
   * Sometime important the change of the month has no effect on it.
   * For example caroussel calendar
   */
  freezeMonth: PropTypes.bool,
  onClick: PropTypes.func,
};

/**
 * defaultProps
 * @type {Object}
 */
CalendarMonthForm.defaultProps =
{
  ...CalendarMonthForm.defaultProps,
  value: moment().format(DATE_FORMAT_HTML5),
  width: 0,
  height: 0,
  dateFormat: DATE_FORMAT_HTML5,
  className: {},
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1,
  freezeMonth: false,
  onClick: () => true,
};

export default CalendarMonthForm;
