
import React from 'react';
import PropTypes from 'prop-types';


/* !- React Actions */

// ...


/* !- React Elements */

// ...


/* !- Constants */

// ...



/**
* Footer Component
*/
const Footer = (props, { register, store }) =>
{
  return (
    <div>
      <div className="bold">Footer</div>
      <div>Infobar</div>
      <div>Newsletter</div>
      <div>Fatfooter</div>
      <div>Stores</div>
      <div>links</div>
    </div>
  );
};

Footer.contextTypes =
{
  register: PropTypes.object,
  store: PropTypes.object,
};

export default Footer;
