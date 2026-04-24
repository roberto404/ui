import React, { useEffect, useState } from 'react';

/* !-- Actions */


/* !-- Components */


/* !-- Constants */


/* !-- Types */

import type { PropTypes as ItemPropTypes } from './item';

export type PropTypes = {
  percent?: number,
  color?: ItemPropTypes['color'];
  percentTime?: number;
  onClose: () => void,
};


/**
*
*/
const NotificationProgressBar = ({
  percent = 0,
  percentTime,
  color = 'green',
  onClose,
}: PropTypes) => {

  const [internalPercent, setInternalPercent] = useState(percent);

  useEffect(() => {
    if (!percentTime) {
      setInternalPercent(percent);
      return;
    }

    setInternalPercent(0); // indulás
    const start = Date.now();

    const tick = () => {
      const elapsed = Date.now() - start;
      const newPercent = Math.min((elapsed / (percentTime * 1000)) * 100, 100);
      setInternalPercent(newPercent);

      if (newPercent < 100) {
        requestAnimationFrame(tick);
      }
      else {
        onClose();
      }
    };

    const raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [percentTime, percent]);

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
          width: `${internalPercent}%`,
          borderTopRightRadius: internalPercent === 100 ? '0' : '20px',
          transition: !percentTime ? 'width 0.5s linear' : '',
        }}
      />
    </div>
  );
}

export default NotificationProgressBar;