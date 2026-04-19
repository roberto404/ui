import React, { useContext, useEffect, useRef } from 'react';
import { useDispatch, ReactReduxContext, useSelector } from 'react-redux';

/* !- Actions */

import { flush, tooltip } from './actions';
import { useComponentDidMount, useComponentWillUnmount } from '../hooks';




/* !- Types */


const defaultProps =
{
  className: 'inline-block',
};

type PropTypes =
  {
    className?: string,
    title: string | JSX.Element,
    children: JSX.Element,
    /**
     * Invoke ..
     */
    onClick?: () => void,

  } & Partial<typeof defaultProps>;


const Tooltip = ({
  className,
  children,
  title,
  onClick
}: PropTypes) => {
  const dispatch = useDispatch();

  const { store } = useContext(ReactReduxContext);
  const eventDataRef = useRef<{ x: number; y: number, currentTarget: true } | null>(null);

  useSelector(
    ({ layer }) => {
      if (!layer.active && eventDataRef.current) {
        eventDataRef.current = null;
      }
    },
    () => true,
  );

  useEffect(() => {
    const isLayer = store.getState().layer.active === true;

    if (eventDataRef.current && isLayer) {
      dispatch(tooltip(title, eventDataRef.current));
    }
  }, [title]);


  const onClickHandler = (event) => {
    if (typeof onClick === 'function') {
      onClick(event);
    }
  }

  const onMouseHandler = (event) => {
    const isLayer = store.getState().layer.active === true;

    if (!isLayer) {
      // useRef cannot keep full event
      eventDataRef.current = { x: event.clientX, y: event.clientY, currentTarget: event.currentTarget };
      dispatch(tooltip(title, event));
    }
  };

  const onMouseLeaveHandler = () => {
    const isTooltip = store.getState().layer.method === 'popover';

    if (isTooltip) {
      dispatch(flush());
    }
  };

  return (
    <div
      className={className}
      onClick={onClickHandler}
      onMouseEnter={onMouseHandler}
      onMouseLeave={onMouseLeaveHandler}
    >
      {children}
    </div>
  )
};

export default Tooltip;
