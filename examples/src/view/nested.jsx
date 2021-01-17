import React from 'react';

import View from '../../../src/view/view';

import { toggleView } from '../../../src/view/actions';

import ViewMenu from '../../../src/view/viewMenu';
import ViewButton from '../../../src/view/viewButton';
import IconFilter from '../../../src/icon/mui/image/tune';

/**
 * [ViewNested description]
 */
const ViewNested = () =>
(
  <div>

    <div className="grid-2-2">
      <div className="col-1-4">
        <ViewMenu />
      </div>
      <div className="col-1-4">
        <ViewMenu
          group="data"
        />
      </div>
      <div className="col-1-4">
        <div className="text-center">
          <ViewButton id="filter">
            <IconFilter className="w-2 h-2" />
          </ViewButton>
          <div className="pt-1 text-xs light text-gray">filter</div>
        </div>
      </div>
    </div>

    <View
      id='sample-view'
      defaultView='layout'
      settings={{
        groups: {
          layout: [
            { id: 'data', status: 1 },
            { id: 'chart', status: 0 },
            { id: 'filter', status: 1 },
          ],
          data: [
            { id: 'list', status: 1 },
            { id: 'card', status: 0 },
            { id: 'grid', status: 0 },
          ],
          chart: [
            { id: 'pie', status: 1 },
            { id: 'line', status: 0 },
          ],
          list: [
            { id: 'preview', status: 1 },
            { id: 'edit', status: 1 },
          ],
        },
      }}
      nested
    >
      <div data-view="chart" className="py-1">
        <div data-view="pie">chart-pie</div>
        <div data-view="line">chart-line</div>
      </div>

      <div data-view="data" className="py-1">
        <div data-view="list">
          <div data-view="preview">data-list-preview</div>
          <div data-view="edit">data-list-edit</div>
          <div>hidden</div>
          <div data-view="hidden">hidden</div>
        </div>
        <div data-view="card">card</div>
        <div data-view="grid">grid</div>
        <div>hidden</div>
        <div data-view="hidden">hidden</div>
      </div>

      <div data-view="filter" className="py-1">
        filter
      </div>

      <div data-view="hidden">hidden</div>
      <div>hidden</div>
    </View>
  </div>
);

export default ViewNested;
