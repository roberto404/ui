import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';


/* !- React Elements */

import Input from './input';
import Button from './button';
import Pager from '../../pagination/pure/calendar';
import DynamicCaroussel from '../../caroussel/dynamicCaroussel';
import CalendarMonthInterval, { fetchData } from './calendarMonthInterval';

import IconCalendar from '../../icon/mui/action/calendar_today';


/* !- Constans */

import { DATE_FORMAT_HTML5, isDateL, isDateHTML5 } from '../../calendar/constants';


/**
 * CalendarMonthInterval with caroussel pager
 */
const CalendarMonthIntervalCaroussel = props => (
  <div className="grid-2">
    <div className="col-1-5">
      <Pager
        id={[props.fromId, props.toId]}
        date={[new Date(), new Date()]}
        className="border border-gray-light white mb-1 py-1"
      >
        Ma
      </Pager>
      <Pager
        id={[props.fromId, props.toId]}
        date={[moment().subtract(1, 'days').toDate(), moment().subtract(1, 'days').toDate()]}
        className="border border-gray-light white mb-1 py-1"
      >
        Tegnap
      </Pager>
      <Pager
        id={[props.fromId, props.toId]}
        date={[moment().startOf('week').toDate(), moment().endOf('week').toDate()]}
        className="border border-gray-light white mb-1 py-1"
      >
        Héten
      </Pager>
      <Pager
        id={[props.fromId, props.toId]}
        date={[moment().subtract(1, 'weeks').startOf('week').toDate(), moment().subtract(1, 'weeks').endOf('week').toDate()]}
        className="border border-gray-light white mb-1 py-1"
      >
        Múlt héten
      </Pager>
      <Pager
        id={[props.fromId, props.toId]}
        date={[moment().startOf('month').toDate(), moment().endOf('month').toDate()]}
        className="border border-gray-light white mb-1 py-1"
      >
        Hónapban
      </Pager>
      <Pager
        id={[props.fromId, props.toId]}
        date={[moment().subtract(1, 'months').startOf('month').toDate(), moment().subtract(1, 'months').endOf('month').toDate()]}
        className="border border-gray-light white mb-1 py-1"
      >
        Múlt hónapban
      </Pager>
    </div>
    <div className="col-2-5">
      <Input
        id={props.fromId}
        format={value => isDateL(value) ? moment(value, 'l').format(DATE_FORMAT_HTML5) : value}
        stateFormat={value => isDateHTML5(value) ? moment(value).format('l') : value}
        prefix={<IconCalendar className="fill-gray" />}
        className="prefix-inside"
        // tabIndex="-1"
      />
      <DynamicCaroussel
        id={props.fromId}
        fetchData={fetchData(props)}
        className="field calendar-month-field"
      />
    </div>
    <div className="col-2-5">
      <Input
        id={props.toId}
        format={value => isDateL(value) ? moment(value, 'l').format(DATE_FORMAT_HTML5) : value}
        stateFormat={value => isDateHTML5(value) ? moment(value).format('l') : value}
        prefix={<IconCalendar className="fill-gray" />}
        className="prefix-inside"
        // tabIndex="-2"
      />
      <DynamicCaroussel
        id={props.toId}
        fetchData={fetchData({ ...props, initDate: moment().add(1, 'months').toDate() })}
        className="field calendar-month-field"
      />
    </div>
  </div>
);

/**
 * propTypes
 * @type {Object}
 */
CalendarMonthIntervalCaroussel.propTypes =
{
  id: PropTypes.string,
  onChange: PropTypes.func,
  ...CalendarMonthInterval.propTypes,
};

/**
 * defaultProps
 * @type {Object}
 */
CalendarMonthIntervalCaroussel.defaultProps =
{
  id: 'calendarMonthCaroussel',
  onChange: () =>
  {},
  ...CalendarMonthInterval.defaultProps,
};


/**
 * CalendarMonthIntervalCarousselButton connected data.
 * for button value updating
 */
const mapStateToProps = ({ form }, { fromId, toId }) => ({
  start: form[fromId],
  end: form[toId],
});

/**
 * Button invoke CalendarMonthIntervalCaroussel on popover
 */
export const CalendarMonthIntervalCarousselButton = connect(mapStateToProps)((props) =>
{
  const { start, end } = props;

  const value = isDateHTML5(start) && isDateHTML5(end) ?
    `${moment(start, DATE_FORMAT_HTML5).format('LL')} - ${moment(end, DATE_FORMAT_HTML5).format('LL')}`
    : '';

  return (
    <Button
      id={props.id}
      buttonClassName="shadow outline fill-gray"
      {...props}
      data={{}}
      popover={<CalendarMonthIntervalCaroussel {...props} />}
      value={value}
    />
  );
});


/**
 * propTypes
 * @type {Object}
 */
CalendarMonthIntervalCarousselButton.propTypes =
{
  id: PropTypes.string,
  ...CalendarMonthInterval.propTypes,
};

/**
 * defaultProps
 * @type {Object}
 */
CalendarMonthIntervalCarousselButton.defaultProps =
{
  id: 'calendarMonthIntervalCarousselButton',
  ...CalendarMonthInterval.defaultProps,
  placeholder: 'placeholder.select',
  className: 'w-content',
};

export default CalendarMonthIntervalCaroussel;
