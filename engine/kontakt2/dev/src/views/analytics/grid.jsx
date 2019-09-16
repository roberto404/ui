
import React from 'react';
import PropTypes from 'prop-types';


/* !- Actions */

import { dialog } from '@1studio/ui/layer/actions';

/* !- React Elements */

import Grid from '@1studio/ui/grid/pure/grid';
import Connect from '@1studio/ui/grid/connect';
import GridModal from './gridModal';


/* !- Constants */

import { GRID_HOOK } from './const';


/**
 * [AnalyticsGrid description]
 */
const AnalyticsGrid = (props, { store }) =>
{
  const onClickCellHandler = ({ id, row }) =>
  {
    const data = store.getState().grid.analytics.data
      .filter(record => record[row] === id);

    store.dispatch(dialog(<GridModal data={data} />));
  };

  return (
    <div className="grow scroll-y">
      <Connect
        id="analytics-grid"
        className="card mb-0 p-0 shadow-outer border border-white grid grow scroll-y"
      >
        <Grid
          hook={GRID_HOOK}
          freezeHeader
          infinity
          onClickCell={onClickCellHandler}
        />
      </Connect>
    </div>
  );
};

AnalyticsGrid.contextTypes =
{
  store: PropTypes.object,
};

export default AnalyticsGrid;
