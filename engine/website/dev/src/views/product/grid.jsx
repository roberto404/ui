
import React from 'react';
import PropTypes from 'prop-types';


/* !- React Actions */

// ...


/* !- React Elements */

import GridView from '@1studio/ui/view/grid';
import Connect from '@1studio/ui/grid/connect';
import { ProductConnectUI } from '../../components/product/productThumbnail';
import ProductFilter from '../../components/product/productFilter';


/* !- Constants */

import { productPropsParser, loadProducts } from '../../components/product/const';


/**
* ProductGridView Component
*/
const ProductGridView = (props, { config }) =>
{

  return (
    <GridView
      id="products"
      settings={{ paginate: { limit: 21 } }}
      api={loadProducts(config.products)}
      className="wrapper"
    >
      <div className="flex">
        <div className="col-4-12 pr-2">
          <ProductFilter />
        </div>
        <Connect
          UI={ProductConnectUI}
        />
      </div>
    </GridView>
  );
};

ProductGridView.contextTypes =
{
  config: PropTypes.object,
};

export default ProductGridView;
