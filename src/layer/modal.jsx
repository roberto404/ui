
import React from 'react';
import classNames from 'classnames';
import { useAppContext } from '../context';

/* !- Actions */

import { flush } from './actions';


/* !- Constants */

// ...


/**
 * Layer Redux Stateless Component
 *
 * Connected to layer state via Redux.
 * @example
 */
const Modal = (
  {
    icon,
    title,
    content,
    button,
    buttonSecondary,
    className,
  }
) =>
{
  const { store } = useAppContext();
  
  const onClickButtonHandler = (event) =>
  {
    event.preventDefault();
    event.stopPropagation();
    
    if (button.handler(store.getState().form.modal || {}) !== false && store.getState().layer.method !== 'preload')
    {
      store.dispatch(flush());
    }
  };

  const onClickSecondaryButtonHandler = (event) =>
  {
    event.preventDefault();
    event.stopPropagation();

    if (buttonSecondary.handler)
    {
      buttonSecondary.handler();
    }
    else
    {
      store.dispatch(flush());
    }
  }

  const modalClasses = classNames({
    modal: true,
    [className]: true,
  });

  return (
    <div className={modalClasses}>

      { icon &&
      <div className="icon">
        {icon()}
      </div>
      }

      { title &&
      <div className="title">
        {title}
      </div>
      }

      { content && typeof content === 'string' &&
      <div className="content" dangerouslySetInnerHTML={{__html: content}} />
      }

      { content && typeof content !== 'string' &&
      <div className="content">{content}</div>
      }

      <div className="buttons">

        { button &&
          <button
            className="button secondary"
            onClick={onClickButtonHandler}
          >
            {button.title}
          </button>
        }

        { buttonSecondary &&
          <button
            className="button"
            onClick={onClickSecondaryButtonHandler}
          >
            {buttonSecondary.title}
          </button>
        }

      </div>

    </div>
  );
};

export default Modal;
