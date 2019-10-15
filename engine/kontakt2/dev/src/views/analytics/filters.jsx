
import React from 'react';
import count from '@1studio/utils/array/count';
import countUnique from '@1studio/utils/array/countUnique';
import sum from 'lodash/sum';
import mean from 'lodash/mean';
import max from 'lodash/max';
import min from 'lodash/min';
import moment from 'moment';
import produceNumericArray from '@1studio/utils/array/produceNumericArray';


/* !- React Elements */

import {
  Input,
  Dropdown,
} from '@1studio/ui/form/pure/intl';

import PivotTable from './pivotTable';


/* !- Actions */

// ...;


/* !- Constants */

import { DATE_FORMAT, HISTORY_MONTHS } from './const';

const SUMMARIES = {
  count,
  countUnique,
  sum,
  max,
  min,
  mean,
};

const initDate = moment().add(1, 'months');

const dateData = produceNumericArray(1, HISTORY_MONTHS).map(() =>
  ({ id: initDate.add(-1, 'month').format(DATE_FORMAT), title: initDate.format('YYYY MMMM') }));


/**
 * Pivot props and filters
 */
const AnalyticsFilters = () =>
(
  <div className="grid">
    <div className="col-1-3 mb-1">
      <PivotTable />
    </div>

    <div className="col-2-3">
      <div className="filters">
        <Input
          id="search"
          label={<div className="icon embed-search-gray-dark">Keresés</div>}
          placeholder="Cikkszám vagy terméknév..."
        />
        <Dropdown
          id="method"
          buttonClassName="gray outline shadow"
          // label="Vásárlás"
          placeholder="Összes"
          data={[
            { id: '22', title: 'Azonnali' },
            { id: '33', title: 'Megrendeléses' },
          ]}
        />
        <Dropdown
          id="date"
          buttonClassName="gray outline shadow"
          label="Időszak"
          placeholder="Teljes időszak"
          data={dateData}
        />
        <Dropdown
          id="dateCompare"
          buttonClassName="gray outline shadow"
          label="Hasonlít"
          placeholder="&empty;"
          // value="2019-01"
          data={dateData}
        />
      </div>
    </div>
  </div>
);

export default AnalyticsFilters;
