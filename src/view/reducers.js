// @flow

import { checkPropTypes } from '@1studio/utils/propType';
import findLastIndex from 'lodash/findLastIndex';
import { SCHEME } from './constans';

const DEFAULT_STATE = {
  active: undefined,
  groups: {},
};

import { switchView } from './actions';


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
    
    case 'VIEW_ADD_SETTINGS':
      {
        if (checkPropTypes(action.settings, SCHEME.settings))
        {
          return state;
        }

        return reducers(
          {
            ...state,
            ...action.settings,
            groups: {
              ...state.groups,
              ...(action.settings.groups || {})
            }
          },
          {
            type: 'VIEW_SWITCH_GROUP',
            view: action.settings.active,
          },
        );
      }

    case 'VIEW_REMOVE_SETTINGS':
      {
        if (checkPropTypes(action.settings, SCHEME.settings))
        {
          return state;
        }

        const restGroups = Object.keys(state.groups)
          .filter(groupId => Object.keys(action.settings.groups).indexOf(groupId) === -1);

        if (!restGroups.length)
        {
          return DEFAULT_STATE;
        }

        return {
          ...state,
          groups: restGroups.reduce(
            (result, groupId) => ({ ...result, [groupId]: state.groups[groupId] }),
            {},
          ),
        };
          
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

        const group = action.group || state.active;

        const activeGroup = state.groups[group].map((group) =>
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
            [group]: activeGroup,
          },
        };
      }

    case 'VIEW_SWITCH_VIEW':
      {
        const group = action.group || state.active;

        const groupItems = state.groups[group];

        if (groupItems === undefined)
        {
          return state;
        }

        const activeGroup = groupItems.map((view) =>
          ({ ...view, status: view.id === action.id }));

        return {
          ...state,
          groups: {
            ...state.groups,
            [group]: activeGroup,
          },
        };
      }
    case 'VIEW_SWAP_VIEW':
      {
        const group = action.group || state.active;

        const groupItems = state.groups[group];

        if (groupItems === undefined)
        {
          return state;
        }

        const groupItemsLength = groupItems.length;

        const nextIndex = findLastIndex(
          groupItems,
          ({ status }) => +status === 1 
        ) + 1;

        const index = (nextIndex >= groupItemsLength) ? 0 : nextIndex;

        return reducers(state, switchView(groupItems[index].id, group));
      }

    default:
      return state;
  }
};

export default reducers;
