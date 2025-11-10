import React, { useEffect, useRef, useState } from 'react';

/* !-- Actions */


/* !-- Components */

import IconAnimatedCheckmark from './iconCheckmark';
import Preload from '../layer/preload';
import PreloadIcon from '../icon/preload';
import ProgressBar from './progressBar';


/* !-- Constants */


/* !-- Types */

export type PropTypes = {
  title: string | Record<number, string>,
  percent: number,
  caption?: string,
  onClose?: () => void,
};


// // caption="1.2Gb • About 2 seconds left."

/**
*
*/
const NotificationItemProgress = ({
  title = 'Loading data...',
  percent,
  caption = ({ percent, remaining }) => {

    let caption = `${percent} %`;

    if (remaining) {
      caption += ` • ${remaining} másodperc és kész.`;
    }
    return caption
  },
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

  return (

    <div>
      <div className='flex pl-1'>

        {/* Icon */}

        <div
          className='border-right p-2 mr-2 my-1'
          style={{ alignSelf: 'center' }}
        >
          {percent < 100 &&
            <div className='w-2 h-2 fill-gray-dark circle bg-gray-light'>
              <PreloadIcon />
            </div>
          }
          {percent === 100 &&
            <IconAnimatedCheckmark />
          }
        </div>

        {/* Message */}

        <div className='py-1 text-line-s'>
          <div
            className="bold"
          >
            {currentTitle}
          </div>
          <div className='text-s text-gray mt-1 light'>
            {typeof caption === 'string' ? caption : caption({ percent, remaining })}
          </div>
        </div>

      </div>
      <ProgressBar percent={percent} />
    </div>
  );
}

export default NotificationItemProgress;