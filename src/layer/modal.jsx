
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';


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
  },
  {
    store,
  }
) =>
{
  const onClickButtonHandler = (event) =>
  {
    event.preventDefault();
    
    if (button.handler(store.getState().form.modal || {}) !== false)
    {
      store.dispatch(flush());
    }
  };

  const onClickSecondaryButtonHandler = (event) =>
  {
    event.preventDefault();

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

// Modal.propTypes =
// {
// };

// Modal.defaultProps =
// {
// };

Modal.contextTypes =
{
  store: PropTypes.object,
}

export default Modal;
