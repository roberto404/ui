
import React from 'react';
import PropTypes from 'prop-types';


/* !- Actions */

import { changeOrder, goToPage } from './actions';


/* !- Element */

import Connect from '../connect';


/**
 * Provider Component
 * Connect static component to Grid Redux.
 * Update every affected changes.
 *
 * state = selected grid redux
 *
 * @example
 *  <Connect
 *    id="user"
 *    UI={Grid}
 *    listen="rawData"
 *   />
 *
 * // => <Grid { ...store.grid.user + gridActions } />
 *
 * @example children
 *  <Connect
 *    listen="rawData"
 *  >
 *    <Grid />
 *  <Connect />
 *
 * @example OnChange
 *  <Connect
 *    listen="rawData"
 *    onChange={(state, prevState) => console.log(state.totalPage)}
 *   />
 */
const GridConnect = (props, { store, grid }) =>
{
  const id = props.id || grid;

  return (
    <Connect
      store="grid"
      onChangeOrder={column => store.dispatch(changeOrder(column, id))}
      onChangePage={nextPage => store.dispatch(goToPage(nextPage, id))}
      onClickCell={props.onClick || props.children.props.onClickCell}
      {...props}
    />
  );
};


/**
 * contextTypes
 * @type {Object}
 */
GridConnect.contextTypes =
{
  grid: PropTypes.string,
  store: PropTypes.object,
};


export default GridConnect;
