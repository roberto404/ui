import React from 'react';


/* !- Types */

export interface PropTypes
{
  percent: number,
  ringColor?: string,
  color?: string,
  caption?: string,
  strokeWidth?: number,
  className?: string,
}

/**
 * Donut type chart
 */
const Donut: React.FC<PropTypes> = (
{
  percent,
  ringColor = '#EBEBEB',
  color = '#00ffff',
  caption = '',
  strokeWidth = 3.5,
  className = '',
}) =>
{
  const pulse = `@keyframes pulse {
    0% {
      stroke-dasharray: 0, 100;
    }
    100% {
      stroke-dasharray: ${percent}, ${100-percent};
    }
  }`;

  const animation = 'pulse 1.2s ease-in-out';

  return (
    <div>
      <style children={pulse} />
      <svg width="100%" height="100%" viewBox="0 0 40 40" className={className}>
        <circle cx="20" cy="20" r="15.91549430918954" fill="#fff" />
        <circle stroke={ringColor} cx="20" cy="20" r="15.91549430918954" fill="transparent" strokeWidth={strokeWidth}/>
        <circle
          stroke={color}
          style={{
            transformOrigin: 'center',
            animation,
          }}
          cx="20"
          cy="20"
          r="15.91549430918954"
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={`${percent} ${100-percent}`}
          strokeDashoffset="25"
        />
        <g>
          <text y="50%" transform={`translate(0, ${2+!(caption)})`}>
            <tspan x="50%" className="bold" textAnchor="middle" fontSize="0.5em">{`${percent}%`}</tspan>   
          </text>
          { caption &&
          <text y="60%" transform="translate(0, 2)">
            <tspan x="50%" textAnchor="middle" fontSize="0.12em">{caption}</tspan>
          </text>
          }
        </g>
      </svg>
    </div>
  );
}


export default Donut;