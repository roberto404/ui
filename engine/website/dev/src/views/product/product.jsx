
import React from 'react';
import PropTypes from 'prop-types';


/* !- React Actions */

// ...


/* !- React Elements */

import Product from '../../components/product/product';
import NotFound from '../notFound';


/* !- Constants */

import { productPropsParser } from '../../components/product/const';


/**
* ProductView Component
*/
const ProductView = ({ match }, { config }) =>
{
  const { sku } = match.params;
  const product = config.products.find(({ i }) => i === sku);

  if (!product)
  {
    return <NotFound />;
  }

  return (
    <Product
      record={productPropsParser(product)}
      helper={config}
    />
  );
};

ProductView.contextTypes =
{
  config: PropTypes.object,
};

export default ProductView;
