import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useUrlChange } from '../hooks';


/* !-- Actions */

import { remove } from './actions';


/* !-- Components */

import classNames from 'classnames';
import IconClose from '../icon/mui/navigation/close';
import ProgressBar from './progressBar';
import { colorsToStyle } from './layout';


/* !-- Constants */


/* !-- Types */

import type { NotificationColor, NotificationColors } from './layout';

export type PropTypes = {
  id: string | number,
  children: React.ReactNode,
  disableClose?: boolean,
  closeOnChangeLocation?: boolean,
  autoClose?: boolean | number,
  color?: NotificationColor,
  colors?: NotificationColors,
  centered?: boolean,
};


/**
* Értesítés kártya: keret, háttér, tónus (`color` / `colors`), bezárás, automatikus bezárás időzítője.
*/
const NotificationItemWrapper = ({
  id,
  children,
  disableClose,
  closeOnChangeLocation,
  color = 'blue',
  colors,
  centered,
  ...props
}: PropTypes) => {

  const autoClose = props.autoClose === true ? 5 : (Number(props.autoClose) || 0);

  const dispatch = useDispatch();
  const { count } = useUrlChange();

  const onClose = () => {
    dispatch(remove(id));
  }

  // closeOnChangeLocation
  useEffect(() => {
    if (count && closeOnChangeLocation) {
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  return (
    <div
      className={classNames('notification-item', color, { centered })}
      style={colorsToStyle(colors)}
    >
      {children}

      {autoClose > 0 &&
        <ProgressBar percentTime={autoClose} onClose={onClose} timer />
      }

      {/* Close */}

      {disableClose !== true &&
        <IconClose onClick={onClose} className="notification-close" />
      }
    </div>
  );
}

export default NotificationItemWrapper;
