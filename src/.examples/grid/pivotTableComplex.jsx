
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import count from '@1studio/utils/array/count';
import countUnique from '@1studio/utils/array/countUnique';
import PivotTable, { collectionGroupBy } from '@1studio/utils/array/pivotTable';
import sum from 'lodash/sum';
import mean from 'lodash/mean';
import max from 'lodash/max';
import min from 'lodash/min';


/* !- React Elements */

import GridView from '../../../src/view/grid';
import Grid from '../../../src/grid/pure/grid';

import {
  Input,
  Dropdown,
} from '../../../src/form/intl';


/* !- Constants */

const DATA = [
  { id: 1, product: 'Product #1', store: 'store #1', date: '2019-07-23', price: 200, quantity: 1 },
  { id: 2, product: 'Product #2', store: 'store #2', date: '2019-07-22', price: 200, quantity: 1 },
  { id: 3, product: 'Product #1', store: 'store #1', date: '2019-07-22', price: '200', quantity: '3' },
  { id: 4, product: 'Product #1', store: 'store #1', date: '2019-07-22', price: 100, quantity: 1 },
  { id: 5, product: 'Product #1', store: 'store #1', date: '2019-07-22', price: 100, quantity: 5 },
  { id: 6, product: 'Product #2', store: 'store #2', date: '2019-07-23', price: 100, quantity: 2 },
  { id: 7, product: 'Product #2', store: 'store #1', date: '2019-07-23', price: 20, quantity: 1 },
  { id: 8, product: 'Product #2', store: 'store #1', date: '2019-08-23', price: 20, quantity: 1 },
  { id: 9, product: 'Product #3', store: 'store #2', date: '2019-08-23', price: 20, quantity: 1 },
  { id: 10, product: 'Product #3', store: 'store #1', date: '2019-08-23', price: 10, quantity: 1 },
  { id: 11, product: 'Product #3', store: 'store #1', date: '2019-08-23', price: 10, quantity: 2 },
  { id: 12, product: 'Product #3', store: 'store #1', date: '2019-08-23', price: 10, quantity: 1 },
];

const SUMMARIES = {
  count,
  countUnique,
  sum,
  max,
  min,
  mean,
};

const SETTINGS = {
  paginate:
  {
    page: 1,
    limit: 0,
  },
  filters:
  [
    {
      id: 'search',
      handler: (record, term) => term.split(/[ ,]+/g).every(word =>
        record.product.toString().toLowerCase().indexOf(word.toString().toLowerCase()) >= 0,
      ),
      arguments: [],
      status: false,
    },
    {
      id: 'date',
      handler: (record, terms) => record.date.indexOf(terms) === 0,
      arguments: [],
      status: false,
    },
  ],
};


const fakeApi = () => new Promise(resolve => resolve({ status: 'SUCCESS', records: DATA }));


/**
 * Grid show pivotTable
 */
const PivotTableComponent = ({
  data,
  row,
  column,
  field,
  summarize,
}) =>
{
  let gridData = [];
  let hook = {};

  if (data.length)
  {
    const pivot = new PivotTable(data, field, SUMMARIES[summarize], [row, column]);
    gridData = pivot.toArray();

    hook = { id: row };

    collectionGroupBy(data, column)
      .map(({ id }) => id)
      .sort()
      .forEach(id => hook[id] = id);

    hook[summarize] = summarize;
  }

  return (
    <div className="card mb-0 p-0 shadow-outer border border-white grid grow scroll-y">
      <Grid
        hook={hook}
        data={gridData}
      />
    </div>
  );
};

const ConnectedGrid = connect(
  ({ grid, form }) =>
  ({
    data: (grid.analytics || {}).data,
    row: form.row,
    column: form.column,
    field: form.field,
    summarize: form.summarize,
  }),
)(PivotTableComponent);


const Example = () =>
(
  <GridView
    id="analytics"
    className="column"
    api={fakeApi}
    settings={SETTINGS}
  >
    {/* PivotTable Props + Filters */}

    <div className="grid">
      <div className="col-1-2 mb-1">

        <div className="filters" style={{ justifyContent: 'flex-start' }}>
          <Dropdown
            id="row"
            className="inline-block"
            buttonClassName="gray outline shadow"
            label="Row"
            value="product"
            data={Object.keys(DATA[0]).map(key => ({ id: key, title: key }))}
            placeholder={false}
          />
          <Dropdown
            id="column"
            className="inline-block"
            buttonClassName="gray outline shadow"
            label="Column"
            value="store"
            data={Object.keys(DATA[0]).map(key => ({ id: key, title: key }))}
            placeholder={false}
          />
          <Dropdown
            id="field"
            className="inline-block"
            buttonClassName="gray outline shadow"
            label="Field"
            value="quantity"
            data={Object.keys(DATA[0]).map(key => ({ id: key, title: key }))}
            placeholder={false}
          />
          <Dropdown
            id="summarize"
            className="inline-block"
            buttonClassName="gray outline shadow"
            label="Summarize"
            value="count"
            data={Object.keys(SUMMARIES).map(key => ({ id: key, title: key }))}
            placeholder={false}
          />
        </div>
      </div>

      <div className="col-1-2">
        <div className="filters">
          <Input
            id="search"
            label={<div className="icon embed-search-gray-dark">Search</div>}
            placeholder="Product..."
          />
          <Dropdown
            id="date"
            className="inline-block"
            buttonClassName="gray outline shadow"
            label="Period"
            placeholder="All data"
            data={[
              { id: '2019-07', title: 'July' },
              { id: '2019-08', title: 'Aug' },
            ]}
          />
        </div>
      </div>
    </div>

    {/* PivotTable */}

    <ConnectedGrid />
  </GridView>
);

export default Example;
