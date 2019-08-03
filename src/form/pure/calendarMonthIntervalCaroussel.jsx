import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';


/* !- React Elements */

import Input from './input';
import Button from './button';
import Pager from '../../pagination/pure/calendar';
import DynamicCaroussel from '../../caroussel/dynamicCaroussel';
import { fetchData } from './calendarMonthInterval';


import IconCalendar from '../../icon/mui/action/calendar_today';

import { DATE_FORMAT_HTML5, isDateL, isDateHTML5 } from '../../calendar/constants';


/**
 * CalendarMonthInterval with caroussel pager
 */
const CalendarMonthIntervalCaroussel = ({ id, onChange }) => (
  <div className="grid-2">
    <div className="col-1-5">
      <Pager
        id={['start', 'end']}
        date={[new Date(), new Date()]}
        className="border border-gray-light white mb-1 py-1"
      >
        Ma
      </Pager>
      <Pager
        id={['start', 'end']}
        date={[moment().subtract(1, 'days').toDate(), moment().subtract(1, 'days').toDate()]}
        className="border border-gray-light white mb-1 py-1"
      >
        Tegnap
      </Pager>
      <Pager
        id={['start', 'end']}
        date={[moment().startOf('week').toDate(), moment().endOf('week').toDate()]}
        className="border border-gray-light white mb-1 py-1"
      >
        Héten
      </Pager>
      <Pager
        id={['start', 'end']}
        date={[moment().subtract(1, 'weeks').startOf('week').toDate(), moment().subtract(1, 'weeks').endOf('week').toDate()]}
        className="border border-gray-light white mb-1 py-1"
      >
        Múlt héten
      </Pager>
      <Pager
        id={['start', 'end']}
        date={[moment().startOf('month').toDate(), moment().endOf('month').toDate()]}
        className="border border-gray-light white mb-1 py-1"
      >
        Hónapban
      </Pager>
      <Pager
        id={['start', 'end']}
        date={[moment().subtract(1, 'months').startOf('month').toDate(), moment().subtract(1, 'months').endOf('month').toDate()]}
        className="border border-gray-light white mb-1 py-1"
      >
        Múlt hónapban
      </Pager>
    </div>
    <div className="col-2-5">
      <Input
        id="start"
        format={value => isDateL(value) ? moment(value, 'l').format(DATE_FORMAT_HTML5) : value}
        stateFormat={value => isDateHTML5(value) ? moment(value).format('l') : value}
        prefix={<IconCalendar className="fill-gray" />}
        className="prefix-inside"
        // tabIndex="-1"
      />
      <DynamicCaroussel
        id={`${id}-1`}
        fetchData={fetchData(id, onChange)}
        className="field calendar-month-field"
      />
    </div>
    <div className="col-2-5">
      <Input
        id="end"
        format={value => isDateL(value) ? moment(value, 'l').format(DATE_FORMAT_HTML5) : value}
        stateFormat={value => isDateHTML5(value) ? moment(value).format('l') : value}
        prefix={<IconCalendar className="fill-gray" />}
        className="prefix-inside"
        // tabIndex="-2"
      />
      <DynamicCaroussel
        id={`${id}-2`}
        fetchData={fetchData(id, onChange, undefined, undefined, moment().add(1, 'months').toDate())}
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
};

/**
 * Button invoke CalendarMonthIntervalCaroussel on popover
 */
export const CalendarMonthIntervalCarousselButton = ({ id }, { store }) =>
{
  const getFormatedValue = () =>
  {
    const formState = store.getState().form;

    const { start, end } = formState;

    return isDateHTML5(start) && isDateHTML5(end) ?
      `${moment(start, DATE_FORMAT_HTML5).format('LL')} - ${moment(end, DATE_FORMAT_HTML5).format('LL')}`
      : '';
  };

  return (
    <Button
      id={id}
      placeholder="placeholder.select"
      className="w-content"
      buttonClassName="shadow outline fill-gray"
      popover={CalendarMonthIntervalCaroussel}
      stateFormat={getFormatedValue}
    />
  );
};

/**
 * propTypes
 * @type {Object}
 */
CalendarMonthIntervalCarousselButton.propTypes =
{
  id: PropTypes.string,
};

/**
 * defaultProps
 * @type {Object}
 */
CalendarMonthIntervalCarousselButton.defaultProps =
{
  id: 'calendarMonthIntervalCarousselButton',
};

/**
 * defaultProps
 * @type {Object}
 */
CalendarMonthIntervalCarousselButton.contextTypes =
{
  store: PropTypes.object,
};

export default CalendarMonthIntervalCaroussel;
