
import React from 'react';
import PropTypes from 'prop-types';


/* !- React Actions */

// ...


/* !- React Elements */

import Product from '../../components/product/product';


/* !- Constants */

import { productPropsParser } from '../../components/product/const';



/**
* ProductView Component
*/
const ProductView = (props, { register, store, config }) =>
{
  console.log(config);

  return (
    <Product
      record={productPropsParser(config.products[1])}
      helper={{
        fabrics: config.fabrics,
        features: config.features,
        flags: config.flags,
      }}
    />
  );
};

ProductView.contextTypes =
{
  register: PropTypes.object,
  store: PropTypes.object,
  config: PropTypes.object,
};

export default ProductView;
