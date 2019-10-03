
import React from 'react';


/* !- React Elements */

import GridView from '@1studio/ui/view/grid';
import GridDownload from '@1studio/ui/grid/pure/gridDownload';
import Connect from '@1studio/ui/grid/connect';
import IconDownload from '@1studio/ui/icon/mui/action/save_alt';

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

    <div className="pin-br column w-auto center p-3">
      <GridDownload
        id="analytics-grid"
        label={<IconDownload />}
        className="action large red shadow mt-1/2"
      />
    </div>

  </GridView>
);

export default Analytics;
