import React from 'react';
import PropTypes from 'prop-types';


import { flush, tooltip } from './actions';

const Tooltip = ({ children, title }, { store }) =>
{

  const onMouseHandler = (event) =>
  {
    store.dispatch(tooltip(title, event));
  };

  const onMouseOutHandler = (event) =>
  {
    store.dispatch(flush());
  };

  return (
    <div
      onMouseEnter={onMouseHandler}
      onMouseOut={onMouseOutHandler}
    >
      {children}
    </div>
  )
}


Tooltip.contextTypes = {
  store: PropTypes.object,
}

export default Tooltip;
