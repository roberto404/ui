
import React from 'react';


/* !- React Elements */

import { Grid as GridView } from '@1studio/ui/view';
import Connect from '@1studio/ui/grid/connect';
import Grid from '@1studio/ui/grid/pure/grid';

import GridDate from '@1studio/ui/grid/pure/gridDate';
import GridSelectGroupBy from '@1studio/ui/grid/pure/gridSelectGroupBy';
import GridFieldGroupBy from '@1studio/ui/grid/pure/gridFieldGroupBy';

import {
  Input,
  Button,
} from '@1studio/ui/form/pure/intl';


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
    <h1>Grid Filters</h1>


    <div className="filters">
      <Input
        id="search"
        label={<div className="icon embed-search-gray-dark">Search</div>}
        placeholder="Name..."
      />
      <Button
        id="isMale"
        placeholder="is Male"
      />
      <GridSelectGroupBy
        id="gender"
        placeholder="Gender"
      />
      <GridFieldGroupBy
        id="gender"
        placeholder="Gender"
        helper={[{ id: 1, title: 'Female' }, { id: 2, title: 'Male' }]}
      />
      <GridDate
        id="visit"
      />
    </div>

    <Connect
      UI={Grid}
    />


  </GridView>
);

export default Example;
