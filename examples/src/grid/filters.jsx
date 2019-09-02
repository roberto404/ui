
import React from 'react';


/* !- React Elements */

import { Grid as GridView } from '../../../src/view';
import Connect from '../../../src/grid/connect';
import Grid from '../../../src/grid/pure/grid';

import GridDate from '../../../src/grid/pure/gridDate';
import GridSelectGroupBy from '../../../src/grid/pure/gridSelectGroupBy';
import GridFieldGroupBy from '../../../src/grid/pure/gridFieldGroupBy';

import {
  Input,
  Button,
  Dropdown,
} from '../../../src/form/pure/intl';


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
        label={<div className="icon embed-arrow-down-gray">Search</div>}
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
        helper={[{ id: 1, title: 'Male' }, { id: '2', title: 'Female' }]}
      />
      <GridDate
        id="visit"
      />
      <Dropdown
        id="gender"
        label="Gender"
        placeholder="Show all"
        data={[
          { id: '1', title: 'Male' },
          { id: '2', title: 'Female' },
        ]}
      />
    </div>

    <Connect
      UI={Grid}
    />


  </GridView>
);

export default Example;
