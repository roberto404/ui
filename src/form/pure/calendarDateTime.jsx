import React from 'react';
import PropTypes from 'prop-types';


/* !- React Elements */

import CalendarMonth from './calendarMonth';
import DateTime from './datetime';


/**
 * DateTime + CalendarMonth Component Combo
 * @type {[type]}
 */
const CalendarDateTime = ({ id, form, className, onClickCalendar }) =>
(
  <div className={className}>
    <DateTime
      id={id}
      form={form}
      disableTime
      disableDay
    />
    <div style={{ marginTop: '-70px' }}>
      <CalendarMonth
        id={id}
        form={form}
        disableTitle
        onClick={onClickCalendar}
      />
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
  className: '',
  onClickCalendar: () => true,
};

export default CalendarDateTime;
