import React from 'react';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import promise from 'redux-promise';
import { createLogger } from 'redux-logger';
import isEmpty from 'lodash/isEmpty';
import UserError from '@1studio/utils/error/userError'; // 1 Kbyte

import { reducers as defaultReducers } from './reducers';
import { setUser } from './authentication/actions'; // 1 Kbyte
// import { dialog } from './layer/actions';


const loadStateFromLocalStorage = () =>
{
  try
  {
    const serializedState = localStorage.getItem('state');

    if (serializedState === null)
    {
      return {};
    }

    return JSON.parse(serializedState);
  }
  catch (error)
  {
    return {};
  }
};

export const saveStateToLocalStorage = (state) =>
{
  try
  {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('state', serializedState);
  }
  catch (error)
  {
    // ignore
  }
};

let logoutTimer;
let sessionTime;

/**
 * Every action refresh the user session data timestamp
 * @param  {Object} store
 * @return {Object}       action (dispatch payload)
 */
export const userRefurbishMiddleware = store => next => (action) =>
{
  const user = store.getState().user;

  try
  {
    sessionTime = user.model.sessionTime;
  }
  catch (error)
  {
    sessionTime  = 30 * 60 * 1000;
  }

  if (user.isLogged)
  {
    if (logoutTimer)
    {
      window.clearTimeout(logoutTimer);
    }

    logoutTimer = window.setTimeout(
      () =>
      {
        window.location = '/logout';
      },
      sessionTime - (30 * 1000)
    );
  }

  if (!isEmpty(user.model.data))
  {
    user.model.refurbish();
  }

  // user localStorage erased, this notify redux store
  if (user.isLogged && isEmpty(user.model.data))
  {
    return next(setUser());
  }

  return next(action);
};


/**
 * Catch javascript error
 * @ TODO
 * editable message to model
 * modal on click reload page from baseUrl
 */
export const expectionHandler = (error, extra) =>
{
  if (error.name === 'UserError')
  {
    error.dev = { ...error.dev, ...extra };
    throw error;
  }
  else
  {
    throw new UserError(error, extra);
  }
};

/**
 * Sends crash reports as state is updated and listeners are notified.
 */
export const crashReporterMiddleware = exception => store => next => (action) =>
{
  try
  {
    return next(action);
  }
  catch (error)
  {
    if (!exception)
    {
      throw error;
    }

    exception(
      error,
      {
        action,
        state: store.getState(),
      },
      next,
    );
  }
};

/**
 * The reducer registry enables Redux reducers to be added to the store’s reducer after the store has been created. This allows Redux modules to be loaded on-demand, without requiring all Redux modules to be bundled in the main chunk for the store to correctly initialize.
 */
export class ReducerRegistry
{
  constructor(reducers)
  {
    this._emitChange = null;
    this._reducers = reducers || {};
  }

  getReducers()
  {
    return { ...this._reducers };
  }

  register(name, reducer)
  {
    this._reducers = { ...this._reducers, [name]: reducer };

    if (this._emitChange)
    {
      this._emitChange(this.getReducers());
    }
  }

  remove(name)
  {
    if (name && typeof this._reducers[name] !== 'undefined')
    {
      delete this._reducers[name];

      if (this._emitChange)
      {
        this._emitChange(this.getReducers());
      }
    }
  }

  setChangeListener(listener)
  {
    this._emitChange = listener;
  }
}

export let reducerRegistry;


export const storeWrapper = (reducers = defaultReducers, middlewares = []) =>
{
  if (process.env.NODE_ENV !== 'production')
  {
    middlewares.unshift(createLogger());
  }

  middlewares.unshift(promise);

  middlewares.push(userRefurbishMiddleware);

  /* eslint-disable no-underscore-dangle */
  let composeEnhancers = typeof window !== 'undefined' ?
    (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose) : compose;
  /* eslint-enable */

  let enhancers;

  if (process.env.NODE_ENV !== 'production')
  {
    enhancers = composeEnhancers(
      applyMiddleware(...middlewares),
    );
  }
  else
  {
    enhancers = applyMiddleware(...middlewares);
  }

  // Preserve initial state for not-yet-loaded reducers
  const combine = (reducers) =>
  {
    const reducerNames = Object.keys(reducers || {});

    Object.keys(loadStateFromLocalStorage()).forEach(item =>
      {
      if (reducerNames.indexOf(item) === -1)
      {
        reducers[item] = (state = null) => state;
      }
    });

    return combineReducers(reducers);
  };

  reducerRegistry = new ReducerRegistry(reducers);

  const reducer = combine(reducerRegistry.getReducers());

  const store = createStore(
    reducer,
    loadStateFromLocalStorage(),
    enhancers,
  );

  // Replace the store's reducer whenever a new reducer is registered.
  reducerRegistry.setChangeListener(reducers => {
    store.replaceReducer(combine(reducers));
  });

  return store;
};

export default storeWrapper;
