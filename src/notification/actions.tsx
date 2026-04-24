
import React from 'react';


/* !- React Elements */

import IconError from '../icon/mui/alert/error';
import { IconCheckmarkWrapper } from './iconCheckmark';


/* !- Types */

import { Item } from './reducers';
import { TemplatesType } from './templates';
import { Button } from './item';


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
