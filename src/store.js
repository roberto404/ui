import React from 'react';
import { createStore, applyMiddleware, compose } from 'redux';
import promise from 'redux-promise';
import { createLogger } from 'redux-logger';
import isEmpty from 'lodash/isEmpty';
import UserError from '@1studio/utils/error/userError';

import defaultReducers from './reducers';
import { setUser } from './authentication/actions';
import { dialog } from './layer/actions';


const loadStateFromLocalStorage = () =>
{
  try
  {
    const serializedState = localStorage.getItem('state');
    if (serializedState === null)
    {
      return undefined;
    }
    return JSON.parse(serializedState);
  }
  catch (error)
  {
    return undefined;
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

/**
 * Every action refresh the user session data timestamp
 * @param  {Object} store
 * @return {Object}       action (dispatch payload)
 */
export const userRefurbishMiddleware = store => next => (action) =>
{
  const user = store.getState().user;

  if (!isEmpty(user.model.data))
  {
    user.model.refurbish();
  }

  // user localStorage erased, this notify redux store
  if (user.isLogged && isEmpty(user.model.data))
  {
    // next(dialog(<div>111</div>));

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


export const storeWrapper = (reducers = null, middlewares = []) =>
{
  if (process.env.NODE_ENV !== 'production')
  {
    middlewares.unshift(createLogger());
  }

  middlewares.unshift(promise);

  middlewares.push(userRefurbishMiddleware);

  /* eslint-disable no-underscore-dangle */
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
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

  return createStore(
    reducers || defaultReducers,
    loadStateFromLocalStorage(),
    enhancers,
  );
};

export default storeWrapper;
