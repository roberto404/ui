
import React from 'react';


/* !- React Elements */

import { Grid as GridView } from 'src/view';
import Connect from 'src/grid/connect';
import Grid from 'src/grid/pure/grid';
import Pagination from 'src/pagination/pure/pagination';

/* !- Constatnts */

import { DATA, SETTINGS } from './constants';

const fakeApi = () => new Promise(resolve => resolve({ status: 'SUCCESS', records: DATA }));

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
  >
    <h1>Connect to Redux Store</h1>

    <h2>Connect like Props.UI</h2>
    <Connect
      UI={Grid}
    />

    <h2>Connect like Children</h2>
    <Connect>
      <Grid />
    </Connect>

    <h2>Connect props: listen['page', 'orderColumn'], onChange = console.log</h2>
    <Connect
      UI={Grid}
      listen={['page', 'orderColumn']}
      onChange={(state, prevState) => console.log(state, prevState)}
    />

    <h2>Connect Paginate</h2>
    <Connect
      UI={Pagination}
      limit="3"
    />


  </GridView>
);

export default Example;
