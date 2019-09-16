
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PivotTable from '@1studio/utils/array/pivotTable';
import count from '@1studio/utils/array/count';
import countUnique from '@1studio/utils/array/countUnique';
import sum from 'lodash/sum';
import mean from 'lodash/mean';
import max from 'lodash/max';
import min from 'lodash/min';
import sort from '@1studio/utils/array/sort';
import simplify from '@1studio/utils/math/simplify';
import isEqual from 'lodash/isEqual';

/* !- React Elements */

import {
  Dropdown,
} from '@1studio/ui/form/pure/intl';

import IconStore from '../../icons/store';
import IconChart from '../../icons/pieChartInside';


/* !- Actions */

import { setData } from '@1studio/ui/grid/actions';


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


export const PivotTableFilter = () =>
(
  <div className="filters gray-dark flex h-center my-1 pin-x pin-t" style={{ justifyContent: 'flex-start' }}>
    {/*<Dropdown
      id="riport"
      buttonClassName="gray outline shadow"
      value="1"
      data={[
        { id: '1', title: 'Termék' },
      ]}
      label="Riport"
      placeholder={false}
    />*/}
    <Dropdown
      id="row"
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
        { id: 'sp', title: 'Eladó' },
      ]}
      placeholder={false}
    />
    <Dropdown
      id="field"
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
      buttonClassName="gray outline shadow"
      label="Összegzés"
      value="sum"
      data={Object.keys(SUMMARIES).map(key => ({ id: key, title: key }))}
      placeholder={false}
    />
  </div>
);


/**
 * Grid show pivotTable
 */
class PivotTableComponent extends Component
{
  constructor(props)
  {
    super(props);

    // current data state
    this.data = [];

    // current field state
    this.fields = {
      row: '',
      field: '',
      summarize: '',
      dateCompare: '',
    };

    this.state = {
      totalDiff: 0,
      totalValue: 0,
      totalUnit: 'forint',
    };
  }

  componentDidMount = () =>
  {
    // listen form changes
    if (this.context.store)
    {
      this.unsubscribe = this.context.store.subscribe(() => this.onChangeListener());
    }
  }

  componentWillUnmount()
  {
    if (this.unsubscribe)
    {
      this.unsubscribe();
    }
  }

  onChangeListener()
  {
    const store = this.context.store.getState();
    const storeForm = store.form || {};

    if (!store.grid.analytics)
    {
      return;
    }

    if (
      this.data.length !== store.grid.analytics.data.length
      || Object.keys(this.fields).some(field => storeForm[field] !== this.fields[field])
      || !isEqual(this.data, store.grid.analytics.data)
    )
    {
      this.data = store.grid.analytics.data;
      Object.keys(this.fields).forEach(field => this.fields[field] = storeForm[field]);

      this.reCalculate();
    }
  }

  reCalculate()
  {

    const store = this.context.store.getState();
    const storeAnalytics = store.grid.analytics || {};

    const {
      data,
      model,
      hook,
    } = storeAnalytics;

    const {
      field,
      summarize,
      row,
      dateCompare,
    } = this.fields;

    let comparedData = [];

    if (dateCompare && data.length)
    {
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

    if (data)
    {
      let totalDiff = 0;
      let totalValue = 0;

      const gridPivot = new PivotTable(data, field, SUMMARIES[summarize], [row, 's']);
      const gridData = gridPivot.toArray(pivotTransformator);
      const chartData = new PivotTable(data, 'p', SUMMARIES.sum, ['d', 's']).toArray();

      // apply results
      //
      if (chartData.length)
      {
        const totalRecord = chartData[chartData.length - 1];
        totalValue = simplify(totalRecord.sum, SIMPLIFY_ROOT, SIMPLIFY_UNITS, SIMPLIFY_FORMAT);
        // totalDiff = totalRecord.traffic / totalRecord.trafficB || 1;
        totalDiff = Math.round(1 * 100);
      }

      this.setState(
        {
          totalValue,
          totalDiff,
        },
        () =>
        {
          this.context.store.dispatch(setData(
            chartData.slice(0, -1),
            { paginate: SETTINGS.paginate },
            'analytics-chart',
          ));
          this.context.store.dispatch(setData(
            gridData.slice(0, -1),
            { paginate: SETTINGS.paginate },
            'analytics-grid',
          ));
        },
      );
    }
  }

  render()
  {
    return (
      <div className="flex h-center">
        <div className="w-4 h-4 p-1 bg-white-light circle shadow-outer">
          <IconStore className="fill-gray-dark" />
        </div>
        <div className="pl-1 pt-1/2 pr-4">
          <div className="text-black bold text-xxl">{this.state.totalValue}</div>
          <div className="text-s text-gray light">{this.state.totalUnit}</div>
        </div>
        <div className="w-2 h-2 bg-gray-light circle">
          <IconChart className="fill-green" />
        </div>
        <div className="px-1 text-black bold text-l">
          {this.state.totalDiff}%
        </div>
      </div>
    );
  }
}


PivotTableComponent.contextTypes =
{
  store: PropTypes.object,
};

export default PivotTableComponent;
