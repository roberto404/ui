import React, { useEffect, useState } from 'react';

/* !-- Actions */


/* !-- Components */


/* !-- Constants */


/* !-- Types */

import type { PropTypes as ItemPropTypes } from './item';

export type PropTypes = {
  percent: number,
  color?: ItemPropTypes['color'];
};


/**
*
*/
const NotificationProgressBar = ({
  percent = 0,
  color = 'green',
}: PropTypes) => {

  return (
    <div
      className='full bg-white rounded-button'
      style={{
        height: '5px',
        borderBottomLeftRadius: '10rem',
        borderBottomRightRadius: '10rem',
        overflow: 'hidden',
      }}
    >
      <div
        key="progress-bar"
        className={`h-full bg-${color}-dark`}
        style={{
          width: `${percent}%`,
          borderTopRightRadius: percent === 100 ? '0' : '20px',
          transition: 'width 0.5s linear',
        }}
      />
    </div>
  );
}

export default NotificationProgressBar;