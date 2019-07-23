
import React from 'react';
import PropTypes from 'prop-types';


/* !- React Elements */

import GridView from '@1studio/ui/view/grid';
import Connect from '@1studio/ui/grid/connect';
import FormConnect from '@1studio/ui/form/connect';
import Grid from '@1studio/ui/grid/pure/grid';

import Category from '../../components/category';


/* !- Constants */

import { SETTINGS } from './const';



/**
* CategoryGrid Component
*/
const CategoryGrid = () =>
(
  <GridView
    id="category"
    settings={SETTINGS}
    className="column"
    onLoad="selectFirst"
  >
    <div className="card mb-0 p-0 shadow-outer border border-white grid grow scroll-y">
      <div className="col-1-3 bg-white-semi-light">
        <Connect
          UI={Grid}
          uiProps={{
            className: 'w-full scroll-y',
            selectable: true,
            expandSelect: false,
            showHeader: false,
            multipleSelect: false,
          }}
        />
      </div>
      <div className="col-2-3 border-left border-gray-light p-4 scroll-y">
        <FormConnect
          id="category"
          UI={Category}
        />
      </div>
    </div>
  </GridView>
);

export default CategoryGrid;
