
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';


/* !- React Elements */

// import GridUI from './grid';


/* !- Actions */

// import * as GridActions from './actions';


/* !- Actions */

// import { DEFAULT_METHOD } from './constants';

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
    classes,
  },
) =>
{
  const onClickButtonHandler = () =>
  {
    console.log('onClickButtonHandler');
  };

  const modalClasses = (classes) ? `modal ${classes}` : 'modal';

  return (
    <div className={modalClasses}>

      { icon &&
      <div className={`icon ${icon}`} />
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

      { buttonSecondary &&
      <div
        className="button"
        onClick={buttonSecondary.handler}
      >
        {buttonSecondary.title}
      </div>
      }

      { button &&
        <div
          className="button secondary"
          onClick={button.handler}
        >
          {button.title}
        </div>
      }

    </div>
  );
};

// Grid.propTypes =
// {
//   ...GridUI.propTypes,
//   onClick: PropTypes.oneOfType([
//     PropTypes.func,
//     PropTypes.bool,
//   ]),
// };
//
// Grid.defaultProps =
// {
//   ...GridUI.defaultProps,
//   /**
//    * Invoke when user click to grid cell
//    * (rowIndex, colIndex) => console.log(rowIndex, colIndex)
//    *
//    * @param  {integer} rowIndex
//    * @param  {integer} colIndex
//    */
//   onClick: false,
// };



export default Modal;
