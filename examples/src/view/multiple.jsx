import React from 'react';
import PropTypes from 'prop-types';


import { toggleView } from '../../../src/view/actions';

import View from '../../../src/view/view';
import ViewMenu from '../../../src/view/viewMenu';
import ViewTab from '../../../src/view/viewTab';



import { TABS } from './tab';


/**
 * [ViewMultiple description]
 */
const ViewMultiple = ({}, { store }) =>
(
  <div>

    <div className="grid-2-2">
      {/* <div onClick={() => store.dispatch(toggleView('dataTab', 1, 'data'))}>aaa</div> */}
      <div className="col-1-4">
        <ViewMenu
          group="layout"
        />
      </div>
      <div className="col-1-4">
        <ViewMenu
          group="data"
        />
      </div>
    </div>

    <View
      id='sample-view'
      defaultView='layout'
      settings={{
        groups: {
          layout: [
            { id: 'data', status: 1 },
            { id: 'chart', status: 1 },
            { id: 'filter', status: 1 },
          ],
          data: [
            { id: 'dataList', status: 1 },
            { id: 'dataTab', status: 1 },
          ],
        },
      }}
      nested
    >
      <div data-view="chart" className="py-1">
        Layer: chart
      </div>

      <div data-view="data" className="py-1">
        <div data-view="dataList">
          Layer: data/list
        </div>
        <div data-view="dataTab">
          <div>Layer: data/tab</div>
          

          <div className="p-2 border">
            <div className="text-m bold">inside tab</div>

            <ViewTab
              className="border p-1"
              classNameButtons="flex"
              classNameButton="w-auto yellow"
              classNameButtonActive="w-auto green"
              items={[
                ...TABS.slice(1),
                {
                  title: 'foo',
                  children:
                    <div>
                      <View
                        settings={{
                          groups: {
                            insideTab: [
                              { id: 'insideTab1', status: 1 },
                              { id: 'insideTab2', status: 0 },
                            ],
                          },
                        }}
                        nested
                      >
                        <div data-view="insideTab1">insideTab1</div>
                        <div data-view="insideTab2">insideTab2</div>
                      </View>
                    </div>,
                  status: 1,
                },
              ]}
            />

          </div>
        </div>
      </div>

      <div data-view="filter" className="py-1">
        Layer: filter
      </div>
    </View>
  </div>
);

ViewMultiple.contextTypes = {
  store: PropTypes.object,
};

export default ViewMultiple;
