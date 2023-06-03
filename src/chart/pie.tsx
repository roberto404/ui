import React from 'react';
import sum from 'lodash/sum';


/* !- Constants */

const DEFAULT_COLORS = ['#8fd8b7', '#69b8f4', '#becff6', '#c899f4', '#6b8cef', '#fde35a', '#b7bec7'];
const PI = 31.42;
const RADIUS =5;


/* !- Types */

export interface IData
{
  id?: string,
  percent: number,
  color?: string,
  // title?: string, // @todo
}

export interface PropTypes
{
  data: IData[],
  className?: string,
  strokeColor?: string,
  strokeWidth?: number,
}

/**
 * Pie Chart
 */
const Pie: React.FC<PropTypes> = ({
  data = [],
  className = '',
  strokeColor = 'transparent',
  strokeWidth = 0,
}) =>
{
  const pies = data.map((pie, i) => ({...pie, cumulatePercent: sum(data.slice(0, i + 1).map(({ percent }) => percent )) }));

  return (
    <svg width="100%" height="100%" viewBox="0 0 20 20" className={className}>
      <circle stroke={strokeColor} cx={RADIUS * 2} cy={RADIUS * 2} r={RADIUS * 2 - (strokeWidth / 2)} fill="transparent" strokeWidth={strokeWidth}/>
      {
        pies.reverse().map(({ id, percent, cumulatePercent, color }, i) => (
          <circle
            key={id || i}
            id={id || i.toString()}
            className='transition'
            r={RADIUS}
            cx={RADIUS * 2}
            cy={RADIUS * 2}
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

export default Pie;