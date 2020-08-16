import React from 'react';
import PropTypes from 'prop-types';
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



export const Step = (props, { store }) =>
{
  const {
    label,
    isLabel,
    status,
    icon,
    data,
    index,
    className,
    classNameText,
    classNameLine,
    onClick,

    iconWidth,
    iconHeight,
    iconPadding,
    iconAbsWidth,
    lineWidth,
    canvasPaddingX,
    textPaddingBottom,
    textBottom,
  } = props;

  const isFirst = index === 0;
  const isLast = data.length === (index + 1);


  const tranformX = Math.floor(((index + 1) * ICON_PADDING) + (index * (ICON_WIDTH + ICON_PADDING + lineWidth)) + (CANVAS_PADDING_X * +isLabel));

  const element = icon || Icon;

  const classNameGroup = classNames({
    pointer: onClick,
    'no-child-events': tooltip,
    [className]: className,
  });

  const onMouseHandler = (event) =>
  {
    if (props.tooltip)
    {
      store.dispatch(tooltip(props.tooltip, event));
    }
  }

  const onMouseOutHandler = (event) =>
  {
    const { active, method } = store.getState().layer;

    if (active && method === 'popover' && props.tooltip)
    {
      store.dispatch(flush());
    }
  }

  return (
    <g
      transform={`translate(${tranformX}, 0)`}
      onClick={onClick}
      className={classNameGroup}
      onMouseEnter={onMouseHandler}
      onMouseOut={onMouseOutHandler}
    >
      {/* status */}

      {
        React.isValidElement(element) ?
          element
          : React.createElement(element, {...props, isFirst, isLast, tranformX })
      }

      {/* label */}

      <text className={classNameText}>
        <tspan x={ICON_WIDTH / 2} y={TEXT_BOTTOM} textAnchor="middle">{label}</tspan>
      </text>

      {/* line */}

      { !isFirst &&
      <path className={classNameLine} d={`M${ - lineWidth - ICON_PADDING},${ICON_HEIGHT / 2} L${-ICON_PADDING},${ICON_HEIGHT / 2}`} stroke="#F6F6F6" strokeWidth="2" />
      }
    </g>
  );
}

Step.defaultProps =
{
  iconWidth: ICON_WIDTH,
  iconHeight: ICON_HEIGHT,
  iconPadding: ICON_PADDING,
  iconAbsWidth: ICON_ABS_WIDTH,
  lineWidth: LINE_WIDTH,
  canvasPaddingX: CANVAS_PADDING_X,
  textPaddingBottom: TEXT_PADDING_BOTTOM,
  textBottom: TEXT_BOTTOM,
};

Step.contextTypes =
{
  store: PropTypes.object,
};


export default Step;
