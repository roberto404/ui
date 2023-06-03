import React from 'react';

/* !- Constants */

import {
  ICON_WIDTH,
} from './const';


/* !- Types */

export enum IconTypes {
  COMPLETE = 'complete',
  WARNING = 'warning',
  ERROR = 'error',
  END = 'end',
  START = 'start',
}


interface PropTypes
{
  status?: IconTypes | 0 | 1,
  iconWidth?: number,
  index?: number,
}

export const Icon = (
{
  iconWidth = ICON_WIDTH,
  status,
  index = 0,
}: PropTypes) =>
{
  const width = iconWidth / 2;
  const widthRatio = iconWidth / ICON_WIDTH;
  
  const proportions = (value: number) =>
    widthRatio * value;

  const proportionsPoints = (points: string) =>
    points
      .split(' ')
      .map(value => proportions(parseFloat(value)))
      .join(' ');

  const proportionsPath = (points: string) =>
    points
      .split(' ')
      .map(value =>
        value
          .split(',')
          .map(value =>
            [...value.matchAll(/[A-Z]|[0-9.]+/g)]
              .map(i => isNaN(i[0] as any) ? i[0] : proportions(parseFloat(i[0])))
              .join('')
          )
          .join(',')
      )
      .join(' ');

    console.log(widthRatio, proportions(3));

  switch (status)
  {
    case IconTypes.COMPLETE:
      return (
        <g>
          <circle fill="#F6F6F6" cx={width} cy={width} r={width} />
          <circle fill="#6DD230" cx={width} cy={width} r={proportions(8)} />
          <polygon id={`icon${index}`} points={proportionsPoints("7 12.725 8.47 11.2445 10.6435 13.4285 16.03 8 17.5 9.4805 10.6435 16.4")} fill="#FFFFFF" />
        </g>
      );
    case IconTypes.WARNING:
      return (
        <g>
          <circle fill="#F6F6F6" cx={width} cy={width} r={width} />
          <circle fill="#fab300" cx={width} cy={width} r={proportions(8)} />
          <path id={`icon${index}`} d={proportionsPath("M11.5,7 C13.46,7 15,8.51 15,10.47 C15,12.73 12.38,12.96 12.38,14.92 L10.62,14.92 C10.62,12.04 13.25,12.22 13.25,10.47 C13.25,9.54 12.43,8.72 11.5,8.72 C10.57,8.72 9.75,9.54 9.75,10.47 L8,10.47 C8,8.52 9.54,7 11.5,7 Z M10.62,15.8 L12.38,15.8 L12.38,17.56 L10.62,17.56 L10.62,15.8 Z")} fill="#FFFFFF" />
        </g>
      );
    case IconTypes.ERROR:
      return (
        <g>
          <circle fill="#F6F6F6" cx={width} cy={width} r={width} />
          <circle fill="#f34b91" cx={width} cy={width} r={proportions(8)} />
          <path id={`icon${index}`} d={proportionsPath("M12.1111111,17 C11.4974614,17 11,16.5025386 11,15.8888889 C11,15.2752392 11.4974614,14.7777778 12.1111111,14.7777778 C12.7247608,14.7777778 13.2222222,15.2752392 13.2222222,15.8888889 C13.2222222,16.5025386 12.7247608,17 12.1111111,17 Z M11,7 L13.2222222,7 L13.2222222,13.6666667 L11,13.6666667 L11,7 Z")} fill="#FFFFFF" />
        </g>
      );
    case 1:
    case IconTypes.END:
      return (
        <g>
          <circle fill="#F6F6F6" cx={width} cy={width} r={width} />
          <circle fill="#DFDFDF" cx={width} cy={width} r={proportions(3)} />
        </g>
      );
    case IconTypes.START:
    default:
      return (
        <g>
          <circle fill="#F6F6F6" cx={width} cy={width} r={width} />
          <circle stroke="#DFDFDF" strokeWidth={proportions(2)} fill="none" cx={width} cy={width} r={proportions(3)} />
        </g>
      )
  }
}

export default Icon;
