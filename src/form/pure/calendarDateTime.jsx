import React from 'react';
import PropTypes from 'prop-types';


/* !- React Elements */

import CalendarMonth from './calendarMonth';
import DateTime from './datetime';


/**
 * DateTime + CalendarMonth Component Combo
 * @type {[type]}
 */
const CalendarDateTime = ({
  id,
  form,
  className,
  onClickCalendar,
  value,
  dateFormat,
  min,
  max,
  validator,
  yearData,
  mounthData,
  hourData,
  minuteData,
}) =>
(
  <div className={className}>
    <DateTime
      id={id}
      form={form}
      disableTime
      disableDay
      className="m-0"
      value={value}
      dateFormat={dateFormat}
      yearData={yearData}
      mounthData={mounthData}
      hourData={hourData}
      minuteData={minuteData}
    />
  <div className="overflow" style={{ marginTop: '-1rem', marginBottom: '-2rem' }}>
    <div style={{ marginTop: '-3.5rem' }}>
      <CalendarMonth
        id={id}
        form={form}
        disableLabel
        onClick={onClickCalendar}
        value={value}
        dateFormat={dateFormat}
        min={min}
        max={max}
        validator={validator}
      />
    </div>
  </div>
  </div>
);

CalendarDateTime.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  onClickCalendar: PropTypes.func,
  form: PropTypes.string.isRequired,
};

CalendarDateTime.defaultProps = {
  id: 'calendarDateTime',
  className: 'overflow',
  onClickCalendar: () => true,
};

export default CalendarDateTime;
