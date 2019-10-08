import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

/* !- React Elements */

import GridView from '@1studio/ui/view/grid';
import Connect from '@1studio/ui/grid/connect';
import Reload from '@1studio/ui/grid/reload';
// import Reload from '/Users/roberto/Sites/ui/src/grid/reload';
import Grid from '@1studio/ui/grid/pure/grid';
import GridDownload from '@1studio/ui/grid/pure/gridDownload';
import Input from '@1studio/ui/form/pure/input';
import Toggle from '@1studio/ui/form/pure/toggle';
import Button from '@1studio/ui/form/pure/button';
import Pagination from '@1studio/ui/pagination/pure/pagination';
import ShowAll from '@1studio/ui/pagination/pure/showall';
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
    <div className="grid" style={{ minHeight: '100px', height: '100px' }}>
      <div className="col-1-2">
        <Reload sec={10} className="text-s text-gray" />
      </div>

      <div className="col-1-2 filters">
        <Input
          id="search"
          label={<div className="icon embed-search-gray-dark">Keresés</div>}
          placeholder="Cikkszám vagy terméknév..."
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
