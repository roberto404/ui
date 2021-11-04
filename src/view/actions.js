// @flow

export const setSettings = (settings: {}) =>
({
  type: 'VIEW_SET_SETTINGS',
  settings,
});

export const addSettings = (settings: {}) =>
({
  type: 'VIEW_ADD_SETTINGS',
  settings,
});

export const removeSettings = (settings: {}) =>
({
  type: 'VIEW_REMOVE_SETTINGS',
  settings,
});

/**
 * Add new view group
 */
export const setViews = (views: [], groupIndex?: string) =>
({
  type: 'VIEW_SET_VIEWS',
  views,
  groupIndex,
});


/**
 * Change view components by groups
 * @param {string} id id of group
 */
export const switchGroup = (id: string) =>
({
  type: 'VIEW_SWITCH_GROUP',
  id,
});

/**
 * Change visibility of selected view component
 * @param  {string} id [description]
 * @param  {status} [status]  [description]
 */
export const toggleView = (id: string | number, status?: 0 | 1, group?: string) =>
({
  type: 'VIEW_TOGGLE_VIEW',
  id,
  status,
  group,
});

/**
 * Change visibility of selected view all components
 * @param  {string} id [description]
 */
export const switchView = (id: string | number, group?: string) =>
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
