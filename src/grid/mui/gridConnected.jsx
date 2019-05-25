
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import { withRouter } from 'react-router-dom';


/* !- React Elements */

import Grid from './grid';


/* !- Actions */

import * as GridActions from '../actions';


/**
 * GridConnected Redux Stateless Component
 *
 * Connected to grid state via Redux.
 * @example
 * <GridConnected
 *  onClick={(rowIndex, colIndex) => console.log(rowIndex, colIndex)}
 * />
 */
const GridConnected = (
  {
    history,
    data,
    hook,
    helper,
    orderColumn,
    orderDirection,
    onClick,
    changeOrder,
    ui,
    uiProps,
  },
) =>
{
  const onClickHandler = (rowIndex, colIndex) =>
  {
    if (onClick)
    {
      onClick(rowIndex, colIndex);
    }
    // else if (history && data.length && data[rowIndex].id)
    // {
    //   history.push(`${history.location.pathname}/${data[rowIndex].id}`);
    // }
  };

  return ui({
    data,
    hook,
    helper,
    orderColumn,
    orderDirection,
    onClickCell: onClickHandler,
    onChangeOrder: columnId => changeOrder(columnId),
    ...uiProps,
  });
};

GridConnected.propTypes =
{
  ...Grid.propTypes,
  onClick: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.bool,
  ]),
};

GridConnected.defaultProps =
{
  ...Grid.defaultProps,
  /**
   * Invoke when user click to grid cell
   * (rowIndex, colIndex) => console.log(rowIndex, colIndex)
   *
   * @param  {integer} rowIndex
   * @param  {integer} colIndex
   */
  onClick: false,
  ui: Grid,
  uiProps: {},
};

/**
 * contextTypes
 * @type {Object}
 */
GridConnected.contextTypes =
{
  id: PropTypes.string,
};


export default connect(
  ({ grid }, { onClick }) => ({
    data: grid.data,
    helper: grid.helper,
    hook: grid.hook,
    orderColumn: grid.orderColumn,
    orderDirection: grid.orderDirection,
    onClick,
  }),
  {
    changeOrder: GridActions.changeOrder,
  },
)(GridConnected);
