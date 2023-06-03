import React from 'react';
import classNames from 'classnames';


/* !- Actions */

// ...


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


/* !- Types */

import { IconTypes } from './icon';
import { StepTypes } from './const'

export interface IData
{
  label: string,
  status: IconTypes,
  // icon: React.SVGProps<SVGGElement>,
  icon: React.FC | React.SVGProps<SVGGElement>,
  onClick: (e: React.MouseEvent<SVGGElement>) => void,
  tooltip: React.FC | string,
  classNameText: string,
}

export interface PropTypes
{
  data: Partial<IData>[],
  width?: number,
  height?: number,
  className?: string,
  classNameText?: string,

  /**
   * Svg <g> elments represents steps
   * 
   * @example
   * const Step = ({ label, classNameText }) => (
   * <g>
   *  <text className={classNameText}>{label}</text>
   * </g>
   * )
   */
  step?: JSX.Element,
  type?: StepTypes
  onClick?: (e: React.MouseEvent<SVGSVGElement>) => void,
  canvasPaddingX?: number,
}


/**
 * Steppers convey progress through numbered steps. It provides a wizard-like workflow.
 */
export const Stepper: React.FC<PropTypes> = ({
  data = [],
  width = 200,
  height = 0,
  className = 'no-select',
  classNameText = 'text-s text-gray',
  step,
  type,
  onClick,
  canvasPaddingX = CANVAS_PADDING_X,
}) =>
{
  // data contains at least one label
  const isLabel = data.find(({ label }) => !!label) !== undefined;

  const viewBoxWidth =
    Math.max(0, (data.length * (ICON_ABS_WIDTH + LINE_WIDTH))
     - LINE_WIDTH
     + (CANVAS_PADDING_X * 2 * +isLabel));

  const viewBoxHeight = (TEXT_BOTTOM + TEXT_PADDING_BOTTOM) * +isLabel || ICON_HEIGHT;
  const canvasWidth = width || viewBoxWidth;
  const canvasHeight = height || viewBoxHeight;

  const element = step || (type ? STEP_TYPES[type] : null) || Step;

  const classNameExtends = classNames({
    pointer: onClick,
    [className]: true,
  });

  const ratio = (canvasWidth / canvasHeight) / (viewBoxWidth / viewBoxHeight);
  const ratioY = canvasHeight / viewBoxHeight ;

  const iconPadding = ICON_PADDING * ratioY;
  const iconWidth = ICON_WIDTH * ratioY;
  canvasPaddingX = canvasPaddingX * 2 * ratioY; // eslint-disable-line

  const lineWidth =
    Math.floor(
      (
        canvasWidth
        - (
          ((iconPadding + iconWidth + iconPadding) * data.length)
          + canvasPaddingX
        )
      )
      / (data.length - 1)
    )
    * (1 / ratioY);

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
      {/* { data.map((item, index) => (
        <Step index={index}
        <Step {...item}, data={data}, index={index} />
      ))} */}
    </svg>
  )
}

export default Stepper;
