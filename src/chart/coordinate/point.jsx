
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
  reverseAxis,
}) =>
{
  const {
    yAxisValueMin,
    yAxisValues,
    xAxisValues,
    xAxisValueMin,
    xAxisValueMax,
  } = coordToPix(0, 0).canvas;

  const renderGroupOfPoints = (id, points, index, length) =>
  {
    // const axisValues = reverseAxis.indexOf(id) !== -1 ? yAxisValues : xAxisValues;

    const elements = points
      .map((value, i) => 
      {
        const point = points[i + xAxisValueMin];

        if (typeof point === 'undefined' || value === null)
        {
          return null;
        }

        const x = point.x || 0;
        const y = point.y || 0;

        return ({
          ...coordToPix(x - xAxisValueMin, y - yAxisValueMin),
          element: point.element || UI,
          value,
          index: i,
          point,
          seriesIndex: index,
          seriesLength: length,
        })
      })
      .filter(n => n !== null)
      .map((props, i, data) =>
        React.createElement(
          props.element,
          {
            ...props,
            data,
            id: `${id}-${i}`,
            key: `${id}-${i}`,  // eslint-disable-line
          }),
      );

    return <g key={id} id={id}>{elements}</g>;
  };

  if (Array.isArray(data))
  {
    return renderGroupOfPoints('points', data);
  }

  return (
    <g id="points">
      {
      Object.keys(data).map((key, index, keys) => renderGroupOfPoints(key, data[key], index, keys.length))
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
  reverseAxis: PropTypes.arrayOf(PropTypes.string),
};

/**
 * defaultProps
 * @type {Object}
 */
Points.defaultProps =
{
  data: [],
  reverseAxis: [],
};

export default Points;
