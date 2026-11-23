"use client";


import React, { useState, useEffect, useLayoutEffect, useContext, useRef } from 'react';
import { useSelector, useDispatch, useStore } from 'react-redux';
import classNames from 'classnames';
import isEqual from 'lodash/isEqual';


/* !- Actions */

import { close, flush, unflipLayer } from './actions';
import { getLayer, getActive } from './reducers';


/* !- React Element */

import IconClose from '../icon/mui/navigation/close';


/* !- Constants */

import {
  AVAILABLE_METHODS,
} from './constants';


import { useAppContext } from '../context';
import { useComponentDidMount } from '../hooks';


// useLayoutEffect warns on server side
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;


/**
 * Layer Component
 * Connect to layer state via Redux.
 */
const Layer = () => {


  /* !- Hooks */

  const scrollTop = useRef(-1);
  // scroll position has to restore after the layer closed
  const isScrollSaved = useRef(false);
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
    back,
  } = useSelector(getLayer, isEqual);

  /**
   * Flip of the dialog (flipLayer): the box turns to 90°, the side changes, then it turns back from -90°
   * - side: the visible side, phase: running half of the turn
   * - backElement: kept until the turn back finished (no empty back side during the animation)
   */
  const [side, setSide] = useState<'front' | 'back'>('front');
  const [phase, setPhase] = useState<'out' | 'in' | null>(null);
  const [backElement, setBackElement] = useState(null);
  const targetSide = back ? 'back' : 'front';

  // closed or another dialog: front side without animation
  useEffect(() => {
    setSide('front');
    setPhase(null);
    setBackElement(null);
  }, [active, element]);

  useEffect(() => {
    if (!active) {
      return;
    }

    if (back) {
      setBackElement(back);
    }

    if (targetSide !== side && phase === null) {
      setPhase('out');
    }
  }, [back]);

  const onAnimationEndHandler = (event) => {
    if (event.target !== event.currentTarget) {
      return;
    }

    if (phase === 'out') {
      setSide(targetSide);
      setPhase('in');
      return;
    }

    if (phase === 'in') {
      setPhase(null);

      if (side === 'front') {
        setBackElement(null);
      }

      // changed during the turn
      if (targetSide !== side) {
        setPhase('out');
      }
    }
  };

  const { className } = options || {};

  /**
   * Restore the scroll position after the page content is visible again
   * (fullscreen layer hides the page, so the document is too short before)
   */
  useIsomorphicLayoutEffect(() => {
    if (!active && isScrollSaved.current) {
      isScrollSaved.current = false;
      window.scrollTo(0, scrollTop.current);
    }
  }, [active]);




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
    // flipped dialog: turn back to the front side instead of closing
    if (back) {
      dispatch(unflipLayer());
      return;
    }

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

    // save only on opening: later renders (ex. fullscreen) have scrolled page
    if (!isScrollSaved.current) {
      scrollTop.current = window.scrollY;
      isScrollSaved.current = true;
    }

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
        className={classNames('container', {
          'flip-out': phase === 'out',
          'flip-in': phase === 'in',
        })}
        style={containerStyle}
        onAnimationEnd={onAnimationEndHandler}
      >
        {/* back side (flipLayer): covers the front, which stays mounted under it */}
        {side === 'back' && backElement && (
          <div className="back">
            {backElement}
          </div>
        )}

        <div
          className="close"
          onClick={onClickCloseHandler}
        >
          <IconClose />
        </div>

        <div className={classNames('content', { covered: side === 'back' && !!backElement })}>
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
