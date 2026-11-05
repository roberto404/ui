import React, { useEffect, useState } from 'react';

/* !-- Actions */


/* !-- Components */


/* !-- Constants */


/* !-- Types */

export type PropTypes = {
  percent?: number,
  /** másodperc: 0 → 100% alatt fut végig, a végén `onClose` */
  percentTime?: number;
  /** a kártya alján futó vékony visszaszámláló */
  timer?: boolean;
  /** százalék felirat a sáv mellett */
  label?: boolean;
  onClose?: () => void,
};


/**
* Progress sáv; színe a tónus `--notification-accent` változója.
*/
const NotificationProgressBar = ({
  percent = 0,
  percentTime,
  timer = false,
  label = false,
  onClose,
}: PropTypes) => {

  const [internalPercent, setInternalPercent] = useState(percent);

  useEffect(() => {
    if (!percentTime) {
      setInternalPercent(percent);
      return undefined;
    }

    setInternalPercent(0); // indulás
    const start = Date.now();
    let raf: number;

    const tick = () => {
      const elapsed = Date.now() - start;
      const newPercent = Math.min((elapsed / (percentTime * 1000)) * 100, 100);
      setInternalPercent(newPercent);

      if (newPercent < 100) {
        raf = requestAnimationFrame(tick);
      }
      else if (onClose) {
        onClose();
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [percentTime, percent]);

  const bar = (
    <div className={timer ? 'notification-timer' : 'notification-progress'}>
      <div
        className='notification-progress-bar'
        style={{
          width: `${internalPercent}%`,
          transition: !percentTime ? 'width 0.5s linear' : undefined,
        }}
      />
    </div>
  );

  if (!label) {
    return bar;
  }

  return (
    <div className='h-center gap-2 mt-1/2'>
      {bar}
      <div className='notification-title text-s nowrap'>{`${Math.round(internalPercent)}%`}</div>
    </div>
  );
}

export default NotificationProgressBar;
