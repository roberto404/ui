
import React, { useContext } from 'react';
import { useDispatch } from 'react-redux';
import { GridContext } from './context';


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
const GridConnect = (props) =>
{
  const context = useContext(GridContext);
  const dispatch = useDispatch();

  const id = props.id || context.grid;

  return (
    <Connect
      id={id}
      store="grid"
      listen="data"
      onChangeOrder={column => dispatch(changeOrder(column, id))}
      onChangePage={nextPage => dispatch(goToPage(nextPage, id))}
      onClickCell={props.onClick || (props.children ? props.children.props.onClickCell : undefined)}
      {...props}
    />
  );
};

export default GridConnect;
