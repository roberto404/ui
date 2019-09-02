
import React from 'react';
import PropTypes from 'prop-types';

/**
 * Default point Component
 */
export const Point = ({
  x,
  y,
}) =>
(
  <circle cx={x} cy={y} r="5" />
);


/**
 * Points component
 */
const Points = ({
  data,
  coordToPix,
  UI,
}) =>
{
  const renderGroupOfPoints = (id, points) => (
    <g id={id} key={id}>
    {
      points.map(({ x, y, element }) => React.createElement(element || UI, coordToPix(x, y)))
    }
    </g>
  );

  if (Array.isArray(data))
  {
    return renderGroupOfPoints('points', data);
  }

  return (
    <g id="points">
    {
      Object.keys(data).map(key => renderGroupOfPoints(key, data[key]))
    }
    </g>
  );
};

const pointShape = PropTypes.shape({
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  element: PropTypes.element,
});

/**
 * propTypes
 * @type {Object}
 */
Points.propTypes =
{
  data: PropTypes.oneOfType([
    PropTypes.objectOf(PropTypes.arrayOf(pointShape)),
    PropTypes.arrayOf(pointShape),
  ]),
};

/**
 * defaultProps
 * @type {Object}
 */
Points.defaultProps =
{
  data: [],
};

export default Points;
