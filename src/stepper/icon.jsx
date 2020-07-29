import React from 'react';
import PropTypes from 'prop-types';

/* !- Constants */

import {
  ICON_WIDTH,
  ICON_HEIGHT,
  ICON_PADDING,
  ICON_ABS_WIDTH,
} from './const';


export const Icon = ({
  index,
  label,
  status,
  isFirst,
  isLast,
}) =>
{
  switch (status)
  {
    case 'complete':
      return (
        <g>
          <circle fill="#F6F6F6" cx={ICON_WIDTH / 2} cy="12" r={ICON_WIDTH / 2} />
          <circle fill="#6DD230" cx="12" cy="12" r="8" />
          <polygon id={`icon${index}`} points="7 12.725 8.47 11.2445 10.6435 13.4285 16.03 8 17.5 9.4805 10.6435 16.4" fill="#FFFFFF" />
        </g>
      );
    case 'warning':
      return (
        <g>
          <circle fill="#F6F6F6" cx={ICON_WIDTH / 2} cy="12" r={ICON_WIDTH / 2} />
          <circle fill="#fab300" cx="12" cy="12" r="8" />
          <path id={`icon${index}`} d="M11.5,7 C13.46,7 15,8.51 15,10.47 C15,12.73 12.38,12.96 12.38,14.92 L10.62,14.92 C10.62,12.04 13.25,12.22 13.25,10.47 C13.25,9.54 12.43,8.72 11.5,8.72 C10.57,8.72 9.75,9.54 9.75,10.47 L8,10.47 C8,8.52 9.54,7 11.5,7 Z M10.62,15.8 L12.38,15.8 L12.38,17.56 L10.62,17.56 L10.62,15.8 Z" fill="#FFFFFF" />
        </g>
      );
    case 'error':
      return (
        <g>
          <circle fill="#F6F6F6" cx={ICON_WIDTH / 2} cy="12" r={ICON_WIDTH / 2} />
          <circle fill="#f34b91" cx="12" cy="12" r="8" />
          <path id={`icon${index}`} d="M12.1111111,17 C11.4974614,17 11,16.5025386 11,15.8888889 C11,15.2752392 11.4974614,14.7777778 12.1111111,14.7777778 C12.7247608,14.7777778 13.2222222,15.2752392 13.2222222,15.8888889 C13.2222222,16.5025386 12.7247608,17 12.1111111,17 Z M11,7 L13.2222222,7 L13.2222222,13.6666667 L11,13.6666667 L11,7 Z" fill="#FFFFFF" />
        </g>
      );
    case 1:
      return (
        <g>
          <circle fill="#F6F6F6" cx={ICON_WIDTH / 2} cy="12" r={ICON_WIDTH / 2} />
          <circle fill="#DFDFDF" cx={ICON_WIDTH / 2} cy="12" r="3" />
        </g>
      );
    default:
      return (
        <g>
          <circle fill="#F6F6F6" cx={ICON_WIDTH / 2} cy="12" r={ICON_WIDTH / 2} />
          <circle stroke="#DFDFDF" strokeWidth="2" fill="none" cx={ICON_WIDTH / 2} cy="12" r="3" />
        </g>
      )
  }
}

export default Icon;
