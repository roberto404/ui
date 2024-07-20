/**
 * Load database to grid
 * @param {Array} data
 * @param {Object} [settings={}]
 * @param {String} [grid] redux grid id
 */
export const setData = (data, settings = {}, grid?: string) =>
({
  type: 'SET_GRID_DATA',
  data,
  settings,
  grid,
});

/**
* Load database via API, set data asynchronous.
* Use Promise.then method, when then invoke
* the results will be set to Store.
*
* @memberof Actions/Grid
* @param  {Function} fetchApi Promise method
* @param  {String} [optionsApi]
* @param  {Object} [settings]
* @param {String} [grid] redux grid id
*/
export const fetchData = (
  fetchApi: Function,
  optionsApi?: string | {},
  settings?: {},
  grid?: string,
) =>
  fetchApi(optionsApi).then((response) => {
    const isExtend = (response.data && response.settings);

    return setData(
      isExtend ? response.data : response,
      isExtend ? { ...settings, ...response.settings } : settings,
      grid,
    );
  });


/**
 * Expand database a new record
 *
 * @since 1.0.0
 * @memberof Actions/Grid
 * @param {Object} record
 */
export const addRecord = (record: {}, grid?: string, index?: number) =>
({
  type: 'ADD_GRID_RECORD',
  record,
  grid,
  index,
});

/**
 * Expand database a new record
 *
 * @since
 * @memberof Actions/Grid
 * @param {Object} record
 */
export const addRecords = (records: [], grid?: string) =>
({
  type: 'ADD_GRID_RECORDS',
  records,
  grid,
});

/**
 * Change and extends exist record
 *
 * @since 1.0.0
 * @memberof Actions/Grid
 * @param {Object} record
 */
export const modifyRecord = (record: {}, grid?: string, options = {}) =>
({
  type: 'MODIFY_GRID_RECORD',
  record,
  grid,
  options,
});

export const modifyOrAddRecord = (record: {}, grid?: string) =>
  modifyRecord(record, grid, { enableAddRecord: true });


/**
 * Replace records new value
 *
 * @memberof Actions/Grid
 * @param {Array} records
 */
export const modifyRecords = (records: [], grid?: string, options = {}) =>
({
  type: 'MODIFY_GRID_RECORDS',
  records,
  grid,
  options,
});

export const modifyOrAddRecords = (records: [], grid?: string) =>
  modifyRecords(records, grid, { enableAddRecord: true });

/**
 * Change record props is database
 *
 * @since 1.0.0
 * @memberof Actions/Grid
 * @param {Object} record
 */
export const removeRecord = (record: {}, grid?: string) =>
({
  type: 'REMOVE_GRID_RECORD',
  record,
  grid,
});


/**
 * Update database settings (hook, helper etc.)
 * @param {Object} settings
 */
export const setSettings = (settings: {}, grid?: string) =>
({
  type: 'SET_SETTINGS',
  settings,
  grid,
});

/**
 * Alias action for setSettings only hook change
 * @param {Object} hook
 */
export const setHook = (hook, grid?: string) =>
(
  setSettings({ hook }, grid)
);

/**
 * Alias action for setSettings only helper change
 * @param {Object} hook
 */
export const setHelper = (helper, grid?: string) =>
(
  setSettings({ helper }, grid)
);

/**
 * Change database order
 * @param  {String} order
 */
export const changeOrder = (order, grid?: string) =>
({
  type: 'CHANGE_GRID_ORDER',
  order,
  grid,
});

/**
 * Update grid data current page
 * @param  {int} page
 */
export const goToPage = (page, grid?: string) =>
({
  type: 'GO_TO_GRID_PAGE',
  page,
  grid,
});

/**
 * Show more results (facebook like paginate)
 * @param  {int} limit
 */
export const modifyLimit = (limit, grid?: string) =>
({
  type: 'MODIFY_GRID_PAGINATE_LIMIT',
  limit,
  grid,
});


/**
 * Apply filter
 * @param {String} filterId
 * @param {any} filterValue
 * @example
 * applyFilter('status', 1);
 * applyFilter('user', [1,2]);
 * applyFilter([{ id: 'status', arguments: [1] }, ...])
 */
export const applyFilter = (filterId, filterValue, grid?: string) => {
  const bootstrap = { type: 'APPLY_GRID_FILTER', grid };

  if (typeof filterId === 'object') {
    return {
      ...bootstrap,
      filters: filterId,
    };
  }

  return {
    ...bootstrap,
    filters: [{ id: filterId, arguments: [filterValue], status: true }],
  };
};


/**
 * Apply filter
 * @param {String} filterId
 * @param {any} filterValue
 * @example
 * detachFilter('status');
 * detachFilter('user', [2]);
 * detachFilter('user', 2);
 */
export const detachFilter = (filterId, filterValue, grid?: string) =>
({
  type: 'DETACH_GRID_FILTER',
  filterId,
  filterValue,
  grid,
});


/**
 * FLUSH
 *
 * @since 1.0.0
 * @memberof Actions/Grid
 * @example
 * flush()
 */
export const flush = (grid?: string) =>
({
  type: 'FLUSH_GRID',
  grid,
});
