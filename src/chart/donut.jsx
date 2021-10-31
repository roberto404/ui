import React from 'react';
import PropTypes from 'prop-types';
import { keyframes } from 'styled-components';


// console.log(keyframes);

/**
 * todo // https://bufferwall.com/posts/330881001ji1a/
 */
const Donut = ({
  ringColor,
  segmentColor,
  strokeWidth,
  percent,
  caption,
}) =>
{
  const pulse = keyframes`
    0% {
      stroke-dasharray: 0, 100;
    }
    100% {
        stroke-dasharray: ${percent}, ${100-percent};
    }
  `;

  return (
    <svg width="100%" height="100%" viewBox="0 0 40 40">
      <circle cx="20" cy="20" r="15.91549430918954" fill="#fff" />
      <circle stroke={ringColor} cx="20" cy="20" r="15.91549430918954" fill="transparent" strokeWidth={strokeWidth}/>
      <circle
        stroke={segmentColor}
        style={{
          transformOrigin: 'center',
          animation: `${pulse} 1.2s ease-in-out`,
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
        <text y="50%" transform={`translate(0, ${2+!caption})`}>
          <tspan x="50%" className="bold" textAnchor="middle" fontSize="0.5em">{`${percent}%`}</tspan>   
        </text>
        { caption &&
        <text y="60%" transform="translate(0, 2)">
          <tspan x="50%" textAnchor="middle" fontSize="0.12em">{caption}</tspan>
        </text>
        }
      </g>
    </svg>
  );
}

Donut.defaultProps = {
  ringColor: '#EBEBEB',
  segmentColor: '#00ffff',
  percent: 69,
  caption: '',
  strokeWidth: 3.5
};


export default Donut;