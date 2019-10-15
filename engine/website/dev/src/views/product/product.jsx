
import React from 'react';
import PropTypes from 'prop-types';


/* !- React Actions */

// ...


/* !- React Elements */

import Product from '../../components/product/product';
import NotFound from '../notFound';


/* !- Constants */

// ..


/**
* ProductView Component
*/
const ProductView = ({ match, config }) =>
{
  const sku = match.params;
  const slug = match.url.substring(match.url.lastIndexOf('/') + 1);

  let product;

  if (sku)
  {
    product = config.products.find(({ id }) => id === sku)
  }

  if (!product)
  {
    product = config.products.find(product => product.slug === slug);
  }

  if (!product)
  {
    return <NotFound />;
  }

  return (
    <div className="wrapper">
      <Product
        record={product}
        helper={config}
      />
    </div>
  );
};

ProductView.defaultProps =
{
  match: {},
};

ProductView.contextTypes =
{
  config: PropTypes.object,
};

export default ProductView;
