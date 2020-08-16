// @flow

import { checkPropTypes } from '@1studio/utils/propType';
import { SCHEME } from './constans';

const DEFAULT_STATE = {
  active: undefined,
  groups: [],
};

/**
 * View Redux Reducers
 * @param  {Object} state
 * @param  {Object} action
 * @return {Object}            state
 */
const reducers = (state = DEFAULT_STATE, action = {}) =>
{
  switch (action.type)
  {
    case 'VIEW_SET_SETTINGS':
      {
        if (checkPropTypes(action.settings, SCHEME.settings))
        {
          return state;
        }

        return reducers(
          {
            ...state,
            ...action.settings,
          },
          {
            type: 'VIEW_SWITCH_GROUP',
            view: action.settings.active,
          },
        );
      }

    case 'VIEW_SET_VIEWS':
      {
        if (!action.groupIndex)
        {
          action.groupIndex = state.active
        }

        action.settings = {
          ...state.settings,
          groups: {
            ...state.settings.groups,
            [action.groupIndex]: action.views,
          }
        }

        if (checkPropTypes(action.settings, SCHEME.settings))
        {
          return state;
        }

        return ({
          ...state,
          ...action.settings,
        });
      }

    case 'VIEW_SWITCH_GROUP':
      {
        if (!action.id || !state.groups || Object.keys(state.groups).indexOf(action.id) === -1)
        {
          return state;
        }

        return {
          ...state,
          active: action.id,
        };
      }

    case 'VIEW_TOGGLE_VIEW':
      {
        if ([0, 1].indexOf(action.status) === -1)
        {
          action.status = undefined;
        }

        const activeGroup = state.groups[state.active].map((group) =>
        {
          if (group.id !== action.id)
          {
            return group;
          }

          return {
            ...group,
            status: action.status !== undefined ? action.status : (group.status + 1) % 2,
          };
        });

        return {
          ...state,
          groups: {
            ...state.groups,
            [state.active]: activeGroup,
          },
        };
      }

    case 'VIEW_SWITCH_VIEW':
      {
        const activeGroup = state.groups[state.active].map((view) =>
          ({ ...view, status: view.id === action.id }));

        return {
          ...state,
          groups: {
            ...state.groups,
            [state.active]: activeGroup,
          },
        };
      }

    default:
      return state;
  }
};

export default reducers;
