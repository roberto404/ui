import React from 'react';

const StepTimeLine = (
  {
    canvasWidth,
    canvasHeight,
    label,
    date,
    data,
    index,
  }
) =>
{

  const iconWidth = 8;
  const iconPadding = 5;
  const lineTop = 25;
  const canvasPaddingX = Math.floor(canvasWidth / (data.length) / 2);

  const lineWidth = Math.floor((canvasWidth - (data.length * (iconPadding + iconWidth + iconPadding)) - canvasPaddingX - canvasPaddingX) / (data.length - 1));


  const isLast = data.length === (index + 1);
  const tranformX = ((index + 1) * iconPadding) + (index * (iconWidth + iconPadding + lineWidth)) + canvasPaddingX;


  return (
    <g
      transform={`translate(${tranformX}, 0)`}
    >
      {/* label */}

      <text className="text-s">
        <tspan x={iconWidth / 2} y={4} textAnchor="middle" alignmentBaseline="hanging">{label}</tspan>
      </text>

      {/* line */}

      <circle fill="#4D7CFE" cx={iconWidth / 2} cy={lineTop} r={iconWidth / 2} />

      { !isLast &&
      <path d={`M${iconWidth + iconPadding},${lineTop} L${iconWidth + iconPadding + lineWidth},${lineTop}`} stroke="#4D7CFE" strokeWidth="1" />
      }

      {/* date */}

      <text className="text-xs light fill-gray">
        <tspan x={iconWidth / 2} y={canvasHeight - 1} textAnchor="middle" alignmentBaseline="baseline">{date}</tspan>
      </text>
    </g>
  );
}

export default StepTimeLine;
