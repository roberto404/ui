
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import PivotTable from '@1studio/utils/array/pivotTable';
import count from '@1studio/utils/array/count';
import countUnique from '@1studio/utils/array/countUnique';
import sum from 'lodash/sum';
import mean from 'lodash/mean';
import max from 'lodash/max';
import min from 'lodash/min';
import sort from '@1studio/utils/array/sort';
import simplify from '@1studio/utils/math/simplify';


/* !- React Elements */

import GridView from '@1studio/ui/view/grid';
import Grid from '@1studio/ui/grid/pure/grid';

import {
  Input,
  Dropdown,
} from '@1studio/ui/form/pure/intl';

import IconStore from '../../icons/store';
import IconChart from '../../icons/pieChartInside';


/* !- Actions */

// import { dialog } from '@1studio/ui/layer/actions';


/* !- Constants */

import { SETTINGS, SIMPLIFY_ROOT, SIMPLIFY_UNITS, SIMPLIFY_FORMAT } from './const';


const SUMMARIES = {
  count,
  countUnique,
  sum,
  max,
  min,
  mean,
};


/**
 * Grid show pivotTable
 */
const PivotTableComponent = ({
  data,
  hook,
  dateCompare,
  row,
  field,
  summarize,
},
{
  store,
}) =>
{
  let gridData = [];
  let comparedData = [];
  let totalValue = 0;
  let totalDiff = 0;

  if (dateCompare && data.length)
  {
    const model = store.getState().grid.analytics.model;
    model.filters = { id: 'date', arguments: [dateCompare], status: true };

    const pivotCompare = new PivotTable(model.results, field, SUMMARIES[summarize], [row, 's']);
    comparedData = pivotCompare.toArray();
  }

  /**
   * Extend pivotTable product details (brand, manufacturer...etc)
   * @param  {object} record pivotTableRecord { id: sku, count: sum, 2: <RS2 sum>, 4: <RS4 sum>}
   * @return {object}        { title, subtitle ...}
   */
  const pivotTransformator = (record) =>
  {
    let title = record.id;
    let subtitle = '';
    let saledProduct = {};

    if (row === 'pi')
    {
      /**
      * Database saled product record
      */
      saledProduct = data.find(product => product.pi === record.id) || {}; // final record sum

      title = `${saledProduct.b} ${saledProduct.t}`;
      subtitle = record.id;
    }

    /**
     * Compare PivotTable same record
     */
    const comparedProduct = comparedData.find(product => product.id === record.id) || {};

    return {
      id: record.id,
      title,
      subtitle,
      traffic: record[summarize],
      trafficB: comparedProduct[summarize],
      rs2: record['2'],
      rs2B: comparedProduct['2'],
      rs6: record['6'],
      rs6B: comparedProduct['6'],
      rs8: record['8'],
      rs8B: comparedProduct['8'],
      row,
    };
  };

  if (data.length)
  {
    const pivot = new PivotTable(data, field, SUMMARIES[summarize], [row, 's']);
    const pivotArray = pivot.toArray(pivotTransformator);

    gridData = sort(
      pivotArray.slice(0, -1),
      (a, b) => a.title >= b.title,
    );

    const totalRecord = pivotArray[pivotArray.length - 1];

    totalValue = simplify(totalRecord.traffic, SIMPLIFY_ROOT, SIMPLIFY_UNITS, SIMPLIFY_FORMAT);
    totalDiff = totalRecord.traffic / totalRecord.trafficB || 1;

    console.log(pivot.result);
    console.log(pivot.toArray());
    console.log(gridData);
  }


  return (
    <div className="grow scroll-y">

      <div className="flex h-center my-1 pin-x pin-t">
        <div className="w-4 h-4 p-1 bg-white-light circle shadow-outer">
          <IconStore className="fill-gray-dark" />
        </div>
        <div className="px-1 text-black bold text-l">
          {totalValue}
        </div>
        <div className="w-2 h-2 bg-gray-light circle">
          <IconChart className="fill-green" />
        </div>
        <div className="px-1 text-black bold text-l">
          {Math.round(totalDiff * 100)}%
        </div>
      </div>

      <div className="card mb-0 p-0 shadow-outer border border-white grid grow scroll-y">
        <Grid
          hook={hook}
          data={gridData}
          freezeHeader
          infinity
        />
      </div>

    </div>
  );
};

PivotTableComponent.contextTypes =
{
  store: PropTypes.object,
};

const ConnectedGrid = connect(
  ({ grid, form }) =>
  ({
    data: (grid.analytics || {}).data,
    model: (grid.analytics || {}).model,
    hook: (grid.analytics || {}).hook,
    dateCompare: form.dateCompare,
    row: form.row,
    field: form.field,
    summarize: form.summarize,
  }),
)(PivotTableComponent);


const AnalyticsGrid = () =>
(
  <GridView
    id="analytics"
    className="column"
    settings={SETTINGS}
  >
    {/* PivotTable Props + Filters */}

    <div className="grid">
      <div className="col-1-3 mb-1">

        <div className="filters gray-dark" style={{ justifyContent: 'flex-start' }}>
          <Dropdown
            id="row"
            className="inline-block"
            buttonClassName="gray outline shadow"
            label="Sorok"
            value="pi"
            data={[
              { id: 'pi', title: 'Termék' },
              { id: 'b', title: 'Márka' },
              { id: 'm', title: 'Gyártó' },
              { id: 's', title: 'Áruház' },
              { id: 'l', title: 'Város' },
              { id: 'd', title: 'Napok' },
            ]}
            placeholder={false}
          />
          <Dropdown
            id="field"
            className="inline-block"
            buttonClassName="gray outline shadow"
            label="Érték"
            value="q"
            data={[
              { id: 'q', title: 'Mennyiség' },
              { id: 'p', title: 'Ár' },
            ]}
            placeholder={false}
          />
          <Dropdown
            id="summarize"
            className="inline-block"
            buttonClassName="gray outline shadow"
            label="Összegzés"
            value="sum"
            data={Object.keys(SUMMARIES).map(key => ({ id: key, title: key }))}
            placeholder={false}
          />
        </div>
      </div>

      <div className="col-2-3">
        <div className="filters">
          <Input
            id="search"
            label={<div className="icon embed-search-gray-dark">Keresés</div>}
            placeholder="Cikkszám vagy terméknév..."
          />
          <Dropdown
            id="date"
            className="inline-block"
            buttonClassName="gray outline shadow"
            label="Időszak"
            placeholder="Teljes időszak"
            data={[
              { id: '2019-01', title: '2019 január' },
              { id: '2019-02', title: '2019 február' },
              { id: '2019-03', title: '2019 március' },
              { id: '2019-04', title: '2019 április' },
              { id: '2019-05', title: '2019 május' },
              { id: '2019-06', title: '2019 június' },
              { id: '2019-07', title: '2019 július' },
            ]}
          />
          <Dropdown
            id="dateCompare"
            className="inline-block"
            buttonClassName="gray outline shadow"
            label="Hasonlít"
            placeholder="Teljes időszak"
            // value="2019-01"
            data={[
              { id: '2019-01', title: '2019 január' },
              { id: '2019-02', title: '2019 február' },
              { id: '2019-03', title: '2019 március' },
              { id: '2019-04', title: '2019 április' },
              { id: '2019-05', title: '2019 május' },
              { id: '2019-06', title: '2019 június' },
              { id: '2019-07', title: '2019 július' },
            ]}
          />
        </div>
      </div>
    </div>

    <ConnectedGrid />
  </GridView>
);

export default AnalyticsGrid;
