import React from 'react';

/**
 * @fileOverview Redux Layer Actions
 * @namespace Actions/Layer
 */


/* !- React Elements */

import Modal from './modal';
import Preload from './preload';
import Menu from './menu';
import { extendPositions, getPositionsElement, getDynamicPopoverStyle } from './position';


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
  containerStyle: options.containerStyle,
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
  containerStyle: options.containerStyle,
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
export const sidebar = (element: React.Element, options = {}) =>
({
  type: 'SET_LAYER',
  active: true,
  method: 'sidebar',
  element,
  containerStyle: options.containerStyle,
  options: {
    ...options,
    className: (options.position || 'right') + ' ' + options.className,
  },
});


/**
 * Create and show popover layer.
 *
 * @since 1.0.0
 * @memberof Actions/Layer
 * @param {ReactElement} element Layer (popover) content
 * @param {object} event
 * @param {object} options { className, containerStyle, useMousePosition }
 * @example
 * popover(
 *  <span>Hello</span>,
 *  event,
 *  {
 *    className: 'no-close',
 *    containerStyle: { width: '400px' },
 *    useMousePosition: true,
 *  },
 * );
 */
export const popover = (element: React.Element | string, event: {} = {}, options = {}) => {
  let containerStyle = options.containerStyle || {};

  const target = event.currentTarget;

  if (target) {
    const position = options.useMousePosition ?
      extendPositions({
        left: event.clientX + window.pageXOffset,
        top: event.clientY + window.pageYOffset,
        width: 0,
        height: 0,
      })
      : getPositionsElement(target);

    containerStyle = { ...getDynamicPopoverStyle(position), ...containerStyle };
  }

  // console.log(target);
  //
  // if (!options.style)
  // {
  //   options.style = {};
  // }
  //
  // options.style.pointerEvents = 'none';
  // containerStyle.pointerEvents = 'auto';


  return ({
    type: 'SET_LAYER',
    active: true,
    method: 'popover',
    closeable: true,
    containerStyle,
    // if the element is a string then put in a wrapper
    element: React.isValidElement(element) ?
      element : <div style={{ whiteSpace: 'nowrap' }}>{element}</div>,
    options,
  });
};

/**
 * Create and show tooltip layer.
 *
 * @since 1.15.0
 * @memberof Actions/Layer
 * @param {ReactElement} element Layer (tooltip) content
 * @param {object} event
 */
export const tooltip = (element: React.Element | string, event: {} = {}, options = {}) => {
  return ({
    ...popover(element, event, options),
    closeable: false,
    options: {
      ...options,
      className: 'tooltip',
    }
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
({
  type: 'SET_LAYER',
  active: true,
  method: 'dialog',
  element: <Modal {...props} />,
  options,
  containerStyle: options.containerStyle,
});

/**
 * Preloader layer
 * @since 1.0.0
 * @memberof Actions/Layer
 *
 * @param  {ReactElement} [element] change default element
 * @example
 * preload(<div>Loading...</div>)
 */
export const preload = (element: React.Element, event: React.MouseEvent<HTMLElement>) => {
  const target = event || React.isValidElement(element) ? null : element;
  let containerStyle = {};

  if (target) {
    const { center } = getPositionsElement(target.target);

    containerStyle = {
      top: `${center.y}px`,
      left: `${center.x}px`,
    };
  }

  return ({
    type: 'SET_LAYER',
    active: true,
    method: 'preload',
    closeable: false,
    element: <Preload element={React.isValidElement(element) ? element : undefined} />,
    // options: { className: 'preload' },
    containerStyle,
  });
};

/**
 * Menu is a special popover
 * @param  {Object} [props={}] { id, title, handler, icon }
 * @param  {Event} event
 */
export const menu = (props = {}, event: React.MouseEvent<HTMLElement> | {} = {}, options = {}) =>
  popover(<Menu {...props} />, event, { ...options, className: 'no-padding no-close' });


/**
 * Update the items of the visible menu, the position stays
 * @example
 * updateMenu({ items: [{ id, title, handler, className: 'focus' }] });
 */
export const updateMenu = (props = {}) =>
({
  type: 'SET_LAYER_ELEMENT',
  element: <Menu {...props} />,
});

export const contextMenu = (props = {}, event: React.MouseEvent<HTMLElement> | {} = {}, options = {}) => {
  event.preventDefault();
  return menu(props, event, options);
}

/* !- Alias actions */

export const open = show;
export const close = flush;
