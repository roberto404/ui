
import React from 'react';


/* !- React Elements */

import { Grid as GridView } from '../../view/grid';
import Connect from '../../grid/connect';
import Grid from '../../grid/grid';
import Pagination from '../../pagination/pure/pagination';

/* !- Constants */

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

    <h2>Connect by props</h2>
    <Connect
      UI={Grid}
    />

    <h2>Connect by children</h2>
    <Connect>
      <Grid />
    </Connect>

    <h2>Connect props: listen['page', 'orderColumn'], onChange = console.log</h2>
    <Connect
      UI={Grid}
      listen={['page', 'orderColumn', 'totalPage']}
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
