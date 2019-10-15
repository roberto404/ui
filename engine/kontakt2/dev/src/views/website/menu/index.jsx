
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Tree from '@1studio/utils/models/tree';


/* !- Redux Actions */

import { flush } from '@1studio/ui/form/actions';


/* !- React Elements */

import GridView from '@1studio/ui/view/grid';
import Connect from '@1studio/ui/grid/connect';
import NestedList from '@1studio/ui/grid/pure/nestedList';
import NestedListItem from './nestedList';
import Form from './form';

import IconAdd from '@1studio/ui/icon/mui/content/add_circle_outline';


/* !- Constants */

import { SETTINGS } from './const';


/**
* WebMenu Component
*/
const WebMenu = (props, context) =>
(
  <GridView
    id="menu"
    settings={SETTINGS}
    className="column"
  >
    {/* Add new + Filters */}

    <div className="grid">
      <div className="col-1-3 mb-1">

        <button
          className="green outline shadow w-auto mr-2 inline-block"
          onClick={() => context.store.dispatch(flush('menu'))}
        >
          <IconAdd />
          <span>Új menu</span>
        </button>
      </div>

      <div className="col-2-3">
        <div className="filters" />
      </div>
    </div>

    <div className="card mb-0 p-0 shadow-outer border border-white grid grow scroll-y">
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

WebMenu.contextTypes =
{
  store: PropTypes.object,
};


export default WebMenu;
