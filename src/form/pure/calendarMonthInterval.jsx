import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';

import Field from '../formField';
// import CalendarMonth from './calendarMonth';
import CalendarMonth from '../../calendar/month/';


/* !- Redux Actions */

import { setValues } from '../actions';


/**
 * CalendarMonthInterval Dynamic Caroussel helper
 * @param  {String} field Form field name, which store selected date value
 * @param  {Function} [onChange] invoke when value change
 * @param  {String} [value=current week] start value
 * @param  {Integer} [width] component width, default 100%
 * @return {Function}       Dynamic Caroussel component fetchData props
 */
export const fetchData = props =>
  (page) =>
  {
    const items = [];

    for (let i = -1; i < 2; i += 1)
    {
      const actualPage = page + i;
      const actualDate = moment(props.initDate).add(actualPage, 'months');

      items.push({
        id: i,
        slide: (
          <CalendarMonthInterval
            {...props}
            year={actualDate.format('YYYY')}
            month={actualDate.format('MM')}
            freezeMonth
          />
        ),
      });
    }

    return items;
  };


/**
 * CalendarMonth Component wrapper, which is handling begin and end time (time interval)
 * Component show selected year/month month-calendar where you can select two days.
 *
 * @extends Field
 * @example
 *
 * <CalendarMonthInterval
 *   year={2019}
 *   month={8}
 *   width={200}
 * />
 */
class CalendarMonthInterval extends Field
{
  /**
   * Return start and end {Date}
   * @param  {Object} [defaults={}] { start: new Date(), end: newDate()}
   * @return {[Object]}               { startDate: {Date}, endDate {Date} }
   */
  getDateInterval(defaults = {})
  {
    const {
      dateFormat,
      fromId,
      toId,
      form,
    } = this.props;

    const start = this.getValue({ id: fromId, form });
    const end = this.getValue({ id: toId, form });

    return {
      startDate: start ? moment(start, dateFormat).toDate() : defaults.start,
      endDate: end ? moment(end, dateFormat).toDate() : defaults.end,
    };
  }

  /**
  * Collect those day which is active
  */
  getActiveClasses = (month) =>
  {
    const active = [];

    const { startDate, endDate } = this.getDateInterval();

    if ((startDate instanceof Date) === false || (endDate instanceof Date) === false)
    {
      return {};
    }

    startDate.setHours(0);
    startDate.setMinutes(0);

    endDate.setHours(0);
    endDate.setMinutes(0);

    for (let i = 1; i <= 31; i += 1)
    {
      month.setDate(i);

      if (month >= startDate && month <= endDate)
      {
        active.push(i);
      }
    }

    return {
      active,
    };
  };

  /**
   * @override FormField
   * @TODO  forceUpdate-et le kellene cserelni h csak akkor fusson ha props.formId v props.toId valtozott
   */
  onChangeListener = (props = this.props) =>
  {
    this.forceUpdate();
  }

  /**
   * Invoke when click day of calendar
   * @param  {interger} date Unixtime
   */
  onChangeCalendarHandler = ({ date }) =>
  {
    const {
      fromId,
      toId,
      dateFormat,
      intervalLength,
    } = this.props;

    const { startDate, endDate } = this.getDateInterval({
      start: moment(date).startOf('day').toDate(),
      end: moment(date).startOf('day').add(intervalLength ? intervalLength - 1 : 1, 'days').toDate(),
    });

    /**
     * New selected date value
     * @type {Date}
     */
    const selectedDate = new Date(date);

    /**
     * Calculated new values (start, end)
     */
    let dateFrom = moment(startDate).format(dateFormat);
    let dateTo = moment(endDate).format(dateFormat);

    if (intervalLength)
    {
      dateFrom = moment(date).format(dateFormat);
      dateTo = moment(date).add(intervalLength - 1, 'days').format(dateFormat);
    }
    // out of current period same day => moving selection
    else if (
      startDate.getTime() !== endDate.getTime()
      && (selectedDate < startDate || selectedDate > endDate)
      && selectedDate.getDay() === startDate.getDay()
    )
    {
      const intervalDiff = moment(endDate).diff(startDate);
      dateFrom = moment(date).format(dateFormat);
      dateTo = moment(selectedDate.getTime() + intervalDiff).format(dateFormat);
    }
    // : before <= expand selection
    else if (selectedDate < startDate)
    {
      dateFrom = moment(date).format(dateFormat);
    }
    // : after <= expand selection
    else if (selectedDate > endDate)
    {
      dateTo = moment(date).format(dateFormat);
    }
    // first day in period
    else if (selectedDate.getTime() === startDate.getTime())
    {
      dateTo = moment(date).format(dateFormat);
    }
    // in period
    else if (selectedDate < endDate && selectedDate > startDate)
    {
      dateTo = moment(date).format(dateFormat);
    }
    else
    {
      dateFrom = dateTo;
    }

    this.context.store.dispatch(setValues({
      [fromId]: dateFrom,
      [toId]: dateTo,
    }, this.context.form || this.props.form));
  }

  render()
  {
    return (
      <CalendarMonth
        {...this.props}
        id={`${this.props.fromId}-${this.props.toId}`}
        className={this.getActiveClasses}
        onClick={this.onChangeCalendarHandler}
      />
    );
  }
}

CalendarMonthInterval.propTypes =
{
  ...CalendarMonthInterval.propTypes, // FormField
  /**
   * This value determine interval days length. User cannot select different size.
   * Default (0) user determine length of interval.
   */
  intervalLength: PropTypes.number,
  /**
  * Unique form id to Start value
  */
  fromId: PropTypes.string,
  /**
  * Unique form id to End value
  */
  toId: PropTypes.string,
  year: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  month: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  dateFormat: PropTypes.string,
};

/**
 * defaultProps
 * @type {Object}
 */
CalendarMonthInterval.defaultProps =
{
  ...CalendarMonthInterval.defaultProps,
  id: 'start', // use value props
  fromId: 'start',
  toId: 'end',
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1,
  dateFormat: 'YYYY-MM-DDTHH:mm',
  intervalLength: 0,
};

CalendarMonthInterval.contextTypes =
{
  store: PropTypes.object,
};


export default CalendarMonthInterval;
