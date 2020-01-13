
import React from 'react';
import PropTypes from 'prop-types';


/* !- Actions */

import { changeOrder, goToPage } from './actions';


/* !- Element */

import Connect from '../connect';


/**
 * Provider Component
 * Connect static component to Grid Redux.
 * Update every affected changes.
 *
 * state = selected form redux
 *
 * @example
 *  <Connect
 *    id="user"
 *    UI={Grid}
 *    listen="rawData"
 *   />
 *
 * // => <Grid { ...store.form.user + formActions } />
 *
 * @example children
 *  <Connect
 *    listen="rawData"
 *  >
 *    <Grid />
 *  <Connect />
 *
 * @example OnChange
 *  <Connect
 *    listen="rawData"
 *    onChange={(state, prevState) => console.log(state.totalPage)}
 *   />
 */
const FormConnect = (props, { store, form }) =>
{
  const id = props.id || form;

  return (
    <Connect
      store="form"
      {...props}
    />
  );
};


/**
 * contextTypes
 * @type {Object}
 */
FormConnect.contextTypes =
{
  form: PropTypes.string,
  store: PropTypes.object,
};


export default FormConnect;
