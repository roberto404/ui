

export const setUser = (user = {}) =>
({
  type: 'SET-USER',
  user,
});

export const eraseUser = () =>
({
  type: 'ERASE-USER',
});

export const modifyUserData = (user = {}) =>
({
  type: 'MODIFY-USER-DATA',
  user,
});


// import fetchDatabase from '../api';

//
// /**
//  * Load database to grid
//  * @param {Object} data
//  * @param {Object} [settings={}]
//  */
// export const setData = (data, settings = {}) =>
// ({
//   type: 'SET_DATA',
//   data,
//   settings,
// });
//
// /**
// * Load database via API, set data asynchronous.
// * Use Promise.then method, when then invoke
// * the results will be set to Store.
// *
// * @since 1.0.0
// * @memberof Actions/Grid
// * @param  {function} fetchDatabase Promise method
// * @param  {string} [id]
// */
// export const fetchData = (fetchDatabase: Function, id?: string) =>
//   fetchDatabase(id).then(response =>
//     setData(response.data, response.settings),
//   );
//
