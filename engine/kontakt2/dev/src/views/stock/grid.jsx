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
import ShowAll from '@1studio/ui/pagination/pure/showall';
import GridSearch from '@1studio/ui/grid/pure/gridSearch';
// import Calendar from '@1studio/ui/form/pure/calendarMonthCaroussel';
import CalendarMonthCaroussel, {
  CalendarButton,
} from '@1studio/ui/form/pure/calendarMonthCaroussel';

/* !- Constants */

import { SETTINGS } from './const';

/**
 * StockGrid Component
 */
const StockGrid = () => (
  <GridView id="stock" settings={SETTINGS} className="column">
    <div className="grid" style={{ minHeight: '50px', height: '50px' }}>
      <div className="col-1-2">
        <Reload sec={10} className="text-s text-gray" />
      </div>

      <div className="col-1-2 filters">
        <GridSearch
          id="search"
          placeholder="Cikkszám vagy terméknév..."
          fields={[
            { id: 'id', title: 'Cikkszám' },
            { id: 't', title: 'Megnevezés' },
            { id: 'rs', title: 'Összes szabad készlet' },
            { id: 'rs2', title: 'RS2 szabad készlet' },
            { id: 'rs21', title: 'RS2 gyártói minta' },
            { id: 'rs22', title: 'RS2 kivett készlet' },
            { id: 'rs6', title: 'RS6 szabad készlet' },
            { id: 'rs61', title: 'RS6 gyártói minta' },
            { id: 'rs62', title: 'RS6 kivett készlet' },
            { id: 'rs8', title: 'RS8 szabad készlet' },
            { id: 'rs81', title: 'RS8 gyártói minta' },
            { id: 'rs82', title: 'RS8 kivett készlet' },
            { id: 'p1', title: 'Eladási ár' },
            { id: 'r', title: 'Rendelési készlet' },
          ]}
          prefix="?"
        />
      </div>
    </div>

    <Connect
      UI={Grid}
      uiProps={{
        freezeHeader: true,
        className: 'card grow grid overflow',
        noResults: 'stock.noResults',
        infinity: true,
      }}
    />
  </GridView>
);

export default StockGrid;
