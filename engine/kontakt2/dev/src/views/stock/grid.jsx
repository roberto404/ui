
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';


/* !- React Elements */

import GridView from '@1studio/ui/view/grid';
import Connect from '@1studio/ui/grid/connect';
import Reload from '@1studio/ui/grid/reload';
import Grid from '@1studio/ui/grid/pure/grid';
import GridDownload from '@1studio/ui/grid/pure/gridDownload';
import Input from '@1studio/ui/form/pure/input';
import Toggle from '@1studio/ui/form/pure/toggle';
import Button from '@1studio/ui/form/pure/button';
import Pagination from '@1studio/ui/pagination/pure/pagination';
import ShowAll from  '@1studio/ui/pagination/pure/showall';
// import Calendar from '@1studio/ui/form/pure/calendarMonthCaroussel';
import CalendarMonthCaroussel, { CalendarButton }  from '@1studio/ui/form/pure/calendarMonthCaroussel';


/* !- Constants */

import { SETTINGS } from './const';



/**
* StockGrid Component
*/
const StockGrid = () =>
(
  <GridView
    id="stock"
    settings={{
      ...SETTINGS,
      helper: {
        permission: 1,
      },
    }}
    className="grid"
  >
    <div className="col-1-2">
      <div className="text-gray-dark p-2">
        Termék kereső
      </div>
    </div>

    <div className="col-1-2 filters">

      <Input
        id="search"
        label={<div className="icon embed-search-gray-dark">Keresés</div>}
        placeholder="Cikkszám vagy terméknév..."
      />

      <Button
        id="instock"
        placeholder="Készleten"
      />

      <Button
        id="minkesz"
        placeholder="Készlet probléma"
      />

      <CalendarButton
        id="arvalt"
        placeholder={<div className="icon embed-calendar-gray-dark label">Árváltozás</div>}
        onChange={value => moment(value).fromNow()}
      />

    </div>

    <Connect
      UI={Grid}
      uiProps={{
        className: 'card',
        // rowElement: ({ data, columns }) => (
        //   <div>{columns.map(column => <div style={{width: '10%'}} key={column}>{data[column]}</div>)}</div>
        // ),
        noResults: 'stock.noResults',
      }}
    />

    <div className="col-3-12">
      <Reload
        sec={10}
        className="text-s text-gray"
      />
    </div>

    <div className="col-6-12">
      <Connect
        UI={Pagination}
        uiProps={{
          limit: 5,
        }}
      />
    </div>

    <div className="col-3-12 text-right">
      <ShowAll
        className="flat"
        label={<div className="icon embed-angle-double-yellow">Mind</div>}
      />
      <GridDownload
        className="flat"
        label={<div className="icon embed-download-yellow">Letöltés</div>}
      />
    </div>

  </GridView>
);

export default StockGrid;
