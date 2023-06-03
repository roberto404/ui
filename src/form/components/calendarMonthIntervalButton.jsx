import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import moment from 'moment';



/* !- Contexts */

import { FormContext } from '../context';
import { AppContext, bindContexts } from '../../context';


/* !- React Elements */

import Field from '../formField';
import CalendarMonthForm from './calendarMonth';
import Calendar from './calendarMonthInterval';
import DateTime from './datetime';


/* !- React Actions */

import { popover, close } from '../../layer/actions';
import { setValues } from '../../form/actions';


/**
 * Display two continuous calendar
 */
export const DoubleIntervalCalendar = ({ id, year, month, intervalLength, UI }) =>
(
  <div className="grid-4">
    <div className="col-1-2" style={{ width: '50%' }}>
      <Calendar
        id={id[0]}
        year={year}
        month={month}
        UI={UI}
        intervalLength={intervalLength}
      />
    </div>
    <div className="col-1-2" style={{ width: '50%' }}>
      <Calendar
        id={id[1]}
        year={month === 12 ? year + 1 : year}
        month={month === 12 ? 1 : month + 1}
        UI={UI}
        intervalLength={intervalLength}
      />
    </div>
  </div>
);

DoubleIntervalCalendar.propTypes =
{
  id: PropTypes.arrayOf(PropTypes.string),
  year: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  month: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
};

DoubleIntervalCalendar.defaultProps =
{
  id: ['start', 'end'],
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1,
};


/**
 * [onChangeCalendar description]
 */
export class CalendarMonthIntervalButton extends Field
{
  onClickButtonHandler = (event) =>
  {
    event.preventDefault();

    this.context.store.dispatch(popover(
      <div style={{ width: '90vw' }}>
        <DoubleIntervalCalendar
          {...this.props}
        />
      </div>,
      event,
    ));
  };

  render()
  {
    const value = this.getValue();
    const startValue = value[this.props.id[0]];
    const endValue = value[this.props.id[1]];

    const placeholder = this.props.intl ?
      this.props.intl.formatMessage({ id: this.props.placeholder }) : this.props.placeholder;

    const formattedValue = (startValue || endValue) ?
      `${moment(startValue).format('ll')} - ${moment(endValue).format('ll')}` : placeholder;


    const fieldClass = classNames({
      field: true,
      'button-field': true,
      [this.props.className]: true,
      active: formattedValue,
    });

    return (
      <div className={fieldClass}>

        { this.label }

        <button
          onClick={this.onClickButtonHandler}
          className={this.props.buttonClassName}
        >
          { formattedValue }
        </button>

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
CalendarMonthIntervalButton.propTypes =
{
  ...CalendarMonthIntervalButton.propTypes,
};

/**
 * defaultProps
 * @type {Object}
 */
CalendarMonthIntervalButton.defaultProps =
{
  ...CalendarMonthIntervalButton.defaultProps,
  id: ['start', 'end'],
  placeholder: 'placeholder.select',
  label: '',
  buttonClassName: 'outline shadow embed-angle-down-gray',
};

export default bindContexts(CalendarMonthIntervalButton, [FormContext, AppContext]);
