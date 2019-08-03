import React from 'react';
import moment from 'moment';


/* !- React Elements */

import Button from '../../../src/form/pure/button';
import CalendarMonthCaroussel, { CalendarMonthCarousselButton } from '../../../src/form/pure/calendarMonthCaroussel';
import { CalendarMonthIntervalCarousselButton } from '../../../src/form/pure/calendarMonthIntervalCaroussel';
import DynamicCaroussel from '../../../src/caroussel/dynamicCaroussel';
import { fetchData } from '../../../src/form/pure/calendarMonthInterval';


/* !- Constants */

const fixWidthHeight = {
  width: '200px',
  height: '200px',
};

/**
 * Calendar Example
 */
const Example = () =>
(
  <div className="p-2">
    <h1>Calendar Caroussel Components</h1>

    <h2>One month</h2>
    <div style={fixWidthHeight}>
      <CalendarMonthCaroussel
        id="oneMonth"
      />
    </div>

    <h2>On button</h2>
    <CalendarMonthCarousselButton />

    <h2>On button from sketch</h2>
    <Button
      id="oneMonthButton"
      placeholder="placeholder.select"
      className="w-content"
      buttonClassName="shadow outline fill-gray"
      popover={CalendarMonthCaroussel}
      stateFormat={value => value ? moment(value).format('LL') : ''}
    />

    <h2>Two month Interval from sketch</h2>
    <div style={{ width: '400px' }}>
      <div className="grid-2">
        <DynamicCaroussel
          id={'twoMonthInterval-1'}
          fetchData={fetchData('twoMonthInterval')}
          className="field calendar-month-field col-1-2"
        />
        <DynamicCaroussel
          id={'twoMonthInterval-2'}
          fetchData={fetchData('twoMonthInterval', undefined, undefined, undefined, moment().add(1, 'months').toDate())}
          className="field calendar-month-field col-1-2"
        />
      </div>
    </div>

    <h2>On button classic two month style</h2>

    <div style={{ width: '600px' }}>
      <CalendarMonthIntervalCarousselButton
        id="CalendarMonthIntervalCarousselButton"
      />
    </div>
  </div>
);

export default Example;
