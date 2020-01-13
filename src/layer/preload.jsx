
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
  // element: (
  //   <div className="md-preloader">
  //     <svg xmlns="http://www.w3.org/2000/svg" version="1.1" height="75" width="75" viewbox="0 0 75 75">
  //         <circle cx="37.5" cy="37.5" r="33.5" strokeWidth="8" />
  //     </svg>
  //   </div>
  // )
  element: <div className="preloader" />,
};

export default Preload;
