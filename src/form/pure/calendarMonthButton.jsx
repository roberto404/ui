import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';


/* !- React Elements */

import CalendarDateTime from './calendarDateTime';
import Button from './button';
import IconCalendar from '../../icon/mui/action/calendar_today';


/**
 * Button form field.
 * CalendarDateTime open on layer.
 */
const CalendarMonthButton = (props, { form }) =>
(
  <Button
    id={props.id}
    placeholder="placeholder.select"
    className="w-content"
    buttonClassName="shadow outline fill-gray"
    popover={<CalendarDateTime id={props.id} form={form} />}
    stateFormat={value => value ? moment(value).format('LL') : ''} // eslint-disable-line
    icon={IconCalendar}
    {...props}
  />
);


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
};

export default CalendarMonthButton;
