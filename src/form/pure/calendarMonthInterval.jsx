import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Field from '../formField';
import CalendarMonth from './calendarMonth';

import moment from 'moment';

/* !- Redux Actions */

import * as FormActions from '../actions';


/**
 * CalendarMonth Component wrapper, which is handling begin and end time (time interval)
 * Component show selected year/month month-calendar where you can select two days.
 *
 * @extends Field
 * @example
 *
 * <CalendarMonthInterval
 *   id="dayselect"
 *   year={2019}
 *   month={8}
 *   width={200}
 * />
 */
class CalendarMonthInterval extends Field
{
  getDateInterval()
  {
    const { moment } = this.context;
    const { dateFormat } = this.props;
    const start = this.getValue({ id: 'start' })// || moment().startOf('day').format(dateFormat);
    const end = this.getValue({ id: 'end' })// || moment().startOf('day').add(1, 'days').format(dateFormat);

    return {
      startDate: start ? moment(start, dateFormat).toDate() : undefined,
      endDate: end ? moment(end, dateFormat).toDate() : undefined,
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
   * @todo  forceUpdate-et le kellene cserelni h csak akkor fusson ha props.formId v props.toId valtozott
   */
  onChangeListener = (props = this.props) =>
  {
    this.forceUpdate();
  }

  onChangeHandler = ({ value }) =>
  {
    const {
      fromId,
      toId,
      dateFormat
    } = this.props;

    const { moment } = this.context;

    const start = this.getValue({ id: 'start' }) || moment().startOf('day').format(dateFormat);
    const end = this.getValue({ id: 'end' }) || moment().startOf('day').add(1, 'days').format(dateFormat);

    const startDate = moment(start, dateFormat).toDate();
    const endDate = moment(end, dateFormat).toDate();

    // TODO
    // const { startDate, endDate } = this.getDateInterval();

    const currentDate = moment(value).toDate();
    const activePeriod = moment(endDate).diff(startDate);
    let dateFrom = value;
    let dateTo = moment(endDate).format(dateFormat);

    // out of current period : before
    if (
      currentDate < startDate
      || (currentDate > endDate && currentDate.getDay() === startDate.getDay())
    )
    {
      dateTo = moment(currentDate.getTime() + activePeriod).format(dateFormat);
    }
    // : after
    else if (currentDate > endDate)
    {
      dateFrom = moment(startDate).format(dateFormat);
      dateTo = value;
    }
    // first day in period
    else if (currentDate.getTime() === startDate.getTime())
    {
      dateTo = value;
    }
    // in period
    else if (currentDate < endDate && currentDate > startDate)
    {
      dateFrom = moment(startDate).format(dateFormat);
      dateTo = value;
    }

    this.props.setValues({
      [fromId]: dateFrom,
      [toId]: dateTo,
    }, this.context.form);
  }

  render()
  {
    return (
      <CalendarMonth
        id={`${this.props.fromId}-${this.props.toId}`}
        year={this.props.year}
        month={this.props.month}
        classNames={this.getActiveClasses}
        onChange={this.onChangeHandler}
        dateFormat={this.props.dateFormat}
      />
    );
  }
}

/**
 * defaultProps
 * @type {Object}
 */
CalendarMonthInterval.defaultProps =
{
  fromId: 'start',
  toId: 'end',
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1,
  dateFormat: 'YYYY-MM-DDTHH:mm',
};

CalendarMonthInterval.contextTypes =
{
  ...CalendarMonthInterval.contextTypes,
  moment: PropTypes.func,
};

export default connect(
  null,
  {
    setValues: FormActions.setValues,
  }
)(CalendarMonthInterval);
