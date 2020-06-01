import React from 'react';
import PropTypes from 'prop-types';


import { flush, tooltip } from './actions';

const Tooltip = ({ className, children, title, onClick }, { store }) =>
{
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
      store.dispatch(tooltip(title, event));
    }
  };

  const onMouseOutHandler = (event) =>
  {
    const isTooltip = store.getState().layer.method === 'popover';

    if (isTooltip)
    {
      store.dispatch(flush());
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

Tooltip.defaultProps = {
  className: 'inline-block',
}


Tooltip.contextTypes = {
  store: PropTypes.object,
}

export default Tooltip;
