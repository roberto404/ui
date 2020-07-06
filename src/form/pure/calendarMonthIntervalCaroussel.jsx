import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';


/* !- Redux Action */

import { setValues, unsetValues } from '../actions';
import { close } from '../../layer/actions';


/* !- React Elements */

import Input from './input';
import Button from './button';
import Pager from '../../pagination/pure/calendar';
import DynamicCaroussel from '../../caroussel/dynamicCaroussel';
import CalendarMonthInterval, { fetchData } from './calendarMonthInterval';

import IconCalendar from '../../icon/mui/action/calendar_today';
import IconDone from '../../icon/mui/navigation/check';


/* !- Constans */

import { DATE_FORMAT_HTML5, isDateL, isDateHTML5 } from '../../calendar/constants';


/**
 * CalendarMonthInterval with caroussel pager
 */
export const CalendarMonthIntervalCaroussel = (props, { store }) =>
{
  const isRealTime = props.realTime;

  const fromId = isRealTime ? props.fromId : `${props.fromId}@${props.id}`;
  const toId = isRealTime ? props.toId : `${props.toId}@${props.id}`;

  const onClickFlushButtonHandler = (event) =>
  {
    store.dispatch(unsetValues({ [fromId]: undefined, [toId]: undefined }));
  }

  /**
   * Invoke when click non-RealTime button
   */
  const onClickApplyButtonHandler = (event) =>
  {
    const form = store.getState().form;

    const fromIdValue = form[fromId];
    const toIdValue = form[toId];

    const values = { [props.fromId]: fromIdValue, [props.toId]: toIdValue };

    if (props.onClickApplyButton(event, values, props) !== false)
    {
      event.preventDefault();
      store.dispatch(setValues(values));
    }
  }

  return (
    <div className="grid-2">
      <div className="col-1-5">
        <Pager
          id={[fromId, toId]}
          date={[moment().startOf('day').toDate(), moment().endOf('day').toDate()]}
          className="border border-gray-light white mb-1 py-1"
        >
          Ma
        </Pager>
        <Pager
          id={[fromId, toId]}
          date={[moment().startOf('day').subtract(1, 'days').toDate(), moment().endOf('day').subtract(1, 'days').toDate()]}
          className="border border-gray-light white mb-1 py-1"
        >
          Tegnap
        </Pager>
        <Pager
          id={[fromId, toId]}
          date={[moment().startOf('week').toDate(), moment().endOf('week').toDate()]}
          className="border border-gray-light white mb-1 py-1"
        >
          Héten
        </Pager>
        <Pager
          id={[fromId, toId]}
          date={[moment().startOf('week').subtract(1, 'weeks').toDate(), moment().endOf('week').subtract(1, 'weeks').toDate()]}
          className="border border-gray-light white mb-1 py-1"
        >
          Múlt héten
        </Pager>
        <Pager
          id={[fromId, toId]}
          date={[moment().startOf('month').toDate(), moment().endOf('month').toDate()]}
          className="border border-gray-light white mb-1 py-1"
        >
          Hónapban
        </Pager>
        <Pager
          id={[fromId, toId]}
          date={[moment().subtract(1, 'months').startOf('month').toDate(), moment().subtract(1, 'months').endOf('month').toDate()]}
          className="border border-gray-light white mb-1 py-1"
        >
          Múlt hónapban
        </Pager>
      </div>
      <div className="col-2-5">
        <Input
          id={fromId}
          format={value => isDateL(value) ? moment(value, 'l').format(DATE_FORMAT_HTML5) : value}
          stateFormat={value => isDateHTML5(value) ? moment(value).format('l') : value}
          prefix={<IconCalendar className="fill-gray" />}
          className="prefix-inside"
          // tabIndex="-1"
        />
        <DynamicCaroussel
          id={fromId}
          fetchData={fetchData({ ...props, fromId, toId })}
          className="field calendar-month-field"
        />
      </div>
      <div className="col-2-5 col-br">
        <Input
          id={toId}
          format={value => isDateL(value) ? moment(value, 'l').format(DATE_FORMAT_HTML5) : value}
          stateFormat={value => isDateHTML5(value) ? moment(value).format('l') : value}
          prefix={<IconCalendar className="fill-gray" />}
          className="prefix-inside"
          // tabIndex="-2"
        />
        <DynamicCaroussel
          id={toId}
          fetchData={fetchData({ ...props, fromId, toId, initDate: moment().add(1, 'months').toDate() })}
          className="field calendar-month-field"
        />
      </div>
      <div className="col text-right col-br">
        <div
          className="px-2 text-xs text-gray w-auto inline-block pointer underline light"
          onClick={onClickFlushButtonHandler}
        >
          {props.flushLabel}
        </div>
        { isRealTime === false &&
        <button className="inline-block green w-auto" onClick={onClickApplyButtonHandler}>
          <IconDone />
          <span>{props.applyLabel}</span>
        </button>
        }
      </div>
    </div>
  );
}


/**
 * propTypes
 * @type {Object}
 */
CalendarMonthIntervalCaroussel.propTypes =
{
  id: PropTypes.string,
  onChange: PropTypes.func,
  realTime: PropTypes.bool,
  flushLabel: PropTypes.string,
  applyLabel: PropTypes.string,
  onClickApplyButton: PropTypes.func,
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
  realTime: true,
  flushLabel: 'Clear settings',
  applyLabel: 'Apply',
  onClickApplyButton: () => true,
  ...CalendarMonthInterval.defaultProps,
};

CalendarMonthIntervalCaroussel.contextTypes =
{
  store: PropTypes.object,
};


/**
 * CalendarMonthIntervalCarousselButton connected data.
 * for button value updating
 */
const mapStateToProps = ({ form }, { fromId, toId }) => ({
  start: form[fromId],
  end: form[toId],
});


const simplifyDateInterval = (fromDate, toDate) =>
{
  if (fromDate.format('YYYY') !== toDate.format('YYYY'))
  {
    return `${moment(fromDate, DATE_FORMAT_HTML5).format('ll')} - ${moment(toDate, DATE_FORMAT_HTML5).format('ll')}`;
  }
  else if(fromDate.format('M') !== toDate.format('M'))
  {
    return `${fromDate.format('YYYY')}. ${moment(fromDate, DATE_FORMAT_HTML5).format('MMM. D')} - ${moment(toDate, DATE_FORMAT_HTML5).format('MMM. Do')}`;
  }

  return `${fromDate.format('YYYY')}. ${fromDate.format('MMMM')} ${moment(fromDate, DATE_FORMAT_HTML5).format('D')}-${moment(toDate, DATE_FORMAT_HTML5).format('Do')}`;
}

/**
 * Button invoke CalendarMonthIntervalCaroussel on popover
 */
export const CalendarMonthIntervalCarousselButton = connect(mapStateToProps, { close })((props) =>
{
  const { start, end } = props;

  const value = isDateHTML5(start) && isDateHTML5(end) ? simplifyDateInterval(moment(start, DATE_FORMAT_HTML5), moment(end, DATE_FORMAT_HTML5)) : '';

  return (
    <Button
      id={props.id}
      buttonClassName="shadow outline fill-gray"
      {...props}
      data={{}}
      popover={
        <CalendarMonthIntervalCaroussel
          onClickApplyButton={() => props.close()}
          {...props}
        />
      }
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
