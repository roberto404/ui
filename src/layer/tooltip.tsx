import React, { useContext } from 'react';
import { useDispatch, ReactReduxContext } from 'react-redux';

/* !- Actions */

import { flush, tooltip } from './actions';




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
}: PropTypes) =>
{
  const dispatch = useDispatch();

  const { store } = useContext(ReactReduxContext)


  const onClickHandler = (event) =>
  {
    if (typeof onClick === 'function')
    {
      onClick(event);
    }
  }

  const onMouseHandler = (event) =>
  {
    const isLayer = store.getState().layer.active === true;

    if (!isLayer)
    {
      dispatch(tooltip(title, event));
    }
  };

  const onMouseOutHandler = () =>
  {
    const isTooltip = store.getState().layer.method === 'popover';

    if (isTooltip)
    {
      dispatch(flush());
    }
  };

  return (
    <div
      className={className}
      onClick={onClickHandler}
      onMouseEnter={onMouseHandler}
      onMouseOut={onMouseOutHandler}
    >
      {children}
    </div>
  )
};

export default Tooltip;
