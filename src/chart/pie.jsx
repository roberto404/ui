import React from 'react';
import PropTypes from 'prop-types';
import sum from 'lodash/sum';


/* !- Constants */

const DEFAULT_COLORS = ['#8fd8b7', '#69b8f4', '#becff6', '#c899f4', '#6b8cef', '#fde35a', '#b7bec7'];
const PI = 31.42;
const RADIUS =5;

/**
 * Pie Chart
 */
const Pie = ({
  data,
  className,
  strokeColor,
  strokeWidth,
}) =>
{
  const pies = data.map((pie, i) => ({...pie, cumulatePercent: sum(data.slice(0, i + 1).map(({ percent }) => percent )) }));

  return (
    <svg width="100%" height="100%" viewBox="0 0 20 20" className={className}>
      <circle stroke={strokeColor} cx={RADIUS * 2} cy={RADIUS * 2} r={RADIUS * 2 - (strokeWidth / 2)} fill="transparent" strokeWidth={strokeWidth}/>
      {
        pies.reverse().map(({ id, percent, cumulatePercent, color, title }, i) => (
          <circle
            key={id || i}
            id={id || i}
            className='transition'
            r={RADIUS}
            cx={RADIUS * 2}
            cy={RADIUS * 2}
            title={title}
            fill="transparent"
            stroke={color || DEFAULT_COLORS[i]}
            strokeWidth={RADIUS * 2}
            strokeDasharray={`calc(${cumulatePercent} * ${PI} / 100) ${PI}`}
            transform={`rotate(-90) translate(-${RADIUS * 4})`}
          />
        ))
      }
    </svg>
  );
}

Pie.defaultProps = {
  data: [],
  className: '',
  strokeWidth: 0,
  strokeColor: 'transparent',
};

Pie.PropTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    percent: PropTypes.number,
    color: PropTypes.string,
    title: PropTypes.string,
  })),
  className: PropTypes.string,
  strokeWidth: PropTypes.number,
  strokeColor: PropTypes.string,
};


export default Pie;