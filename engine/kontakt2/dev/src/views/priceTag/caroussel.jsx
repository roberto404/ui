
import React from 'react';
// import PropTypes from 'prop-types';
// import { connect } from 'react-redux';
// import { FormattedMessage } from 'react-intl';

/* !- Redux Actions */

// import * as GridActions from '@1studio/ui/grid/actions';
// import * as LayerActions from '@1studio/ui/layer/actions';
// import * as FormActions from '@1studio/ui/form/actions';


/* !- React Elements */

import Caroussel from '@1studio/ui/caroussel/';
import templates from './templates/';

/* !- Constants */


/**
* PriceTagCaroussel Component
*/
const PriceTagCaroussel = ({ onClick }) => (
  <Caroussel
    id="priceTag"
    Slide={
      ({ type, props }) =>
      {
        const Slide = templates[type];
        return <Slide {...props} onClick={onClick} />;
      }
    }
  />
);

export default PriceTagCaroussel;
