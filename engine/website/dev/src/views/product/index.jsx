
import React from 'react';
import PropTypes from 'prop-types';


/* !- React Actions */

// ...


/* !- React Elements */

// ...


/* !- Constants */

// ...



/**
* Product Component
*/
const Product = (props, { register, store }) =>
{
  return (
    <div>Product</div>
  );
};

Product.contextTypes =
{
  register: PropTypes.object,
  store: PropTypes.object,
};

export default Product;
