
import React from 'react';
import PropTypes from 'prop-types';


/* !- React Actions */

// ...


/* !- React Elements */

// ...


/* !- Constants */

// ...



/**
* Header Component
*/
const Header = (props, { register, store }) =>
{
  return (
    <div>
      <div className="bold">Header</div>
      <div>Logo</div>
      <div>Szlogen</div>
      <div>Gyorskereső</div>
      <div>Belépés</div>
      <div>Akció, kedvencek, kosár</div>
      <div>Menu</div>
    </div>
  );
};

Header.contextTypes =
{
  register: PropTypes.object,
  store: PropTypes.object,
};

export default Header;
