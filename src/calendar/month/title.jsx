
import React from 'react';
import PropTypes from 'prop-types';


/* !- Constants */

const DEFAULT_STYLE = {
  fill: '#d9d9d9',
  color: '#000000',
  fontSize: 12,
  fontFamily: 'sans-serif',
};


/**
 * Title: Month-Calendar Component
 */
const Title = ({ label, center }) =>
(
  <text
    x={center.x}
    y={center.y}
    fill={DEFAULT_STYLE.color}
    fontSize={`${DEFAULT_STYLE.fontSize * 1.5}px`}
    fontFamily={DEFAULT_STYLE.fontFamily}
    alignmentBaseline="middle"
    textAnchor="middle"
  >
    {label}
  </text>
);

/**
 * propTypes
 * @type {Object}
 */
Title.propTypes =
{
  label: PropTypes.string.isRequired,
  center: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }).isRequired,
};

/**
 * defaultProps
 * @type {Object}
 */
Title.defaultProps =
{
};

export default Title;
