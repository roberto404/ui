
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedTime, FormattedDate, FormattedRelative } from 'react-intl';
import moment from 'moment';


/* !- Action */

import { dialog } from '../../../src/layer/actions';
import { setData } from '../../../src/grid/actions';
import { setValues } from '../../../src/form/actions';


/* !- Constants */

import { DATE_FORMAT_HTML5 } from '../../../src/calendar/constants';

export const SETTINGS = {
  paginate:
  {
    limit: 0,
  },
  order:
  {
    column: 'datetime',
    direction: 'desc',
  },
};

const DATA = [
  { id: '1', status: '1', userName: 'Kimberely N. Pennypacker', person: 2, datetime: '1561986363' },
  { id: '2', status: '2', userName: 'Penny H. Solomon', person: 1, datetime: '1562386363' },
  { id: '3', status: '1', userName: 'Hector K. Giles', person: 4, datetime: '1562186363' },
  { id: '4', status: '2', userName: 'Cheryl J. Brown', person: 5, datetime: '1561986362' },
  { id: '5', status: '3', userName: 'Kimberly J. Glenn', person: 2, datetime: '1561986361' },
  { id: '6', status: '1', userName: 'Angelina C. Doman', person: 3, datetime: '1562845487' },
];

const STATUS_COLORS = {
  1: 'blue',
  2: 'yellow',
  3: 'green',
};

/**
 * Reservation component which display details of reservation
 */
const ReservationCard = ({
  status,
  datetime,
  person,
  userName,
  message,
  extended,
  className,
},
{
  store,
}) =>
{
  const onClickCardHandler = () => store.dispatch(dialog(<div>{userName}</div>));

  return (
    <div className={`pointer ${className}`} onClick={onClickCardHandler}>
      <div className={`py-1/2 pr-1 text-right border-right border-2 border-${STATUS_COLORS[parseInt(status)]}`} style={{ minWidth: '6em' }}>
        <div className="mb-1/2">
          <FormattedTime value={new Date(parseInt(datetime) * 1000)} />
        </div>
        <div className="text-s text-gray light">{`${person} fő`}</div>
      </div>

      { extended === true &&
      <div className="pt-1/2 pl-1" style={{ width: 'calc(100% - 6em)' }}>
        <div className="mb-1/2 ellipsis">{userName}</div>
        <div className="text-s text-gray light ellipsis">{message}</div>
      </div>
      }
    </div>
  );
};

ReservationCard.propTypes = {
  status: PropTypes.string.isRequired,
  datetime: PropTypes.string.isRequired,
  person: PropTypes.string.isRequired,
  userName: PropTypes.string.isRequired,
  message: PropTypes.string,
  extended: PropTypes.bool,
  className: PropTypes.string,
};

ReservationCard.defaultProps = {
  message: '',
  extended: false,
  className: '',
};

ReservationCard.contextTypes = {
  store: PropTypes.object,
};


/**
 * Display reservations one day in compact layout
 */
const ReservationsColumnByDate = (
{
  date,
  reservations,
  selected,
  setValues,
}) =>
{
  const dateMoment = moment(date, 'YYMMDD');
  const isToday = moment().format('YYMMDD') === date;
  const isSelected = moment(selected, DATE_FORMAT_HTML5).format('YYMMDD') === date;

  const onClickDateHandler = () =>
    setValues({ id: 'selected', value: dateMoment.format(DATE_FORMAT_HTML5) });

  const rows = reservations.map(reservation => (
    <ReservationCard
      key={reservation.id}
      {...reservation}
      className="mb-2"
    />
  ));

  const dayNumberSelectedClass = isSelected ? 'bg-gray-dark text-white' : '';
  const dayNumberClass = isToday ? 'bg-red text-white' : dayNumberSelectedClass;

  return (
    <div className="px-1">
      <div className="text-center pointer" onClick={onClickDateHandler}>
        <div className="mb-1/2">
          <div className={`circle w-3 h-3 mx-auto h-center v-center ${dayNumberClass}`}>
            {dateMoment.format('D')}
          </div>
        </div>
        <div className="mb-2 text-gray light">{dateMoment.format('dddd')}</div>
      </div>
      <div className="bg-white-light p-1 rounded border border-gray-light">
        { rows }
      </div>
    </div>
  );
};

const Column = connect(
  ({ form }) => ({
    selected: form.selected,
  }),
  {
    setValues,
  },
)(ReservationsColumnByDate);


/**
 * Right component which display reservation determined date intervals by days
 */
const ReservationsColumns = (
{
  reservations,
  start,
  end,
}) =>
{
  const startUnix = moment(start, DATE_FORMAT_HTML5).unix();
  const endUnix = moment(end, DATE_FORMAT_HTML5).unix();
  /**
   * @example
   * {
   *  '20160201': [{...}, {...}],
   *  '20160202': [{...}, {...}],
   * }
   */
  const reservationsGroupByDays = {};

  reservations
    .filter(({ datetime }) => datetime >= startUnix && datetime <= endUnix)
    .forEach((reservation) =>
    {
      const date = moment(reservation.datetime * 1000).format('YYMMDD');

      if (!reservationsGroupByDays[date])
      {
        reservationsGroupByDays[date] = [];
      }

      reservationsGroupByDays[date].push(reservation);
    });

  const columns = Object.keys(reservationsGroupByDays).map(date => (
    <Column
      key={date}
      date={date}
      reservations={reservationsGroupByDays[date]}
    />
  ));


  return (
    <div className="flex">
      {columns}
    </div>
  );
};

const ConnectedReservationsColumns = connect(
  ({ grid, form }) => ({
    start: form.start,
    end: form.end,
    reservations: grid.sample ? grid.sample.data : [],
  }),
)(ReservationsColumns);


/**
 * Left component which display reservation on selected date
 */
const ReservationsOneDay = (
{
  reservations,
  selected,
}) =>
{
  return (
    <div>
      <div className="text-center">
        <div className="mb-1/2 h-3">
          <FormattedRelative value={moment(selected, DATE_FORMAT_HTML5).toDate()} />
        </div>
        <div className="mb-2 text-gray light">
          <FormattedDate
            value={moment(selected, DATE_FORMAT_HTML5).toDate()}
            year="numeric"
            month="long"
            day="numeric"
          />
        </div>
      </div>
      <div>
        {
          reservations.map(reservation => (
            <ReservationCard
              key={reservation.id}
              {...reservation}
              className="rounded bg-white-light border border-gray-light p-1 mb-1 flex"
              extended
            />
          ))
        }
      </div>
    </div>
  );
};

const ConnectedReservationsOneDay = connect(
  ({ grid, form }) =>
  {
    const selectedDate = moment(form.selected, DATE_FORMAT_HTML5).format('YYMMDD');
    const reservationFilter = ({ datetime }) => moment(datetime * 1000).format('YYMMDD') === selectedDate;

    return ({
      selected: form.selected,
      reservations: grid.sample ? grid.sample.rawData.filter(reservationFilter) : [],
    });
  },
)(ReservationsOneDay);


/**
 * Working with grid store without <Grid> Component
 */
const Example = (props, { store }) =>
{
  store.dispatch(setData(
    DATA,
    SETTINGS,
    'sample',
  ));

  store.dispatch(setValues({
    selected: '20190701T00:00',
    start: '20190701T00:00',
    end: '20190831T00:00',
  }));

  return (
    <div className="grid-2 p-4">
      <div className="col-1-3">
        <ConnectedReservationsOneDay />
      </div>
      <div className="col-2-3">
        <ConnectedReservationsColumns />
      </div>
    </div>
  );
};

Example.contextTypes =
{
  store: PropTypes.object,
};

export default Example;
