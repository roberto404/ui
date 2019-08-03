import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';


/* !- React Elements */

import Button from './button';
import DynamicCaroussel from '../../caroussel/dynamicCaroussel';
import { fetchData } from './calendarMonth';


/**
 * CalendarMonth with caroussel pager
 */
const CalendarMonthCaroussel = ({ id, onChange }) => (
  <DynamicCaroussel
    className="field calendar-month-field"
    id={id}
    fetchData={fetchData(id, onChange)}
  />
);

/**
 * propTypes
 * @type {Object}
 */
CalendarMonthCaroussel.propTypes =
{
  id: PropTypes.string,
  onChange: PropTypes.func,
};

/**
 * defaultProps
 * @type {Object}
 */
CalendarMonthCaroussel.defaultProps =
{
  id: 'calendarMonthCaroussel',
  onChange: () =>
  {},
};


/**
 * Button invoke CalendarMonthIntervalCaroussel on popover
 */
export const CalendarMonthCarousselButton = ({ id }) =>
(
  <Button
    id={id}
    placeholder="placeholder.select"
    className="w-content"
    buttonClassName="shadow outline fill-gray"
    popover={CalendarMonthCaroussel}
    stateFormat={value => value ? moment(value).format('LL') : ''} // eslint-disable-line
  />
);

/**
 * propTypes
 * @type {Object}
 */
CalendarMonthCarousselButton.propTypes =
{
  id: PropTypes.string,
};

/**
 * defaultProps
 * @type {Object}
 */
CalendarMonthCarousselButton.defaultProps =
{
  id: 'calendarMonthCarousselButton',
};

export default CalendarMonthCaroussel;
