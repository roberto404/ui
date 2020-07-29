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
} from './const';



export const StepNumeric = (props) =>
{
  const {
    label,
    status,
    data,
    index,
    classesText,
    isLabel,
  } = props;

  const IconNumber = (
    <g>
      <circle fill="#F6F6F6" cx={ICON_WIDTH / 2} cy="12" r={ICON_WIDTH / 2} />
      <text className={classesText}>
        <tspan className="no-select" x={ICON_WIDTH / 2} y={ICON_HEIGHT / 2} alignmentBaseline="central" textAnchor="middle">{index + 1}</tspan>
      </text>
    </g>
  );

  const icon = props.icon || !status ? IconNumber : undefined;

  return <Step {...props} icon={icon} />;
}
export default StepNumeric;
