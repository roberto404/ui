

/* !- React Elements */

import IconError from '../icon/mui/alert/error';


/* !- Types */

import { Item } from './reducers';
import { TemplatesType } from './templates';


/* !- Constants */


/**
 * Set the layer invisible.
 *
 * @since 1.0.0
 * @memberof Actions/Layer
 * @example
 * hide();
 */
export const add = (item: Item) =>
({
  type: 'ADD_NOTIFICATION',
  item,
});

export const error = (item: Item | string) => {

  const errorItem = {
    color: 'red',
    Icon: IconError,
    title: (typeof item === 'string' ? item : ''),
    ...(typeof item === 'object' ? item : {}),
  }

  return ({
    type: 'ADD_NOTIFICATION',
    item: errorItem,
  })
};

export const update = (item: Item) =>
({
  type: 'UPDATE_NOTIFICATION',
  item,
});

export const addProgress = (item: Item) =>
({
  type: 'ADD_NOTIFICATION',
  item: {
    template: TemplatesType.ItemProgress,
    disableClose: true,
    closeOnChangeLocation: true,
    ...item,
  },
});




/**
 * Set the layer invisible.
 *
 * @since 1.0.0
 * @memberof Actions/Layer
 * @example
 * hide();
 */
export const remove = (id) =>
({
  type: 'REMOVE_NOTIFICATION',
  id,
  active: false,
});




/**
 * Truncate layer state.
 *
 * @since 1.0.0
 * @memberof Actions/Layer
 * @example
 * flush();
 */
export const flush = () =>
({
  type: 'FLUSH_NOTIFICATION',
});
