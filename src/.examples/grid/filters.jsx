
import React from 'react';
import PropTypes from 'prop-types';


/* !- Actions */

import { unsetValues, setValues } from '../../../src/form/actions';


/* !- React Elements */

import { Grid as GridView } from '../../../src/view';
import Connect from '../../../src/grid/connect';
import Grid from '../../../src/grid/pure/grid';

import GridDate from '../../../src/grid/pure/gridDate';
import GridSelectGroupBy from '../../../src/grid/pure/gridSelectGroupBy';
import GridFieldGroupBy from '../../../src/grid/pure/gridFieldGroupBy';
import GridFilters from '../../../src/grid/pure/gridFilters';

import {
  Input,
  Button,
  Dropdown,
} from '../../../src/form/intl';


/* !- Constatnts */

import { DATA, SETTINGS } from './constants';

const fakeApi = () => new Promise(resolve => resolve({ status: 'SUCCESS', records: DATA }));

/**
 * Connect
 */
const Example = (props, { store }) =>
(
  <GridView
    id="sample"
    api={fakeApi}
    settings={SETTINGS}
    className="p-4"
  >
    <h1>Grid Filters</h1>

    <button className="outline shadow w-auto mb-4" onClick={e => {
        e.preventDefault();
        store.dispatch(unsetValues({ search: undefined }));  // test
        store.dispatch(setValues({ search: 's. taylor' }));
        store.dispatch(setValues({ search: 's. taylor2' }));
      }}>
      apply filter outside
    </button>

    <GridFilters
      // format={gridFilterFormat}
      className="mb-2"
      tagClassName="tag button outline small shadow w-auto blue mr-1/2"
    />

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

Example.contextTypes =
{
  store: PropTypes.object,
};

export default Example;
