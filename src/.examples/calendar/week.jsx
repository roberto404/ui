import React from 'react';
import { useDispatch } from 'react-redux';
import moment from 'moment';


/* !- Redux Actions */

import { setData, addRecord } from '../../../src/grid/actions';


/* !- React Elements */

import CalendarDay from '../../../src/calendar/day';


/* !- Constants */

import { DATE_FORMAT } from '../../../src/calendar/constants';

const GRID_ID = 'example';

const data = [
  { id: 1, title: 'J. Cushman', start: '2019-08-26T11:00', end: '2019-08-26T12:00' },
];


/**
 * Calendar Example
 */
const Example = () =>
{
  const dispatch = useDispatch();

  dispatch(setData(data, {}, GRID_ID));

  const onChangeListener = ({ start, end, id }) =>
  {
    console.log(moment(start).format('LLLL'));
  }

  const onAddEventListener = ({ start, end }) =>
  {
    const event = {
      title: 'New',
      start,
      end,
    }
    dispatch(addRecord(event, GRID_ID))
  }

  return (
    <div className="p-2">

      <h1>Calendar Week Components</h1>

      <h2>Events</h2>
      <CalendarDay
        id={GRID_ID}
        height={500}
        width={800}
        start={moment().startOf('isoWeek').format(DATE_FORMAT)}
        end={moment().endOf('isoWeek').format(DATE_FORMAT)}
        startHour={9}
        endHour={20}
        xAxis={true}
        yAxis={true}
        onEditEvent={e=>console.log('edit',e)}
        onAddEvent={onAddEventListener}
        onEventMouseEnter={e=>console.log('enter', e)}
        onEventMouseLeave={onChangeListener}
      />

    </div>
  );
}

export default Example;
