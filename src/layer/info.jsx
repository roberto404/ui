import React from 'react';
import classNames from 'classnames';


/* !- React Element */

import Tooltip from './tooltip';
import IconInfo from '../icon/mui/action/info';


/**
 * Info
 * @returns Component
 */
const Info = ({ title, small }) =>
  <Tooltip title={<div className="text-s light" style={{ maxWidth: '20em', lineHeight: '140%' }}>{title}</div>}>
    <IconInfo className={classNames({
      'bg-gray circle fill-white no-events mx-1': true,
      'w-2 h-2': !small,
      'w-3/2 h-3/2': small,
    })} />
  </Tooltip>


export default Info;