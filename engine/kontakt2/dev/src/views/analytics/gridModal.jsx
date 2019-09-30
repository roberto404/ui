
import React from 'react';
import PropTypes from 'prop-types';


/* !- React Elements */

import Grid from '@1studio/ui/grid/pure/grid';


/* !- Actions */

// ...;


/* !- Constants */

import { GRID_LAYER_HOOK } from './const';

/**
 * [AnalyticsGrid description]
 */
const AnalyticsGridModal = ({
  data,
}) =>
(
  <div className="column">
    <Grid
      data={data}
      hook={GRID_LAYER_HOOK}
      // freezeHeader
      // infinity
      />
  </div>
);

export default AnalyticsGridModal;
