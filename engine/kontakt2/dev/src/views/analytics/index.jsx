
import React from 'react';


/* !- React Elements */

import GridView from '@1studio/ui/view/grid';
import Connect from '@1studio/ui/grid/connect';


import Filters from './filters';
import Chart from './chart';
import Grid from './grid';
import { PivotTableFilter } from './pivotTable';


/* !- Actions */

// ...;


/* !- Constants */

import { SETTINGS } from './const';

/**
 * Analytics View
 */
const Analytics = () =>
(
  <GridView
    id="analytics"
    className="column"
    settings={SETTINGS}
  >
    <PivotTableFilter />

    <Filters />

    <div style={{ height: '200px', minHeight: '200px' }}>
      <Connect
        id="analytics-chart"
        UI={Chart}
      />
    </div>

    <Grid />

  </GridView>
);

export default Analytics;
