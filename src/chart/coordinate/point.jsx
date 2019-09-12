
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
 * propTypes
 * @type {Object}
 */
Point.propTypes =
{
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
};


/**
 * Points component
 */
const Points = ({
  data,
  coordToPix,
  UI,
}) =>
{
  const {
    yAxisValueMin,
    xAxisValues,
    xAxisValueMin,
    xAxisValueMax,
  } = coordToPix(0, 0).canvas;

  const renderGroupOfPoints = (id, points) =>
  {
    const elements = [];

    xAxisValues.forEach((value, i) =>
    {
      if (xAxisValues[i] !== null && points[i + xAxisValueMin])
      {
        const { element, x, y } = points[i + xAxisValueMin];

        elements.push(
          React.createElement(
            element || UI,
            {
              ...coordToPix(x - xAxisValueMin, y - yAxisValueMin),
              id: `${id}-${i}`,
              key: `${id}-${i}`,  // eslint-disable-line
            }),
        );
      }
    });

    return <g key={id} id={id}>{elements}</g>;
  };

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
  y: PropTypes.number,
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
  coordToPix: PropTypes.func.isRequired,
  UI: PropTypes.func.isRequired,
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
