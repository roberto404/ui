
import React from 'react';
import PropTypes from 'prop-types';


/* !- React Actions */

// ...


/* !- React Elements */

// ...


/* !- Constants */

import Menu from './header/menu';
import Breadcrumb from './header/breadcrumb';
import Share from './header/share';



/**
* Header Component
*/
const Header = (props, { config, store }) =>
{
  return (
    <div>
      <div className="bold">Header</div>
      <div>Logo</div>
      <div>Szlogen</div>
      <div>Gyorskereső</div>
      <div>Belépés</div>
      <div>Akció, kedvencek, kosár</div>
      <Menu />

      <div className="wrapper grid-2" style={{ paddingTop: '2.5rem', paddingBottom: '0' }}>
        <div className="col-1-2">
          <Breadcrumb />
        </div>
        <div className="col-1-2">
          <Share />
        </div>
      </div>

    </div>
  );
};

Header.contextTypes =
{
  config: PropTypes.object,
  store: PropTypes.object,
};

export default Header;
