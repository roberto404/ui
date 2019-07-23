
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


/* !- Actions */

import { dialog } from '@1studio/ui/layer/actions';


/* !- Constants */

import { SETTINGS } from './const';


/**
* ProductWebGrid Component
*/
const ProductWebGrid = (props, { register, store }) =>
{
  return (
    <GridView
      id="productWeb"
      className="column"
      settings={SETTINGS}
    >
      <div className="filters">
        <Input
          id="search"
          label={<div className="icon embed-search-gray-dark">Keresés</div>}
          placeholder="Cikkszám vagy terméknév..."
        />
        <GridSelectGroupBy
          id="flag"
          placeholder="Címkék"
        />
        <GridSelectGroupBy
          id="category"
          placeholder="Kategória"
        />
        <Button
          id="inoutlet"
          placeholder="Leértékelt"
        />
        <Button
          id="incart"
          placeholder="Nem kosarazható"
        />
      </div>

      <div className="card mb-0 p-0 shadow-outer border border-white grid grow">
        <Connect>
          <Grid
            className="overflow"
            onClickCell={record => store.dispatch(dialog(<div style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(record, undefined, 4)}</div>))}
            freezeHeader
            // infinity
          />
        </Connect>
      </div>

    </GridView>
  );
};

ProductWebGrid.contextTypes =
{
  store: PropTypes.object,
  register: PropTypes.object,
};

export default ProductWebGrid;
