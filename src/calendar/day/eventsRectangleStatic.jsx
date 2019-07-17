
import React from 'react';
import PropTypes from 'prop-types';


/* !- Constants */

const DEFAULT_STYLE = {
  marginRight: 2,
  fill: '#caefff',
  opacity: 0.8,
  fontColor: '#01689e',
  fontSize: 14,
  fontFamily: 'sans-serif',
  fontMargin: 5,
};


/**
 * x-Axis component
 */
const eventsLabel = (
{
  x,
  y,
  width,
  height,
  title,
},
) =>
{

  return (
    <g
      // id={`event event-${x}`}
      // ref={(ref) =>
      // {
      //   this.elements.event = ref;
      // }}
    >
      {/* <clipPath id="clip1">
        <rect
          x={e.x}
          y={e.y}
          width={e.width}
          height={e.height}
        />
      </clipPath> */}
      <rect
        x={x}
        y={y}
        width={width - DEFAULT_STYLE.marginRight}
        height={height}
        fill={DEFAULT_STYLE.fill}
        fillOpacity={DEFAULT_STYLE.opacity}
      />
      <text
        x={x + DEFAULT_STYLE.fontMargin}
        y={y + DEFAULT_STYLE.fontMargin}
        alignmentBaseline="hanging"
        fill={DEFAULT_STYLE.fontColor}
        fontSize={DEFAULT_STYLE.fontSize}
        fontFamily={DEFAULT_STYLE.fontFamily}
        // clipPath="url(#clip1)"
      >
        {title}
      </text>
    </g>
  );
};

/**
 * propTypes
 * @type {Object}
 */
eventsLabel.propTypes =
{
  title: PropTypes.string.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  // style: PropTypes.shape({
  //   fill: PropTypes.string,
  //   fontSize: PropTypes.number,
  //   fontFamily: PropTypes.string,
  // }),
};

/**
 * defaultProps
 * @type {Object}
 */
eventsLabel.defaultProps =
{
  // style: {},
};

export default eventsLabel;
