
import React from 'react';
import PropTypes from 'prop-types';


/* !- React Actions */

// ...


/* !- React Elements */

// ...


/* !- Constants */

// ...



/**
* Cart Component
*/
const Cart = (props, { register, store }) =>
{
  return (
    <div>Cart</div>
  );
};

Cart.contextTypes =
{
  register: PropTypes.object,
  store: PropTypes.object,
};

export default Cart;
