
import React from 'react';
import PropTypes from 'prop-types';


/* !- React Elements */

import GridView from '@1studio/ui/view/grid';
import Connect from '@1studio/ui/grid/connect';
import Grid from '@1studio/ui/grid/pure/grid';
import GridSelectGroupBy from '@1studio/ui/grid/pure/gridSelectGroupBy';

import {
  Input,
  Select,
  Button,
} from '@1studio/ui/form/pure/intl';



/* !- Constants */

import { SETTINGS } from './const';


/**
* ProductWebGrid Component
*/
const ProductWebGrid = (props, { register }) =>
{
  return (
    <GridView
      id="productWeb"
      className="column"
      settings={SETTINGS}
      onLoad={ data => console.log(data)}
      // onLoad="selectFirst"
    >
      <div className="filters">
        <Input
          id="search"
          label={<div className="icon embed-search-gray-dark">Keresés</div>}
          placeholder="Cikkszám vagy terméknév..."
        />
      </div>

      <div className="card mb-0 p-0 shadow-outer border border-white grid grow">
        <Connect>
          <Grid
            className="overflow"
            freezeHeader
          />
        </Connect>
      </div>

    </GridView>
  );
};

ProductWebGrid.contextTypes =
{
  register: PropTypes.object,
};

export default ProductWebGrid;
