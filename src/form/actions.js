// @flow

/**
 * @fileOverview Redux Form Actions
 * @namespace Actions/Form
 */

import PropTypes, { checkPropTypes } from '@1studio/utils/propType';


import
{
  FORM_ERRORS_KEY,
  FORM_SCHEME_KEY,
}
from './constants';

type ActionType =
{
  type: string,
  items?: {},
  form?: string,
};

type ItemsType =
{
  id?: string,
  value?: string | number
}

/**
 * Create form (or sub form) key/value store.
 * SET_VALUES reducer payload.
 *
 * @since 1.0.0
 * @memberof Actions/Form
 * @param {object} items state items { status: 1, name: 'foo', ... }
 * @param {string} [form] state form group (alias sub form)
 * @example
 * setValue({ id: 'status', value: 1 })
 * or
 * setValue({ status: 1, options: [1, 2] }, 'sample');
 * // => {
 * form: {
 *    sample: {
 *      status: 1,
 *      options: [1, 2],
 * }}}
 */
export const setValues = (items: ItemsType, form?: string): ActionType =>
{
  let transformItems = {};

  // Transform { id: status, value: 1 } => { status: 1 }
  //
  if (!checkPropTypes(items, PropTypes.object.isRequired) && Object.keys(items).length)
  {
    transformItems =
      Object
        .keys(items)
        .every(key =>
          ['id', 'value'].indexOf(key) > -1) ?
            { [items.id]: items.value } : items || {};
  }

  const response = {
    type: 'FORM_SET_VALUES',
    items: transformItems,
    form: '',
  };

  if (form)
  {
    response.form = form;
  }

  return response;
};

/**
 * Remove form (or sub form) key/value store.
 * UNSET_VALUES reducer payload.
 *
 * @since 1.0.0
 * @memberof Actions/Form
 * @param {object} items state items { status: 1 } or [{ status: 1 }, ...]
 * @param {string} [form] state group
 * @example
 * unsetValues({ id: 'status' })
 * or
 * unsetValues({ status: 1, options: [2,1] }, 'sampleForm');
 * // before:
 * {
 * form: {
 *    sampleForm: {
 *      status: 1,
 *      options: [1, 2, 3],
 * }}}
 * // after:
 * {
 * form: {
 *    sampleForm: {
 *      options: [3],
 * }}}
 */
export const unsetValues = (items: ItemsType, form?: string): ActionType =>
 ({ ...setValues(items, form), type: 'FORM_UNSET_VALUES' });

 /**
 * Set values asynchronous.
 * Use Promise.then method, when then invoke
 * the results will be set to Store.
 *
 * @since 1.0.0
 * @memberof Actions/Form
 * @param  {function} fetchApi Promise method
 * @param  {string} [form]
 */
export const fetchValues = (fetchApi: Function, form?: string) =>
  fetchApi(form).then(response =>
    setValues(response, form),
  );

/**
 * Set scheme object to store.
 * SET_SCHEME reducer payload
 *
 * @since 1.0.0
 * @memberof Actions/Form
 * @param {object} scheme
 * @param {string} [form]
 * @example
 * setScheme({...});
 * or
 * setScheme({...}, 'form_id');
 */
export const setScheme = (scheme: {}, form?: string): ActionType =>
 setValues({ [FORM_SCHEME_KEY]: scheme }, form);


/**
 * Set error object to store.
 * SET_ERRORS reducer payload
 * @since 1.0.0
 * @memberof Actions/Form
 * @param {object} errors
 * @param {string} [form]
 * @example
 * setErrors({ status: 1, ... })
 * or
 * setErrors({ status: 1, ... }, 'form_id')
 */
export const setErrors = (errors: {}, form?: string): ActionType =>
 setValues({ [FORM_ERRORS_KEY]: errors }, form);


export const validate = (form?: string): ActionType =>
({
  type: 'FORM_VALIDATE',
  form,
});

/**
 * Flush complete form or sub-form.
 * FLUSH reducer payload
 *
 * @since 1.0.0
 * @memberof Actions/Form
 * @param  {string} form
 * @example
 * flush()
 * or
 * flush('form_id')
 */
export const flush = (form: string) =>
({
  type: 'FORM_FLUSH',
  form,
});
