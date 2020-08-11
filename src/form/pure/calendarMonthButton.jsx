import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';


/* !- Redux Actions */

import { popover, close } from '../../layer/actions';


/* !- React Elements */

import CalendarDateTime from './calendarDateTime';
import Button from './button';
import IconCalendar from '../../icon/mui/action/calendar_today';


/**
 * Button form field.
 * CalendarDateTime open on layer.
 */
class CalendarMonthButton extends Component
{
  constructor(props, context)
  {
    super(props);

    this.state = {
      showCalendar: false,
    }

    this.calendar = (
      <CalendarDateTime
        id={props.id}
        form={context.form}
        className="label:hidden"
        onClickCalendar={({ value }) =>
        {
          if (this.isLayer)
          {
            this.setState({ showCalendar: false })
          }
          else
          {
            context.store.dispatch(close());
          }

          return true;
        }}
        min={props.min}
        max={props.max}
        validator={props.validator}
      />
    );

    const layer = context.store.getState().layer || {};
    this.isLayer = layer.active === true && layer.method !== 'preload';
  }

  onChangeHandler = (event) =>
  {
    if (this.isLayer)
    {
      this.setState({ showCalendar: !this.state.showCalendar });
    }
    else
    {
      this.context.store.dispatch(popover(
        <div className="pr-4">{this.calendar}</div>,
        event,
      ))
    }
  }

  render()
  {
    return (
      <div>
        { this.state.showCalendar === false &&
        <Button
          id={this.props.id}
          placeholder="placeholder.select"
          className="w-content"
          buttonClassName="shadow outline fill-gray"
          onClick={this.onChangeHandler}
          stateFormat={value => value ? moment(value).format('LL') : ''} // eslint-disable-line
          icon={IconCalendar}
          {...this.props}
        />
        }
        { this.state.showCalendar === true && this.calendar}
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
  id: PropTypes.string,
};

/**
 * defaultProps
 * @type {Object}
 */
CalendarMonthButton.defaultProps =
{
  id: 'calendarDateTimeButton',
};

CalendarMonthButton.contextTypes = {
  form: PropTypes.string,
  store: PropTypes.object,
};

export default CalendarMonthButton;
