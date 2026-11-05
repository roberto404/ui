import React, { useEffect, useRef, useState } from 'react';

/* !-- Actions */


/* !-- Components */

import IconAnimatedCheckmark from './iconCheckmark';
import ProgressBar from './progressBar';
import NotificationLayout from './layout';


/* !-- Constants */


/* !-- Types */

export type PropTypes = {
  title: string | Record<number, string>,
  percent: number,
  caption?: string | ((state: { percent: number, remaining: number | null }) => React.ReactNode),
  badge?: React.ReactNode,
  /** címke 100%-nál */
  badgeComplete?: React.ReactNode,
  onClose?: () => void,
};


/**
*
*/
const NotificationItemProgress = ({
  title = 'Loading data...',
  percent,
  caption = ({ remaining }) => (remaining ? `Kb. ${remaining} másodperc van hátra` : ''),
  badge,
  badgeComplete = 'Kész',
  onClose,
}: PropTypes) => {

  const [remaining, setRemaining] = useState<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const lastPercentRef = useRef<number>(0);

  useEffect(() => {

    if (percent === 100) {
      const duration = 2000;
      setTimeout(onClose, duration);
      setRemaining(0);
    }

    // inital with first percent
    if (!startTimeRef.current) {
      startTimeRef.current = Date.now();
      lastPercentRef.current = percent;
      return;
    }

    const now = Date.now();
    const elapsed = now - startTimeRef.current;
    const estimatedTotal = (elapsed / percent) * 100;
    const newRemaining = Math.max(Math.round((estimatedTotal - elapsed) / 1000), 0);

    setRemaining(newRemaining);

  }, [percent]);

  const currentTitle = typeof title === 'string' ?
    title
    :
    title[Object
      .keys(title)
      .map(Number)
      .find(key => percent <= key)];

  const complete = percent === 100;

  return (
    <NotificationLayout
      color={complete ? 'green' : undefined}
      icon={complete ? <IconAnimatedCheckmark className="notification-checkmark" /> : <div className="notification-spinner" />}
      badge={badge && (complete ? badgeComplete : badge)}
      title={currentTitle}
      caption={typeof caption === 'function' ? caption({ percent, remaining }) : caption}
      footer={<ProgressBar percent={percent} label />}
    />
  );
}

export default NotificationItemProgress;
