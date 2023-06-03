
import React, { useContext, useRef, useMemo } from 'react';
import { ReactReduxContext, useSelector } from 'react-redux';
import { useForceUpdate } from './hooks';
import { useAppContext } from './context';
import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';
import omit from 'lodash/omit';
import clone from 'lodash/clone';
import produceNumericArray from '@1studio/utils/array/produceNumericArray';


/* !- Actions */


/* !- Types */

const defaultProps =
{
  id: '',
  onChange: () =>
  {},
  UI: () =>
  {},
  uiProps: {},
  // listen: 'data',
  children: undefined,
  skeletonRepeat: 1,
};

type PropTypes = Partial<typeof defaultProps> & {
  /**
   * Id of Redux Grid
   * Not required if use context Ex: <GridView />
   */
  id: string,
  /**
   * Redux store id (grid, form, calendar ...)
   * Not required if use context
   */
  store: string, // eslint-disable-line
  /**
   * Observed Redux Grid key
   * [data], page, totalPage, orderColumn, filter ...
   * @example
   * //=> user more listener
   * linsten={[page, filter]}
   */
  listen: string | string[],
  /**
  * Invoke if listens state props changed
  * (state, prevState) => console.log(state.totalPage)
  *
  * @param  {object} state grid object
  * @param  {object} prevState previous grid object
  */
  onChange: () => void,
  /**
   * Static Component which will update.
   * You can use children or props
   */
  UI: () => JSX.Element,
  /**
   * Props of UI Element
   */
  uiProps: {},

  children: JSX.Element | JSX.Element[],
}


/**
 * 
 * @param state Redux store.getState()
 * @param stateId Redux reducer key
 * @param stateIndex Custom id of reducer state like grid[id]
 * @returns 
 */
const getState = (state, stateId, stateIndex) =>
{
  let observedState = state[stateId];

  if (stateIndex)
  {
    observedState = observedState[stateIndex];
  }

  return clone(observedState) || {};
}


/**
 * Provider Component
 * Connect static component to Redux.
 * Update every affected changes.
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
const Connect = (props: PropTypes) =>
{
  const context = useAppContext();

  // form, grid...
  const stateId = props.store || (context.form ? 'form' : 'grid');

  // form[index]...
  const stateIndex = props[stateId] || props.id;


  const isNotLoadedYet = useRef(true);

  // componentWillMount => constructor
  useMemo(
    () =>
    {
      const state = getState(context.store.getState(), stateId, stateIndex);

      isNotLoadedYet.current = stateId === 'grid' ?
        !state?.rawData || !state.rawData?.length : isEmpty(state);
    },
    [],
  );

  const state = useSelector(
    (store) =>
    {
      const state = getState(store, stateId, stateIndex);
      const listen = props.listen || Object.keys(state);
      const listens = Array.isArray(listen) ? listen : [listen];

      const nextState = {};

      listens.forEach(listen => nextState[listen] = state[listen])

      return nextState;
    },
    (prev, next) =>
    {
      const isNoChanges = isEqual(prev, next);

      if (isNoChanges === false ) 
      {
        if (isNotLoadedYet.current === true)
        {
          isNotLoadedYet.current = false;
        }
        
        if (typeof props.onChange === 'function')
        {
          props.onChange(next, prev);
        }
      }

      return isNoChanges
    },
  );

  
  const {
    id,
    UI,
    uiProps,
    children,
    noResults,
    skeleton,
    skeletonRepeat,
  } = props;

  const nextProps = {
    ...omit(props, 'UI'),
    ...getState(context.store.getState(), stateId, stateIndex),
    ...uiProps,
  };

  if (isNotLoadedYet.current && skeleton)
  {
    const SkeletonComponent = (
      <div>
        { produceNumericArray(1, skeletonRepeat).map(i => React.cloneElement(skeleton, { key: i }) ) }
      </div>
    );

    if (props.store === 'grid')
    {
      nextProps.noResults = SkeletonComponent;
    }
    else
    {
      return SkeletonComponent;
    }
  }

  return children ?
    React.cloneElement(children, nextProps) : React.createElement(UI, nextProps);
};

Connect.defaultProps = defaultProps;

export default Connect;
