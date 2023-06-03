
import { StateTypes } from './reducers';


/**
 * Change view state, active or groups
 */
export const setSettings = (settings: StateTypes) =>
({
  type: 'VIEW_SET_SETTINGS',
  settings,
});

/**
 * Extends with new groups
 */
export const addSettings = (settings: StateTypes) =>
({
  type: 'VIEW_ADD_SETTINGS',
  settings,
});

/**
 * Remove exist view group
 */
export const removeSettings = (settings: StateTypes) =>
({
  type: 'VIEW_REMOVE_SETTINGS',
  settings,
});

/**
 * Set view group, replace or add new some new
 */
export const setViews = (views: StateTypes['groups'], groupIndex?: string) =>
({
  type: 'VIEW_SET_VIEWS',
  views,
  groupIndex,
});


/**
 * Change view components by groups
 */
export const switchGroup = (id: string) =>
({
  type: 'VIEW_SWITCH_GROUP',
  id,
});

/**
 * Change visibility of selected view component
 */
export const toggleView = (id: string, status?: 0 | 1, group?: string) =>
({
  type: 'VIEW_TOGGLE_VIEW',
  id,
  status,
  group,
});

/**
 * Change visibility of selected view all components
 */
export const switchView = (id: string, group?: string) =>
({
  type: 'VIEW_SWITCH_VIEW',
  id,
  group,
});

/**
 * Show next
 */
export const swapView = (group?: string) =>
({
  type: 'VIEW_SWAP_VIEW',
  group,
});


export default {
  setSettings,
  addSettings,
  removeSettings,
  setViews,
  switchGroup,
  toggleView,
  switchView,
  swapView,
}