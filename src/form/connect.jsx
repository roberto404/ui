
import React, { useContext} from 'react';
import { FormContext } from './context';


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
const FormConnect = (props) =>
{
  const { form } = useContext(FormContext) || {};
  const id = props.id || form;


  return (
    <Connect
      id={id}
      store="form"
      {...props}
    />
  );
};




export default FormConnect;
