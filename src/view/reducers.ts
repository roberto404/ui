import { checkPropTypes } from '@1studio/utils/propType';
import findLastIndex from 'lodash/findLastIndex';
import { SCHEME } from './constans';

const DEFAULT_STATE = {
  active: undefined,
  groups: {},
};

import { switchView } from './actions';

import { StateTypes as RootStateTypes } from '../reducers';

export type ViewItemType = {
  id: string,
  pos: number,
  status: number,
  title?: string,
};

export type StateTypes = {
  active?: string,
  groups: {
    [index: string]: ViewItemType[]
  },
};

type ActionTypes = {
  [index: string]: any,
  type: string,
};


/**
 * View Redux Reducers
 * @param  {Object} state
 * @param  {Object} action
 * @return {Object} state
 */
const reducers = (
  state: StateTypes = DEFAULT_STATE,
  action: ActionTypes,
): StateTypes =>
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
          action.groupIndex = state.active;
        }

        action.settings = {
          ...state,
          groups: {
            ...state.groups,
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


/* !-- Selectors */

/**
 * Active views of group or selected group by id
 */
export const getViewGroup = (id?: string) =>
  ({ view }: RootStateTypes): ViewItemType[] =>
    typeof view.active !== 'undefined' ?
      (view.groups[id || view.active] || []) : [];

/**
 * Returns active view group items
 * @example
 * [{ id, pos, title, children, status }]
 */
export const getActiveViews = ({ nested }) => (store) =>
{
  const { view } = store;

  if (nested)
  {
    if (!Array.isArray(view.groups[view.active]))
    {
      return false;
    }

    const views = [
      view.groups[view.active]
        .filter(({ status }) => status)
        .map(({ id }) => id)
    ];

    let run = true;

    while (run)
    {
      const lastViewIndex = views.length - 1;
      let lastView = views[lastViewIndex];
      
      lastView.forEach((id) =>
      {
        if (view.groups[id])
        {
          if (typeof views[lastViewIndex + 1] === 'undefined')
          {
            views.push([]);
          }

          views[lastViewIndex + 1].push(
            ...view.groups[id]
              .filter(({ status }) => status)
              .map(({ id }) => id)
          );
        }
      });

      run = typeof views[lastViewIndex + 1] !== 'undefined';
    }

    return views.flat();
  }

  return view.groups[view.active] || [];
}


export default reducers;
