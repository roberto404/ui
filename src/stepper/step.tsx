import React from 'react';
import classNames from 'classnames';

/* !- Actions */

import { flush, tooltip } from '../layer/actions';


/* !- Compontents */

import Icon from './icon';


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
} from './const';



/* !- Types */

import { IData } from './stepper';

export interface PropTypes extends Partial<IData>
{
  index: number,
  isLabel: boolean,
  data: Partial<IData>[],

  className?: string,
  classNameText?: string,
  classNameLine?: string,

  iconWidth?: number,
  iconHeight?: number,
  iconPadding?: number,
  iconAbsWidth?: number,
  lineWidth?: number,
  canvasPaddingX?: number,
  textPaddingBottom?: number,
  textBottom?: number,
}


/**
 * Svg <g> elments represents steps. Contains icon, label, lines and handling events
 */
export const Step: React.FC<PropTypes> = (
{
  label,
  isLabel,
  status,
  icon,
  data,
  index,
  className = '',
  classNameText = '',
  classNameLine = '',
  onClick,

  iconWidth = ICON_WIDTH,
  iconHeight = ICON_HEIGHT,
  iconPadding = ICON_PADDING,
  iconAbsWidth = ICON_ABS_WIDTH,
  lineWidth = LINE_WIDTH,
  canvasPaddingX = CANVAS_PADDING_X,
  textPaddingBottom = TEXT_PADDING_BOTTOM,
  textBottom = TEXT_BOTTOM,
}) =>
{
  const isFirst = index === 0;
  const isLast = data.length === (index + 1);

  const tranformX = Math.floor(
    ((index + 1) * iconPadding)
    + (index * (iconWidth + iconPadding + lineWidth))
    + (canvasPaddingX * +isLabel)
  );

  const StepIcon = icon || Icon;

  const classNameGroup = classNames({
    pointer: onClick,
    'no-child-events': tooltip,
    [className]: className,
  });

  // const onMouseHandler = (event) =>
  // {
  //   if (props.tooltip)
  //   {
  //     store.dispatch(tooltip(props.tooltip, event));
  //   }
  // }

  // const onMouseOutHandler = (event) =>
  // {
  //   const { active, method } = store.getState().layer;

  //   if (active && method === 'popover' && props.tooltip)
  //   {
  //     store.dispatch(flush());
  //   }
  // }


  return (
    <g
      transform={`translate(${tranformX}, 0)`}
      onClick={onClick}
      className={classNameGroup}
      // onMouseEnter={onMouseHandler}
      // onMouseOut={onMouseOutHandler}
    >
      {/* status */}

      {
        typeof StepIcon !== 'function' ?
          StepIcon
          : <StepIcon {...{ index, status, isFirst, isLast, tranformX }} />
      }

      {/* label */}

      <text className={classNameText}>
        <tspan
          x={iconWidth / 2}
          y={textBottom}
          textAnchor="middle"
        >
          {label}
        </tspan>
      </text>

      {/* line */}

      { !isFirst &&
      <path
        className={classNameLine}
        d={`M${ - lineWidth - iconPadding},${iconHeight / 2} L${-iconPadding},${iconHeight / 2}`}
        stroke="#F6F6F6"
        strokeWidth="2"
      />
      }
    </g>
  );
}

export default Step;
