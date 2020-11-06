import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

/* !- Actions */

import { flush, tooltip } from '../layer/actions';


/* !- Compontents */

import Step from './step';


/* !- Constants */

import {
  ICON_WIDTH,
  ICON_HEIGHT,
  ICON_PADDING,
  ICON_ABS_WIDTH,
  LINE_WIDTH,
  CANVAS_PADDING_X,
  TEXT_PADDING_BOTTOM,
  TEXT_BOTTOM,
  STEP_TYPES,
} from './const';



/**
 * [Stepper description]
 */
const Stepper = ({
  data,
  width,
  height,
  className,
  classNameText,
  step,
  type,
  onClick,
  canvasPaddingX,
}) =>
{
  const isLabel = data.find(({ label }) => !!label) !== undefined;

  const viewBoxWidth = Math.max(0, (data.length * (ICON_ABS_WIDTH + LINE_WIDTH)) - LINE_WIDTH + (CANVAS_PADDING_X * 2 * +isLabel));
  const viewBoxHeight = (TEXT_BOTTOM + TEXT_PADDING_BOTTOM) * +isLabel || ICON_HEIGHT;
  const canvasWidth = width || viewBoxWidth;
  const canvasHeight = height || viewBoxHeight;

  const element = step || STEP_TYPES[type] || Step;

  const classNameExtends = classNames({
    pointer: onClick,
    [className]: true,
  });

  const ratio = (canvasWidth / canvasHeight) / (viewBoxWidth / viewBoxHeight);
  const ratioY = canvasHeight / viewBoxHeight ;

  const iconPadding = ICON_PADDING * ratioY;
  const iconWidth = ICON_WIDTH * ratioY;
  canvasPaddingX = canvasPaddingX * 2 * ratioY; // eslint-disable-line

  const lineWidth = Math.floor((canvasWidth - (((iconPadding + iconWidth + iconPadding) * data.length) + canvasPaddingX)) / (data.length - 1)) * (1 / ratioY);


  return (
    <svg
      onClick={onClick}
      className={classNameExtends}
      version="1.0"
      viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
      preserveAspectRatio="xMinYMin meet"
      width={`${canvasWidth}px`}
      height={`${canvasHeight}px`}
    >
      { data.map((item, index) => React.createElement(
        element,
        {
          classNameText,
          ...item,
          index,
          data,
          isLabel,
          key: index,
          canvasWidth,
          canvasHeight,
          lineWidth,
          canvasPaddingX,
        },
        ))
      }
    </svg>
  )
}

Stepper.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      status: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
      ]),
      icon: PropTypes.element,
      onClick: PropTypes.func,
      tooltip: PropTypes.oneOfType([
        PropTypes.element,
        PropTypes.string,
      ]),
    }),
  ),
  classNameText: PropTypes.string,
  type: PropTypes.string,
  onClick: PropTypes.func,
  canvasPaddingX: PropTypes.number,
};

Stepper.defaultProps = {
  width: 0,
  height: 0,
  data: [],
  className: 'no-select',
  classNameText: "text-s text-gray",
  type: PropTypes.oneOf(Object.keys(STEP_TYPES)),
  canvasPaddingX: CANVAS_PADDING_X,
};

export default Stepper;
