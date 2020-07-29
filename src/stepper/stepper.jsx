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
  classesText,
  step,
  type,
  onClick,
}) =>
{
  const isLabel = data.find(({ label }) => !!label) !== undefined;

  const canvasWidth = width || Math.max(0, (data.length * (ICON_ABS_WIDTH + LINE_WIDTH)) - LINE_WIDTH + (CANVAS_PADDING_X * 2 * +isLabel));
  const canvasHeight = height || (TEXT_BOTTOM + TEXT_PADDING_BOTTOM) * +isLabel || ICON_HEIGHT;

  const element = step || STEP_TYPES[type] || Step;

  const className = classNames({
    pointer: onClick,
  });

  return (
    <svg onClick={onClick} className={className} version="1.0" viewBox={`0 0 ${canvasWidth} ${canvasHeight}`} preserveAspectRatio="xMidYMid meet" width={`${canvasWidth}px`} height={`${canvasHeight}px`} >
      { data.map((item, index) => React.createElement(element, { classesText, ...item, index, data, isLabel, key: index, canvasWidth, canvasHeight }))}
    </svg>
  )
}

Stepper.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      status: PropTypes.oneOfType(
        PropTypes.number,
        PropTypes.string,
      ),
      icon: PropTypes.element,
      onClick: PropTypes.func,
      tooltip: PropTypes.oneOfType(
        PropTypes.element,
        PropTypes.string,
      ),
    }),
  ),
  classesText: PropTypes.string,
  type: PropTypes.string,
  onClick: PropTypes.func,
};

Stepper.defaultProps = {
  width: 0,
  height: 0,
  data: [],
  classesText: "text-s text-gray",
  type: PropTypes.oneOf(Object.keys(STEP_TYPES)),
};

export default Stepper;
