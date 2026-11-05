import React from 'react';
import { useAppContext } from '../context';
import { useComponentDidMount, useComponentWillUnmount } from '../hooks';

/* !-- Actions */


/* !-- Components */

import { NotificationButton } from './layout';


/* !-- Constants */


/* !-- Types */

export type PropTypes = {
  title?: string,
  /** megadásakor a régi, teljesen egyedi osztály (variant nélkül) */
  className?: string,
  icon?: React.FC<{ className?: string }>,
  variant?: 'primary' | 'outline' | 'secondary',
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
  className,
  icon,
  variant,
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
    <div className='h-center gap-1 mt-1/2'>
      <NotificationButton
        title={title}
        icon={icon}
        variant={variant || (className ? undefined : 'primary')}
        className={className}
        onClick={onClickHandler}
      />
      {shortcut &&
        <div className='notification-hint'>{shortcut}</div>
      }
    </div>
  );
}

export default Button;