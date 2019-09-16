
import React from 'react';
import count from '@1studio/utils/array/count';
import countUnique from '@1studio/utils/array/countUnique';
import sum from 'lodash/sum';
import mean from 'lodash/mean';
import max from 'lodash/max';
import min from 'lodash/min';


/* !- React Elements */

import {
  Input,
  Dropdown,
} from '@1studio/ui/form/pure/intl';

import PivotTable from './pivotTable';


/* !- Actions */

// ...;


/* !- Constants */

const SUMMARIES = {
  count,
  countUnique,
  sum,
  max,
  min,
  mean,
};


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
          buttonClassName="gray outline shadow"
          label="Hasonlít"
          placeholder="&empty;"
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
);

export default AnalyticsFilters;
