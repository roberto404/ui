import React, { useEffect } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';

require('../../../assets/style/index.scss');


/* !- Actions */

import { dialog } from '../../layer/actions';
import { setData, flush } from '../../grid/actions';
import { setValues } from '../../form/actions';


/* !- Context */

import withGridContext from './withGridContext';


/* !- Constants */

const GRID_ID = 'story-without-grid';

const SETTINGS = {
  paginate: { limit: 0 },
  order: { column: 'datetime', direction: 'asc' },
};

const DAY = 'YYMMDD';
const START = moment('2026-07-01');

/**
 * Foglalások unix időbélyeggel (a hét napjaira szórva)
 */
const DATA = [
  { id: '1', status: '1', userName: 'Kiss Kata', person: 2, day: 0, time: '12:30', message: 'Ablak mellé' },
  { id: '2', status: '2', userName: 'Szabó Bence', person: 1, day: 0, time: '18:00' },
  { id: '3', status: '1', userName: 'Tóth Hanna', person: 4, day: 1, time: '19:15', message: 'Születésnap' },
  { id: '4', status: '2', userName: 'Varga Máté', person: 5, day: 2, time: '13:00' },
  { id: '5', status: '3', userName: 'Horváth Lili', person: 2, day: 2, time: '20:00' },
  { id: '6', status: '1', userName: 'Molnár Ádám', person: 3, day: 4, time: '11:45' },
].map(({ day, time, ...record }) => ({
  ...record,
  datetime: moment(`${START.clone().add(day, 'days').format('YYYY-MM-DD')} ${time}`).unix(),
}));

const STATUS_COLORS: Record<number, string> = { 1: 'blue', 2: 'yellow', 3: 'green' };


/* !- Elements */

const ReservationCard = ({ status, datetime, person, userName, message = '', extended = false, className = '' }: any) => {
  const dispatch = useDispatch();

  return (
    <div className={`pointer ${className}`} onClick={() => dispatch(dialog(<div className="p-3">{userName}</div>))}>
      <div
        className={`py-1/2 pr-1 text-right border-right border-2 border-${STATUS_COLORS[parseInt(status)]}`}
        style={{ minWidth: '6em' }}
      >
        <div className="mb-1/2">{moment.unix(datetime).format('HH:mm')}</div>
        <div className="text-s text-gray light">{`${person} fő`}</div>
      </div>

      {extended &&
        <div className="pt-1/2 pl-1" style={{ width: 'calc(100% - 6em)' }}>
          <div className="mb-1/2 ellipsis">{userName}</div>
          <div className="text-s text-gray light ellipsis">{message}</div>
        </div>
      }
    </div>
  );
};

/**
 * Egy nap oszlopa (kattintásra kiválasztja a napot a form store-ban)
 */
const DayColumn = ({ date, reservations }: { date: string, reservations: any[] }) => {
  const dispatch = useDispatch();
  const selected = useSelector(({ form }: any) => form.reservationDay);
  const dateMoment = moment(date, DAY);
  const isSelected = selected === date;

  return (
    <div className="px-1">
      <div className="text-center pointer" onClick={() => dispatch(setValues({ reservationDay: date }))}>
        <div className="mb-1/2">
          <div className={`circle w-3 h-3 mx-auto h-center v-center ${isSelected ? 'bg-gray-dark text-white' : ''}`}>
            {dateMoment.format('D')}
          </div>
        </div>
        <div className="mb-2 text-gray light">{dateMoment.format('ddd')}</div>
      </div>
      <div className="bg-white-light p-1 rounded border border-gray-light">
        {reservations.map(reservation => <ReservationCard key={reservation.id} {...reservation} className="mb-2" />)}
      </div>
    </div>
  );
};

/**
 * Jobb oldal: napokra bontott foglalások a grid store-ból
 */
const Columns = () => {
  const reservations = useSelector(({ grid }: any) => grid[GRID_ID]?.data || []);
  const days: Record<string, any[]> = {};

  reservations.forEach((reservation: any) => {
    const date = moment.unix(reservation.datetime).format(DAY);
    days[date] = [...(days[date] || []), reservation];
  });

  return (
    <div className="flex">
      {Object.keys(days).map(date => <DayColumn key={date} date={date} reservations={days[date]} />)}
    </div>
  );
};

/**
 * Bal oldal: a kiválasztott nap foglalásai részletesen
 */
const OneDay = () => {
  const selected = useSelector(({ form }: any) => form.reservationDay);
  const reservations = useSelector(({ grid }: any) => grid[GRID_ID]?.rawData || [])
    .filter(({ datetime }: any) => moment.unix(datetime).format(DAY) === selected);

  return (
    <div>
      <div className="text-center mb-2">
        <div className="mb-1/2 h-3">{moment(selected, DAY).format('dddd')}</div>
        <div className="text-gray light">{moment(selected, DAY).format('YYYY. MM. DD.')}</div>
      </div>
      {reservations.map((reservation: any) => (
        <ReservationCard
          key={reservation.id}
          {...reservation}
          className="rounded bg-white-light border border-gray-light p-1 mb-1 flex"
          extended
        />
      ))}
    </div>
  );
};

/**
 * A grid store használata <Grid> komponens nélkül (setData + saját megjelenítés)
 */
const Reservations = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setData(DATA, SETTINGS, GRID_ID) as any);
    dispatch(setValues({ reservationDay: START.format(DAY) }));

    return () => {
      dispatch(flush(GRID_ID) as any);
    };
  }, []);

  return (
    <div className="grid-2 p-3">
      <div className="col-1-3">
        <OneDay />
      </div>
      <div className="col-2-3">
        <Columns />
      </div>
    </div>
  );
};


/* !- Stories */

const meta = {
  title: 'Grid/Without Grid',
  component: Reservations,
  decorators: [withGridContext],
} satisfies Meta<typeof Reservations>;

export default meta;

export const Default: StoryObj<typeof meta> = {
  name: 'Foglalási naptár',
};
