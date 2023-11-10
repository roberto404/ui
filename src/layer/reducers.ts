
/* !- Constants */

import
{
  AVAILABLE_METHODS,
  DEFAULT_METHOD,
}
from './constants';

const DEFAULT_STATE = {
  active: false,
  method: DEFAULT_METHOD,
  closeable: true,
  options: {
    className: '',
    autoClose: false,
  },
  containerStyle: {},
};

/**
 * Layer Redux Reducers
 * @param  {Object} [state={}]
 * @param  {Object} action
 * @return {Object}            state
 */
const reducers = (state = DEFAULT_STATE, action = {}) =>
{
  switch (action.type)
  {
    case 'SET_LAYER_VISIBLE':
      {
        if (typeof action.active !== 'boolean')
        {
          return state;
        }

        return {
          ...state,
          active: action.active,
        };
      }

    case 'TOGGLE_LAYER':
      {
        return {
          ...state,
          active: !state.active,
        };
      }

    case 'SET_LAYER_ELEMENT':
      {
        return {
          ...state,
          element: action.element,
        };
      }

    case 'SET_LAYER_METHOD':
      {
        if (AVAILABLE_METHODS.indexOf(action.method) === -1)
        {
          if (state.method === undefined)
          {
            return {
              ...state,
              method: DEFAULT_METHOD,
            }
          }

          return state;
        }

        return {
          ...state,
          method: action.method,
        }
      }

    case 'SET_LAYER':
      {
        const closeable = (typeof action.closeable === 'boolean') ? action.closeable : true;
        const containerStyle = (action.containerStyle instanceof Object) ? action.containerStyle : {};
        const options = (action.options instanceof Object) ? action.options : {};

        if (action.method === 'popover' && state.active && ['dialog', 'fullscreen', 'sidebar'].indexOf(state.method) !== -1)
        {
          return state;
        }

        return {
          active: reducers(state, { type: 'SET_LAYER_VISIBLE', active: action.active }).active,
          element: reducers(state, { type: 'SET_LAYER_ELEMENT', element: action.element }).element,
          method: reducers(state, { type: 'SET_LAYER_METHOD', method: action.method }).method,
          closeable: typeof options.closeable !== 'undefined' ? options.closeable : closeable,
          containerStyle,
          options,
        };
      }

    case 'FLUSH_LAYER':
      {
        return { ...DEFAULT_STATE };
      }

    default:
      return state;
  }
};


export const getActive = ({ layer }) => layer.active;

export const getLayer = (({ layer }) =>
{
  const {
    active,
    method,
    element,
    closeable,
    containerStyle,
    options,
  } = layer;

  return {
    active,
    method,
    element,
    closeable,
    containerStyle,
    options,
  }
});


export const GET_ACTIVE = getActive;

export const GET_LAYER = getLayer;

export const GET_METHOD =
  ({ layer }) => layer.method;

export default reducers;
