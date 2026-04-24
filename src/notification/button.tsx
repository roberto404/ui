import React from 'react';
import { useAppContext } from '../context';
import { useComponentDidMount, useComponentWillUnmount } from '../hooks';

/* !-- Actions */


/* !-- Components */


/* !-- Constants */


/* !-- Types */

export type PropTypes = {
  title?: string,
  className?: string,
  shortcut?: string,
  onClick?: (respond: Record<string, any>) => void,
  respond?: Record<string, any>,
  onClose: () => void,
};


/**
*
*/
const Button = ({
  title = 'Submit',
  className = 'button green w-content p-1/2 px-2',
  shortcut,
  onClick,
  respond,
  onClose,

}: PropTypes) => {

  const { addShortcuts, removeShortcuts } = useAppContext();

  useComponentDidMount(() => {

    if (shortcut) {
      addShortcuts(
        [{
          keyCode: shortcut,
          handler: onClickHandler,
        }],
        'button',
      );
    }
  });

  useComponentWillUnmount(() => {

    if (shortcut) {
      removeShortcuts('button')
    }
  });

  const onClickHandler = (event: React.MouseEvent<HTMLDivElement>) => {

    event.preventDefault();
    event.stopPropagation();

    if (onClick) {
      onClick(respond)
    }

    onClose();
  }


  return (
    <div className='h-center mt-1'>
      <div onClick={onClickHandler} className={className}>{title}</div>
      {shortcut &&
        <div className='light text-xs text-gray-dark ml-1'>{shortcut}</div>
      }
    </div>
  );
}

export default Button;