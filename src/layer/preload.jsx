
import React from 'react';
import PropTypes from 'prop-types';

/**
 * Preloading Layer Component
 */
const Preload = (
  {
    element,
  },
) => element;


Preload.propTypes = {
  element: PropTypes.element,
};

Preload.defaultProps = {
  element: <div className="preloader" />,
};

export default Preload;
