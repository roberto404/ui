
import React from 'react';


/* !- React Elements */

import IconError from '../icon/mui/alert/error';
import { IconCheckmarkWrapper } from './iconCheckmark';
import ItemApiMessage from './itemApiMessage';


/* !- Types */

import { Item } from './reducers';
import { TemplatesType } from './templates';
import { Button } from './item';
import { PropTypes as ItemApiPromisePropTypes } from './itemApiPromise';
import { PropTypes as ItemApiMessagePropTypes } from './itemApiMessage';

type ApiPromiseItem =
  Omit<Item, 'payload' | 'children' | 'title' | 'caption' | 'Icon'>
  & Pick<ItemApiPromisePropTypes, 'payload' | 'title'>
  & Partial<Pick<ItemApiPromisePropTypes, 'children' | 'caption' | 'Icon'>>;

type ApiWithMessageItem = Omit<ApiPromiseItem, 'children'> & {
  message?: Omit<ItemApiMessagePropTypes, 'onStart' | 'onClose'>,
};


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

type DialogItem = Item & {
  icon?: React.FC,
  content?: React.ReactNode,
  button?: Button,
  buttonSecondary?: Button,
  buttons?: Button[],
};

export const dialog = (item: DialogItem) => {
  const {
    icon,
    content,
    button,
    buttonSecondary,
    buttons = [],
    autoClose = true,
    ...props
  } = item;

  const normalizedButtons = [
    ...buttons,
    ...[buttonSecondary, button].filter(Boolean),
  ] as Button[];

  if (normalizedButtons.length < 1) {
    throw new Error('notification dialog requires at least one button');
  }

  if (autoClose === false) {
    normalizedButtons.push({
      title: 'Mégsem',
      handler: (onClose) => onClose(),
      className: 'button outline p-1/2',
    });
  }

  return add({
    closeOnChangeLocation: true,
    color: 'red',
    autoClose,
    Icon: icon || IconError,
    ...props,
    caption: props.caption || content,
    buttons: normalizedButtons,
  });
};

export const error = (item: Item | string) => {

  const errorItem = {
    color: 'red',
    autoClose: true,
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

export const addComplete = (item: Item) =>
({
  type: 'ADD_NOTIFICATION',
  item: {
    closeOnChangeLocation: true,
    color: 'black',
    autoClose: true,
    Icon: IconCheckmarkWrapper,
    ...item,
  },
});



export const addApi = (item: Item) =>
({
  type: 'ADD_NOTIFICATION',
  item: {
    template: TemplatesType.ItemApi,
    disableClose: true,
    closeOnChangeLocation: true,
    ...item,
  },
});


/**
 * `addApi`, ami nem indul el automatikusan, csak a `children` által hívott `onStart` után.
 * Az `onStart` paramétere összefésülődik az api hívás payloadjába (`payload.api(startPayload)`).
 *
 * @since 1.0.0
 * @memberof Actions/Notification
 * @example
 * addApiPromise({
 *   title: 'Kedvezmény hozzáadása...',
 *   children: ({ onStart }) => <div className="button green" onClick={onStart}>mehet</div>,
 *   payload: {
 *     api: (payload) => apiSuccess({ url: 'order/addDiscount', payload: { id, ...payload } }),
 *   },
 * });
 */
export const addApiPromise = (item: ApiPromiseItem) =>
({
  type: 'ADD_NOTIFICATION',
  item: {
    template: TemplatesType.ItemApiPromise,
    disableClose: false,
    closeOnChangeLocation: true,
    ...item,
  },
});


/**
 * `addApiPromise` előre elkészített `children`-nel: az api hívás csak akkor indul,
 * ha az értesítésben megadtak egy üzenetet, ami `_log` kulccsal kerül a payloadba.
 *
 * @since 1.0.0
 * @memberof Actions/Notification
 * @example
 * addApiWithMessage({
 *   title: 'Kedvezmény hozzáadása...',
 *   message: { placeholder: 'Kedvezmény indoklása' },
 *   payload: {
 *     api: (payload) => apiSuccess({ url: 'order/addDiscount', payload: { id, ...payload } }),
 *   },
 * });
 */
export const addApiWithMessage = (item: ApiWithMessageItem) => {

  const { message, ...props } = item;

  return addApiPromise({
    ...props,
    children: (childrenProps) => (
      <ItemApiMessage {...childrenProps} {...message} />
    ),
  });
};




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
