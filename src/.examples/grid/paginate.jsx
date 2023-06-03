
import React from 'react';


/* !- React Elements */

import { Grid as GridView } from '../../../src/view';
import Connect from '../../../src/grid/connect';
import Grid from '../../../src/grid/pure/grid';
import ShowMore from '../../../src/pagination/pure/showmore';

import {
  Input,
} from '../../../src/form/intl';


/* !- Constatnts */

import { DATA, SETTINGS } from './constants';

const fakeApi = () => new Promise(resolve => resolve({
  status: 'SUCCESS',
  records: DATA.reduce(
    (results, i, n) =>
      [...results, ...DATA.map(record => ({ ...record, id: `${n}-${record.id}` }))]
  ),
}));

/**
 * GridView + Filters + Connect + Paginate
 */
const Example = () =>
(
  <GridView
    id="sample"
    api={fakeApi}
    settings={{ ...SETTINGS, paginate: { limit: 5 } }}
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

    <Connect
      UI={ShowMore}
      label="Show more!"
      format={({ current, limit }) => `${current} of ${limit} items`}
      autoPaginate
    />

  </GridView>
);

export default Example;
