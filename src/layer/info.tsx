import React from 'react';
import classNames from 'classnames';


/* !- React Element */

import Tooltip from './tooltip';
import IconInfo from '../icon/mui/action/info';


/* !- Types */

type PropTypes = {
  // tooltip content
  title: React.ReactNode,
  small?: boolean,
};


/**
 * Info
 *
 * Gray (i) icon next to a label, the description in a tooltip on hover.
 *
 * @example
 *  <span>Label</span><Info title="Longer description" />
 */
const Info = ({ title, small = false }: PropTypes) =>
  <Tooltip title={<div className="text-s light" style={{ maxWidth: '20em', lineHeight: '140%' }}>{title}</div>}>
    <IconInfo className={classNames({
      'bg-gray circle fill-white no-events mx-1': true,
      'w-2 h-2': !small,
      'w-3/2 h-3/2': small,
    })} />
  </Tooltip>


export default Info;
