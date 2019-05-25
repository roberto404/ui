import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import moment from 'moment';



/* !- React Elements */

import Field from '../formField';
import CalendarMonthForm from './calendarMonth';
import DateTime from './datetime';


/* !- React Actions */

import { popover, close } from '../../layer/actions';
import { setValues } from '../../form/actions';






export class CalendarMonthButton extends Field
{
  onChangeCalendar = ({ id, value, form }) =>
  {
    this.context.store.dispatch(setValues({ [id]: value }, form));
    this.context.store.dispatch(close());
  };

  onClickButtonHandler = (event) =>
  {
    event.preventDefault();
    this.context.store.dispatch(popover(
      <div
        className="calendar-button-month"
      >
        <DateTime
          id={this.props.id}
          disableDay
          disableTime
          dateFormat={this.props.dateFormat}
          form={this.context.form}
          value="1900-01-01"
        />
        <CalendarMonthForm
          id={this.props.id}
          width={200}
          disableTitle
          dateFormat={this.props.dateFormat}
          onChange={this.onChangeCalendar}
          form={this.context.form}
        />
      </div>,
      event,
    ));
  };

  render()
  {
    const value = this.getValue();
    const formattedValue = this.props.onChange && value ?
      this.props.onChange(value, moment(value)) : value;

    const placeholder = this.props.intl ?
      this.props.intl.formatMessage({ id: this.props.placeholder }) : this.props.placeholder;

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
          { formattedValue || placeholder }
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
CalendarMonthButton.propTypes =
{
  ...CalendarMonthButton.propTypes,
};

/**
 * defaultProps
 * @type {Object}
 */
CalendarMonthButton.defaultProps =
{
  ...CalendarMonthButton.defaultProps,
  label: '',
  buttonClassName: '',
};

/**
 * contextTypes
 * @type {Object}
 */
CalendarMonthButton.contextTypes =
{
  store: PropTypes.object,
  id: PropTypes.string,
  form: PropTypes.string,
};


export default CalendarMonthButton;
