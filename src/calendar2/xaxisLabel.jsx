
import React from 'react';
import PropTypes from 'prop-types';


/* !- Constants */

const DEFAULT_STYLE = {
  fill: '#d9d9d9',
  fontSize: 12,
  fontFamily: 'sans-serif',
  marginRight: 5,
};


/**
 * x-Axis component
 */
const xAxisLabel = (
{
  id,
  title,
  coord,
  onClick,
},
) =>
{
  const width = coord.right - coord.left;
  const height = coord.bottom - coord.top;

  const center = {
    x: coord.left + (width / 2),
    y: coord.top + (height / 2),
  };

  const onClickLabelHandler = (event) =>
  {
    event.preventDefault();

    if (onClick)
    {
      onClick(event.currentTarget.dataset.id);
    }
  }

  return (
    <text
      x={center.x}
      y={center.y}
      fill={DEFAULT_STYLE.fill}
      fontSize={`${DEFAULT_STYLE.fontSize}px`}
      fontFamily={DEFAULT_STYLE.fontFamily}
      alignmentBaseline="middle"
      textAnchor="middle"
      onClick={onClickLabelHandler}
      data-id={id}
    >
      {title}
    </text>
  );
};

/**
 * propTypes
 * @type {Object}
 */
xAxisLabel.propTypes =
{
  title: PropTypes.string.isRequired,
  coord: PropTypes.shape({
    top: PropTypes.number.isRequired,
    left: PropTypes.number.isRequired,
    bottom: PropTypes.number.isRequired,
    right: PropTypes.number.isRequired,
  }).isRequired,
  onClick: PropTypes.func,
};

export default xAxisLabel;
