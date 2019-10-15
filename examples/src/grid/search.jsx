
import React from 'react';
import { search } from '../../../src/grid/filters';


/* !- React Elements */

import { Grid as GridView } from '../../../src/view';
import Connect from '../../../src/grid/connect';
import Grid from '../../../src/grid/pure/grid';
import GridSearch, { FilterTerm } from '../../../src/grid/pure/gridSearch';


/* !- Constants */

// import { DATA } from './constants';
//
const DATA = [
  { "id": 1, "name": "Megan J. Cushman", "gender": '1', "visits": "2" },
  { "id": 2, "name": "Taylor R. Fallin", "gender": '2', "visits": "22" },
];



const fakeApi = () => new Promise(resolve => resolve({ status: 'SUCCESS', records: DATA }));

const SETTINGS = {
  hook:
  {
    id: 'id',
    name: 'Name',
    gender:
    {
      title: 'Gender',
      format: ({ value, helper }, config = {}) =>
        ((helper.gender) ? helper.gender[value] || value : value),
    },
    visits: 'Visits',
  },
  helper:
  {
    gender: { 1: 'male', 2: 'female' },
  },
  paginate:
  {
    limit: 0,
  },
  filters:
  [
    {
      id: 'search',
      handler: (record, value, filters, model, index) => search({
        record,
        value,
        helpers: SETTINGS.helper,
        hooks: SETTINGS.hook,
        index,
      }),
      arguments: [],
      status: false,
      // arguments: ['name=Á&gender==male&id<10'],
      // status: true,
    },
  ],
};


const fieldData = [
  { id: 'name', title: 'Name' },
  { id: 'id', title: 'Id' },
  { id: 'gender', title: 'Gender' },
  { id: 'visits', title: 'Visits' },
];


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
    <h1>Grid Search component</h1>
    <h2>Query search</h2>

    <div className="filters">
      <GridSearch
        fields={fieldData}
        prefix="?"
      />
    </div>

    <Connect
      UI={Grid}
    />

  </GridView>
);

export default Example;
