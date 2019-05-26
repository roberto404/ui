// @flow

export const setSettings = (settings: {}) =>
({
  type: 'VIEW_SET_SETTINGS',
  settings,
});

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
export const toggleView = (id: string | number, status?: 0 | 1) =>
({
  type: 'VIEW_TOGGLE_VIEW',
  id,
  status,
});