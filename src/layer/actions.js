// @flow

import React from 'react';


/**
 * @fileOverview Redux Layer Actions
 * @namespace Actions/Layer
 */


/* !- React Elements */

import Modal from './modal';
import Preload from './preload';
import Menu from './menu';

// type ActionType =
// {
//   type: string,
//   items: {},
//   form?: string,
// };
//
// type ItemsType =
// {
//   id?: string,
//   value?: string | number
// }

/**
 * Create and show dialog layer.
 *
 * @since 1.0.0
 * @memberof Actions/Layer
 * @param {ReactElement} element Layer (dialog) content
 * @example
 * dialog(<div>This is a dialog content</div>);
 * @example
 * //=> options
 * {
 * }
 */
export const dialog = (element: React.Element, options = {}) =>
({
  type: 'SET_LAYER',
  active: true,
  method: 'dialog',
  element,
  options,
});


/**
 * Create and show fullscreen layer.
 *
 * @since 1.0.0
 * @memberof Actions/Layer
 * @param {ReactElement} element Layer (fullscreen) content
 * @example
 * fullscreen(<div>This is a fullscreen content</div>);
 */
export const fullscreen = (element: React.Element, options = {}) =>
({
  type: 'SET_LAYER',
  active: true,
  method: 'fullscreen',
  element,
  options,
});


/**
 * Create and show sidebar layer.
 *
 * @since 1.0.0
 * @memberof Actions/Layer
 * @param {ReactElement} element Layer (sidebar) content
 * @example
 * sidebar(<div>This is a sidebar content</div>);
 */
export const sidebar = (element: React.Element) =>
({
  type: 'SET_LAYER',
  active: true,
  method: 'sidebar',
  element,
});


/**
 * Create and show popover layer.
 *
 * @since 1.0.0
 * @memberof Actions/Layer
 * @param {ReactElement} element Layer (popover) content
 * @param {object} event
 */
export const popover = (element: React.Element, event: {} = {}) =>
{
  let containerStyle = {};

  if (event.currentTarget)
  {
    // const elementBounding = event.currentTarget.getBoundingClientRect();
    const target = event.currentTarget;

    containerStyle = {
      left: target.offsetLeft,
      top: target.offsetTop + target.offsetHeight,
    };
  }

  // if (event.pageX)
  // {
  //   containerStyle = {
  //     left: event.pageX,
  //     top: event.pageY,
  //   };
  // }
  // else if (target.x || target.y)
  // {
  //   containerStyle = {
  //     left: target.x || 0,
  //     top: target.y || 0,
  //   };
  // }

  return ({
    type: 'SET_LAYER',
    active: true,
    method: 'popover',
    closeable: true,
    containerStyle,
    element,
  });
};


/**
 * Set the layer visible.
 *
 * @since 1.0.0
 * @memberof Actions/Layer
 * @example
 * show();
 * open();
 */
export const show = () =>
({
  type: 'SET_LAYER_VISIBLE',
  active: true,
});


/**
 * Set the layer invisible.
 *
 * @since 1.0.0
 * @memberof Actions/Layer
 * @example
 * hide();
 */
export const hide = () =>
({
  type: 'SET_LAYER_VISIBLE',
  active: false,
});


/**
 * Toggle visibility of layer.
 *
 * @since 1.0.0
 * @memberof Actions/Layer
 * @example
 * toggle();
 */
export const toggle = () =>
({
  type: 'TOGGLE_LAYER',
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
  type: 'FLUSH_LAYER',
});


/* !- Predefined actions */

/**
 * Modal is a predefined dialog layer. Do not use element, just Modal element props.
 *
 * @since 1.0.0
 * @memberof Actions/Layer
 * @param {Object} [props={}]     icon, title, content, button, buttonSecondary, className,
 * @example
 * modal();
 */
export const modal = (props = {}, options = {}) =>
{
  return {
    type: 'SET_LAYER',
    active: true,
    method: 'dialog',
    element: Modal(props),
    options,
  };
};

export const preload = (props = {}) =>
{
  return {
    type: 'SET_LAYER',
    active: true,
    method: 'dialog',
    closeable: false,
    element: Preload(props),
    options: { className: 'preload' }
  };
};


export const menu = (props = {}, event: SyntheticEvent<> | {} = {}) =>
{
  let containerStyle = {};

  const target = event.currentTarget;

  if (target)
  {
    const rect = target.getBoundingClientRect();
    const left = rect.left + window.scrollX;
    const top = rect.top + window.scrollY;
    const xCenter = (left + rect.width) / 2;
    const xWindow = (left -  window.scrollX) / window.innerWidth;
    const yWindow = (top -  window.scrollY) / window.innerHeight;

    if (xWindow < 0.2)
    {
      containerStyle.left = left;
      containerStyle.transform = '';
    }
    else if (xWindow > 0.8)
    {
      containerStyle.left = left + rect.width;
      containerStyle.transform = 'translateX(-100%)';
    }
    else
    {
      containerStyle.left = `${xCenter}px`;
      containerStyle.transform = 'translateX(-50%)';
    }

    if (yWindow > 0.6)
    {
      containerStyle.top = `${top - 6}px`;
      containerStyle.transform += ' translateY(-100%)';
    }
    else
    {
      containerStyle.top = `${top + rect.height + 6}px`;
    }

  }

  return ({
    type: 'SET_LAYER',
    active: true,
    method: 'popover',
    element: <Menu {...props} />, // eslint-disable-line
    options: { className: 'no-padding no-close' },
    containerStyle,
  });
};


/* !- Alias actions */

export const open = show;
export const close = flush;
