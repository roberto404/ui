
import { createStore, applyMiddleware, compose } from 'redux';
import promise from 'redux-promise';
import { createLogger } from 'redux-logger';
import isEmpty from 'lodash/isEmpty';

import Reducers from './reducers';
import { setUser } from './authentication/actions';

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
    return next(setUser());
  }
  // update not necessary
  // else
  // {
  //   next(setUser());
  // }


  return next(action);
};


/**
 * Sends crash reports as state is updated and listeners are notified.
 */
// const crashReporter = store => next => action => {
//   try {
//     return next(action)
//   } catch (err) {
//     console.error('Caught an exception!', err)
//     Raven.captureException(err, {
//       extra: {
//         action,
//         state: store.getState()
//       }
//     })
//     throw err
//   }
// }


export const storeWrapper = (reducers = null) =>
{
  const middlewares = [promise];

  if (process.env.NODE_ENV !== 'production')
  {
    middlewares.push(createLogger());
  }

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
    reducers || Reducers,
    loadStateFromLocalStorage(),
    enhancers,
  );
};

export default storeWrapper;
