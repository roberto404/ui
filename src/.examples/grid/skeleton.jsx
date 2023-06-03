
import React from 'react';


/* !- React Elements */

import { Grid as GridView } from 'src/view';
import Connect from 'src/grid/connect';
import Grid from 'src/grid/pure/grid';
import GridSearch, { FilterTerm, GridSearchDialog } from '../../../src/grid/pure/gridSearch';


/* !- Constatnts */

import { DATA, SETTINGS } from './constants';

const fakeApi = () => new Promise(resolve => setTimeout(() => resolve({ status: 'SUCCESS', records: DATA }), 2000));


/**
 * Connect
 */
const Example = () =>
(
  <GridView
    id="sample"
    api={fakeApi}
    settings={SETTINGS}
    className="p-4"
    onLayer
  >
    <h2>Skeleton</h2>

    {/* <div className="filters">
      <GridSearch
        fields={fieldData}
        prefix="?"
      />
    </div> */}

    <Connect
      skeleton={(
        <div className="grid-1-1">
          <div className="col-3-12"><div className="skeleton-line-s h-4" /></div>
          <div className="col-3-12"><div className="skeleton-line h-4" /></div>
          <div className="col-3-12"><div className="skeleton-line-s h-4" /></div>
          <div className="col-3-12 col-br"><div className="skeleton-line-s h-4" /></div>
        </div>
      )}
      skeletonRepeat={10}
    >
      <Grid />
    </Connect>

  </GridView>
);

export default Example;
