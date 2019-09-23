
import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import Tree from '@1studio/utils/models/tree';


/* !- React Elements */

import GridView from '@1studio/ui/view/grid';
import Connect from '@1studio/ui/grid/connect';
import NestedList from '@1studio/ui/grid/pure/nestedList';
import NestedListItem from './nestedList';
import Form from './form';


/* !- Constants */

import { SETTINGS } from './const';


/**
* WebMenu Component
*/
const WebMenu = () =>
(
  <GridView
    id="menu"
    settings={SETTINGS}
    className="card m-0 p-0 shadow-outer border border-white column grow"
  >
    {/*<button onClick={() => window.location.href += '/0'}>Új létrehozása</button>*/}

    <div className="grid grow overflow">
      <Connect
        UI={({ rawData }) =>
        {
          const Menu = new Tree(rawData);

          return (
            <NestedList
              className="col-1-3 bg-white-semi-light p-4 scroll-y"
              nestedData={Menu.getNestedTree()}
              UI={NestedListItem(Menu)}
            />
          );
        }}
      />
      <div className="col-2-3 border-left border-gray-light p-4 scroll-y">
        <Form id="menu" />
      </div>
    </div>
  </GridView>
);


export default WebMenu;
