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
    classesText,
    onClick,
  } = props;

  const isFirst = index === 0;
  const isLast = data.length === (index + 1);

  const tranformX = ((index + 1) * ICON_PADDING) + (index * (ICON_WIDTH + ICON_PADDING + LINE_WIDTH)) + (CANVAS_PADDING_X * +isLabel);

  const element = icon || Icon;

  const className = classNames({
    pointer: onClick,
    'no-child-events': tooltip,
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
      className={className}
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

      <text className={classesText}>
        <tspan x={ICON_WIDTH / 2} y={TEXT_BOTTOM} textAnchor="middle">{label}</tspan>
      </text>

      {/* line */}

      { !isLast &&
      <path d={`M${ICON_WIDTH + ICON_PADDING},${ICON_HEIGHT / 2} L${ICON_WIDTH + ICON_PADDING + LINE_WIDTH},${ICON_HEIGHT / 2}`} stroke="#F6F6F6" strokeWidth="2" />
      }
    </g>
  );
}

Step.contextTypes =
{
  store: PropTypes.object,
};


export default Step;
