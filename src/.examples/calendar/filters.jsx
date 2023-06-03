import React from 'react';
import moment from 'moment';


/* !- React Elements */

import Button from '../../form/components/button';
import CalendarMonthButton from '../../form/components/calendarMonthButton';
import CalendarMonthCaroussel, { CalendarMonthCarousselButton } from '../../form/components/calendarMonthCaroussel';
import { CalendarMonthIntervalCaroussel, CalendarMonthIntervalCarousselButton } from '../../form/components/calendarMonthIntervalCaroussel';

/**
 * Calendar Example
 */
const Example = () =>
(
  <div className="p-2">

    <h1>Calendar Filters</h1>

    <div className="filters">

      <CalendarMonthButton
        id="calendarDateTimeButton"
      />

      <CalendarMonthCarousselButton />

      <Button
        id="oneMonthButton"
        placeholder="placeholder.select"
        className="w-content"
        buttonClassName="shadow outline fill-gray"
        popover={CalendarMonthCaroussel}
        stateFormat={value => value ? moment(value).format('LL') : ''}
      />

      <CalendarMonthIntervalCarousselButton
        id="CalendarMonthIntervalCarousselButton"
        label="szállítás"
        fromId="a"
        toId="b"
        placeholder="placeholder"
        realTime={false}
      />
    </div>
  </div>
);

export default Example;
