
import React, { Component } from 'react';
import Tree from '@1studio/utils/models/tree';


/* !- React Elements */

import IconParent1 from '../../../src/icon/mui/social/notifications';
import IconParent2 from '../../../src/icon/mui/action/explore';
import IconParent3 from '../../../src/icon/mui/action/assignment_turned_in';
import IconParent4 from '../../../src/icon/mui/action/lock';

import IconChild1 from '../../../src/icon/mui/action/update';
import IconChild2 from '../../../src/icon/mui/action/verified_user';

import IconArrow from '../../../src/icon/mui/navigation/expand_more';

import Connect from '../../../src/connect';
import NestedList, { Menu as NestedListItem } from '../../../src/grid/pure/nestedList';
import NestedListItem2 from '../../../src/grid/pure/nestedItems/menu';



/* !- Constants */

const Menu = new Tree([
  { id: 1, status: 1, title: 'Item 1.0', pid: 0, pos: 0, icon: IconParent1 },
  { id: 2, status: 1, title: 'Item 1.2', pid: 1, pos: 1, icon: IconChild1 },
  { id: 3, status: 1, title: 'Item 1.1', pid: 1, pos: 0, icon: IconChild2 },
  { id: 4, status: 1, title: 'Item 2.1', pid: 5, pos: 0, icon: IconChild1, value: 12 },
  { id: 5, status: 1, title: 'Item 2.0', pid: 0, pos: 1, icon: IconParent2, badge: 2 },
  { id: 6, status: 1, title: 'Item 1.3', pid: 1, pos: 2, icon: IconParent1 },
  { id: 7, status: 1, title: 'Item 1.2.1', pid: 2, pos: 0, icon: IconParent1 },
  { id: 8, status: 1, title: 'Item 2.2', pid: 5, pos: 1, active: true, icon: IconChild2, value: 1 },
  { id: 9, status: 1, title: 'Item 3.0', pid: 0, pos: 2, icon: IconParent4 },
]);



/**
 * GridView + Filters + Connect + Paginate
 */
const Example = () =>
(
  <div>

    <div className="p-1" style={{ width: '300' }}>
      <NestedList
        nestedData={Menu.getNestedTree()}
        UI={NestedListItem2(Menu, (a) => console.log(a), { minimalized: false })}
      />
    </div>

    {/* <div className="card m-0 p-0 shadow-outer border border-white column h-screen">
      <div className="grid grow overflow">
        <div className="col-1-3 bg-white-semi-light p-4 scroll-y">
          <Connect>
          <NestedList
            nestedData={Menu.getNestedTree()}
            // nestedData={{
            //   '#1': {
            //     '#2': {
            //       '#3:': {},
            //     },
            //   },
            //   '#4': {
            //     '#5': {},
            //   },
            // }}
            UI={NestedListItem(Menu, (a) => console.log(a))}
          />
          </Connect>
        </div>
        <div className="col-2-3 border-left border-gray-light p-4 scroll-y">
          ...
        </div>

      </div>
    </div> */}

  </div>
);

export default Example;
