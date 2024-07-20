"use client";


import React, { useState, useEffect, useContext, useRef } from 'react';
import { useSelector, useDispatch, useStore } from 'react-redux';
import classNames from 'classnames';
import isEqual from 'lodash/isEqual';


/* !- Actions */

import { close, flush } from './actions';
import { getLayer, getActive } from './reducers';


/* !- React Element */

import IconClose from '../icon/mui/navigation/close';


/* !- Constants */

import {
  AVAILABLE_METHODS,
} from './constants';


import { useAppContext } from '../context';
import { useComponentDidMount } from '../hooks';


/**
 * Layer Component
 * Connect to layer state via Redux.
 */
const Layer = () => {


  /* !- Hooks */

  const scrollTop = useRef(-1);
  const mouseDownElementTarget = useRef();

  useComponentDidMount(() => {
    scrollTop.current = 0;
  });

  const dispatch = useDispatch();
  const { addShortcuts, removeShortcuts } = useAppContext();

  const {
    active,
    method,
    element,
    closeable,
    containerStyle,
    options,
  } = useSelector(getLayer, isEqual);

  const { className } = options || {};




  if (scrollTop.current === -1)
  {
    return <></>;
  }


  /* !- Listeners */


  const onClickLayerCurtain = (event) => {
    if (
      closeable
      && event.currentTarget.isEqualNode(event.target)
      && event.target === mouseDownElementTarget.current
    ) {
      onClickCloseHandler();
    }
  };

  const documentOnClickListener = () => {
    document.onclick = null;

    if (active && method === 'popover' && JSON.stringify(containerStyle) === element.toString()) {
      onClickCloseHandler();
    }
  }


  /* !- Handlers */

  /**
   * Invoke when press close button.
   * @type {Function}
   * @return {void}
   */
  const onClickCloseHandler = () => {
    removeShortcuts('layer');

    if (typeof options.onClose === 'function') {
      if (options.onClose() === false) {
        return;
      };
    }

    dispatch(close());
  };

  const onMouseDownHandler = (event) => {
    mouseDownElementTarget.current = event.target;
  }


  if (options.autoClose) {
    setTimeout(
      () => dispatch(flush()),
      parseInt(options.autoClose) * 1000,
    );
  }

  if (active) {

    scrollTop.current = window.scrollY;

    if (method === 'popover') {
      document.body.classList.add("layer-popover");
      document.onclick = documentOnClickListener;
    }
    else {
      `overflow h-screen layer-${method}`.split(' ').forEach(className =>
        document.body.classList.add(className)
      );
    }

    if (options.bodyClass) {
      options.bodyClass.split(' ').forEach(className =>
        document.body.classList.add(className)
      );
    }

    if (closeable) {
      addShortcuts([
        {
          keyCode: "escape",
          handler: onClickCloseHandler,
          description: 'Close layer',
        },
      ], 'layer');
    }

    if (method === "fullscreen") {
      window.scrollTo(0, 0);
    }
  }
  else {
    if (typeof document !== 'undefined') {
      document.body.className = '';
    }

    if (typeof window !== 'undefined') {
      window.scrollTo(0, scrollTop.current);
    }
  }


  return (
    <div
      className={classNames({
        layer: true,
        active,
        show: active,
        [method]: true,
        closeable,
        [className]: !!className,
      })}
      style={options.style || {}}
      onClick={onClickLayerCurtain}
      onMouseDown={onMouseDownHandler}
    >
      <div
        className="container"
        style={containerStyle}
      >
        <div
          className="close"
          onClick={onClickCloseHandler}
        >
          <IconClose />
        </div>

        <div className="content">
          {element && (React.isValidElement(element) ? element : element())}
        </div>

      </div>
    </div>
  );
}

// Layer.propTypes =
// {
//   active: PropTypes.bool,
//   method: PropTypes.oneOf(AVAILABLE_METHODS),
//   element: PropTypes.oneOfType([
//     PropTypes.func,
//     PropTypes.element,
//   ]),
//   closeable: PropTypes.bool,
//   close: PropTypes.func.isRequired,
//   className: PropTypes.string,
//   containerStyle: PropTypes.objectOf(PropTypes.oneOfType([
//     PropTypes.number,
//     PropTypes.string,
//   ])),
// };

// Layer.defaultProps =
// {
//   active: false,
//   method: 'dialog',
//   element: <div />,
//   className: '',
//   closeable: true,
//   options: {},
//   onClose: () => {},
// };

export default Layer;
