import React from 'react';


/* !- Types */

export interface PropTypes
{
  percent: number,
  ringColor?: string,
  color?: string,
  caption?: string,
  strokeWidth?: number,
  /** rounded ends of the arc */
  rounded?: boolean,
  className?: string,
  /** inner background of the donut */
  fill?: string,
  /** color of the texts (percent, caption) */
  textColor?: string,
  /** target value in percent, marked with a tick on the ring */
  target?: number,
  targetColor?: string,
  /** small text below the caption, eg. "cél: 25 %" */
  targetCaption?: string,
}

const R = 15.91549430918954;

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
  rounded = false,
  className = '',
  fill = '#fff',
  textColor,
  target,
  targetColor,
  targetCaption = '',
}) =>
{
  /* target tick: 0% = 12 o'clock, clockwise; from inside the ring to its outer edge */
  const targetAngle = (Math.min(Math.max(target ?? 0, 0), 100) * 3.6 - 90) * Math.PI / 180;
  const targetInner = R - (strokeWidth / 2) - 1.5;
  const targetOuter = R + (strokeWidth / 2);

  /* move the texts up a bit to make room for the target caption */
  const shift = targetCaption ? -1.5 : 0;

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
        <circle cx="20" cy="20" r={R} fill={fill} />
        <circle stroke={ringColor} cx="20" cy="20" r={R} fill="transparent" strokeWidth={strokeWidth}/>
        <circle
          stroke={color}
          style={{
            transformOrigin: 'center',
            animation,
          }}
          cx="20"
          cy="20"
          r={R}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={`${percent} ${100-percent}`}
          strokeLinecap={rounded && percent > 0 ? 'round' : undefined}
          strokeDashoffset="25"
        />
        { target !== undefined &&
        <line
          x1={20 + (targetInner * Math.cos(targetAngle))}
          y1={20 + (targetInner * Math.sin(targetAngle))}
          x2={20 + (targetOuter * Math.cos(targetAngle))}
          y2={20 + (targetOuter * Math.sin(targetAngle))}
          stroke={targetColor || textColor || 'currentColor'}
          strokeWidth="0.6"
        />
        }
        <g fill={textColor}>
          <text y="50%" transform={`translate(0, ${2+!(caption)+shift})`}>
            <tspan x="50%" className="bold" textAnchor="middle" fontSize="0.5em">{`${percent}%`}</tspan>
          </text>
          { caption &&
          <text y="61%" transform={`translate(0, ${2+shift})`}>
            <tspan x="50%" textAnchor="middle" fontSize="0.13em">{caption}</tspan>
          </text>
          }
          { targetCaption &&
          <text y="70%" transform={`translate(0, ${2+shift})`} opacity="0.6">
            <tspan x="50%" textAnchor="middle" fontSize="0.13em">{targetCaption}</tspan>
          </text>
          }
        </g>
      </svg>
    </div>
  );
}


export default Donut;
