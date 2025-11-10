import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useUrlChange } from '../hooks';


/* !-- Actions */

import { remove } from './actions';


/* !-- Components */

import IconClose from '../icon/mui/navigation/close';


/* !-- Constants */


/* !-- Types */


export type PropTypes = {
  id: string | number,
  children: React.ReactNode,
  disableClose?: boolean,
  closeOnChangeLocation?: boolean,
};


/**
*
*/
const NotificationItemWrapper = ({ id, children, disableClose, closeOnChangeLocation }: PropTypes) => {

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
      className='shadow-outer-2 rounded bg-white-light'
    >
      <div className='flex'>

        <div className='grow'>
          {children}
        </div>


        {/* Close */}

        {onClose && disableClose !== true &&
          <div className='p-1'>
            <IconClose
              onClick={onClose}
              className="ml-2 w-2 h-2 p-1/4 bg-white-light fill-gray circle hover:fill-black hover:bg-gray-light pointer"
            />
          </div>
        }
      </div>
    </div>
  );
}

export default NotificationItemWrapper;