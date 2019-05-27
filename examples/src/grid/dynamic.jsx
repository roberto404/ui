
import React from 'react';


/* !- React Elements */

import { Grid as GridView } from '@1studio/ui/view';
import Connect from '@1studio/ui/grid/connect';
// import Connect from '@1studio/ui/connect';
import Grid from '@1studio/ui/grid/pure/grid';

import {
  Input,
} from '@1studio/ui/form/pure/intl';


/* !- Constatnts */

import { DATA, SETTINGS } from './constants';

const fakeApi = () => new Promise(resolve => resolve({ status: 'SUCCESS', records: DATA }));

/**
 * GridView + Filters + Connect + Paginate
 */
const Example = () =>
(
  <GridView
    id="sample"
    api={fakeApi}
    settings={SETTINGS}
    className="p-4"
  >
    <div className="filters">
      <Input
        id="search"
        label={<div className="icon embed-search-gray-dark">Search</div>}
        placeholder="Name..."
      />
    </div>

    <Connect
      UI={Grid}
    />

  </GridView>
);

export default Example;
