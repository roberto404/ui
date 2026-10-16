import React from 'react';
import sum from 'lodash/sum';


/* !- Constants */

export const DEFAULT_COLORS = ['#8fd8b7', '#69b8f4', '#becff6', '#c899f4', '#6b8cef', '#fde35a', '#b7bec7'];
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
  /** ring (donut) mode: width of the ring relative to the radius (0–1), eg. 0.35 */
  thickness?: number,
  /** ring mode: gap between the segments, in percent of the circle */
  gap?: number,
  /** ring mode: content in the middle (total, caption …) */
  children?: React.ReactNode,
}

/**
 * Ring (donut) of the segments: clockwise from 12 o'clock, `gap` between them,
 * `children` centered in the hole
 */
const Ring = ({ data, className, thickness, gap, children }: Required<Pick<PropTypes, 'data' | 'className' | 'thickness' | 'gap'>> & { children?: React.ReactNode }) =>
{
  const width = RADIUS * 2 * Math.min(Math.max(thickness, 0), 1);
  const r = (RADIUS * 2) - (width / 2);
  const circumference = 2 * Math.PI * r;
  const gapLength = data.length > 1 ? (gap / 100) * circumference : 0;

  let start = 0;

  const ring = (
    <svg width="100%" height="100%" viewBox="0 0 20 20" className={className}>
      {
        data.map(({ id, percent, color }, i) =>
        {
          const length = Math.max(((percent / 100) * circumference) - gapLength, 0);
          const offset = -start;

          start += (percent / 100) * circumference;

          return (
            <circle
              key={id || i}
              id={id || i.toString()}
              className="transition"
              r={r}
              cx={RADIUS * 2}
              cy={RADIUS * 2}
              fill="transparent"
              stroke={color || DEFAULT_COLORS[i % DEFAULT_COLORS.length]}
              strokeWidth={width}
              strokeDasharray={`${length} ${circumference}`}
              strokeDashoffset={offset}
              transform={`rotate(-90 ${RADIUS * 2} ${RADIUS * 2})`}
            />
          );
        })
      }
    </svg>
  );

  if (!children)
  {
    return ring;
  }

  return (
    <div className="relative">
      {ring}
      <div className="absolute pin-t pin-r pin-b pin-l column h-center v-center text-center">
        {children}
      </div>
    </div>
  );
};

/**
 * Pie Chart
 *
 * `thickness` → ring (donut) of the segments, with `gap` and centered `children`
 */
const Pie: React.FC<PropTypes> = ({
  data = [],
  className = '',
  strokeColor = 'transparent',
  strokeWidth = 0,
  thickness,
  gap = 0,
  children,
}) =>
{
  if (thickness)
  {
    return <Ring data={data} className={className} thickness={thickness} gap={gap}>{children}</Ring>;
  }

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
