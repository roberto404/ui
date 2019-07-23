
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
* CategoryGrid Component
*/
const CategoryGrid = () =>
(
  <GridView
    id="category"
    settings={SETTINGS}
    className="grid"
  >
    <button onClick={() => window.location.href += '/0'}>Új létrehozása</button>
    
    <Connect
      UI={Grid}
      uiProps={{
        className: 'card',
      }}
    />

  </GridView>
);

export default CategoryGrid;
