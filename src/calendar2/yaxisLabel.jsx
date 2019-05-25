
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import capitalizeFirstLetter from '@1studio/utils/string/capitalizeFirstLetter';

moment.locale('hu');


/* !- Constants */

const DEFAULT_STYLE = {
  fill: '#584e4f',
  fontSize: 14,
  fontFamily: 'sans-serif',
};


/**
 * y-Axis Label component
 */
const Label = (
{
  coord,
  date,
  style,
  isPrimary,
  isSecondary,
}) =>
{
  const labelStyle = { ...DEFAULT_STYLE, ...style };

  const width = coord.right - coord.left;
  const height = coord.bottom - coord.top;

  const center = {
    x: coord.left + (width / 2),
    y: coord.top + (height / 2),
  };

  let highlight;

  // if (isSecondary)
  // {
    // title = [<tspan x={x}>{label.dayName}</tspan>],
    // highlight = <circle cx={center.x} cy={center.y} r="8" fill="black" />;
  // }

  return (
    <g id="label">
      <text
        x={coord.left + width * 0.15}
        y={coord.top + 2 + labelStyle.fontSize}
        fill={labelStyle.fill}
        fontSize={`${labelStyle.fontSize}px`}
        fontFamily={labelStyle.fontFamily}
        // alignmentBaseline="hanging"
        textAnchor="start"
      >
        {capitalizeFirstLetter(moment(date).format('dd'))}
      </text>
      <text
        x={coord.left + width * 0.15}
        y={coord.top + 25 + labelStyle.fontSize}
        fill={labelStyle.fill}
        fontSize={`${labelStyle.fontSize}px`}
        fontFamily={labelStyle.fontFamily}
        // alignmentBaseline="hanging"
        textAnchor="start"
      >
        {capitalizeFirstLetter(moment(date).format('MMM. D.'))}
      </text>
    </g>
  );
};

/**
 * propTypes
 * @type {Object}
 */
Label.propTypes =
{
  /**
   * Rectange coordinate (x1,y1,x2,y2) = top,left,bottom,right
   */
  coord: PropTypes.shape({
    top: PropTypes.number.isRequired,
    left: PropTypes.number.isRequired,
    bottom: PropTypes.number.isRequired,
    right: PropTypes.number.isRequired,
  }).isRequired,
  /**
   * current column start date
   */
  date: PropTypes.instanceOf(Date).isRequired,
  style: PropTypes.shape({
    fill: PropTypes.string,
    fontSize: PropTypes.number,
    fontFamily: PropTypes.string,
  }),
  isPrimary: PropTypes.bool,
  isSecondary: PropTypes.bool,
};

/**
 * defaultProps
 * @type {Object}
 */
Label.defaultProps =
{
  style: {},
  isPrimary: false,
  isSecondary: false,
};


export default Label;
