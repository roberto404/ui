import React from 'react';
import moment from 'moment';


/* !- React Elements */

import Button from '../../../src/form/pure/button';
import DateTime from '../../../src/form/pure/datetime';
import CalendarDateTime from '../../../src/form/pure/calendarDateTime';
import CalendarMonth from '../../../src/form/pure/calendarMonth';
import CalendarMonthInterval from '../../../src/form/pure/calendarMonthInterval';
import CalendarMonthButton from '../../../src/form/pure/calendarMonthButton';
import { DoubleIntervalCalendar } from '../../../src/form/pure/calendarMonthIntervalButton';
import Pager from '../../../src/pagination/pure/calendar';

import IconArrowBack from '../../../src/icon/mui/navigation/arrow_back';
import IconToday from '../../../src/icon/mui/image/lens';
import IconCalendar from '../../../src/icon/mui/action/calendar_today';


/* !- Constants */

const fixWidth = {
  width: '200px',
};


/**
 * Calendar Example
 */
const Example = () =>
(
  <div className="p-2">

    <h1>Calendar Components</h1>

    <h2>Calendar static month</h2>
    <div style={fixWidth}>
      <CalendarMonth
        id="calendarMonth"
        className={{
          inactive: [2, 3, 4],
        }}
      />
    </div>

    <h2>Calendar Year/Month helper</h2>
    <div style={fixWidth}>
      <CalendarDateTime />
    </div>

    <h2>Calendar with custom made helpers</h2>
    <div style={fixWidth}>
      <div className="flex v-right mb-1">
        <Pager
          months={-1}
          id="calendarTime"
          className="w-auto p-0"
        >
          <IconArrowBack />
        </Pager>
        <Pager
          date={new Date()}
          id="calendarTime"
          className="w-auto p-0 fill-red"
        >
          <IconToday />
        </Pager>
        <Pager
          months={1}
          id="calendarTime"
          className="w-auto p-0"
        />
      </div>
      <CalendarMonth
        id="calendarTime"
      />
      <DateTime
        id="calendarTime"
        disableDate
        disableDay
      />
    </div>

    <h2>Calendar on button</h2>
    <CalendarMonthButton
      id="calendarDateTimeButton"
    />

    <h2>Custom Calendar on button</h2>
    <Button
      id="customCalendarButton"
      placeholder="placeholder.select"
      className="w-content"
      buttonClassName="shadow outline fill-gray"
      popover={(
        <div className="flex">
          <div>
            <Pager
              date={new Date()}
              id="customCalendarButton"
              className="w-auto outline"
            >
              Today
            </Pager>
            <Pager
              days={7}
              id="customCalendarButton"
              className="w-auto outline"
            >
              + 1 week
            </Pager>
          </div>
          <CalendarMonth
            id="customCalendarButton"
          />
        </div>
      )}
      stateFormat={value => value ? moment(value).format('LL') : ''}
      icon={IconCalendar}
    />

    <h2>Interval Calendar</h2>
    <div style={fixWidth}>
      <CalendarMonthInterval
        form="calendar"
        fromId="calendarFrom"
        toId="calendarTo"
        className={{
          inactive: [2, 3, 4],
        }}
      />
    </div>

    <h2>Calendar Interval with fix length</h2>
    <div style={fixWidth}>
      <CalendarMonthInterval
        intervalLength={5}
      />
    </div>

    <h2>Double Calendar Interval</h2>
    <div style={{ width: '400px' }}>
      <DoubleIntervalCalendar />
    </div>

  </div>
);

export default Example;
