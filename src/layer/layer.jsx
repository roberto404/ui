
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import $ from 'jquery';


/* !- Actions */

import * as Actions from './actions';


/* !- React Element */

import IconClose from '../icon/mui/navigation/close';


/* !- Constants */

import {
  AVAILABLE_METHODS,
} from './constants';

/**
 * Layer Component
 * Connect to layer state via Redux.
 */
const Layer = (
  {
    active,
    method,
    element,
    closeable,
    close,
    containerStyle,
    className,
  },
) =>
{
  /* !- Listeners */

  /**
   * Invoke press ESC. Close layer.
   * @param  {SytheticEvent} event
   * @type {Function}
   * @return {void}
   */
  const onKeyUpListener = (event) =>
  {
    if (event.keyCode === 27)
    {
      close();
    }
  };

  const onClickLayerCurtain = (event) =>
  {
    if (closeable && event.currentTarget.isEqualNode(event.target))
    {
      close();
    }
  };

  /**
   * Invoke when press close button.
   * @type {Function}
   * @return {void}
   */
  const onClickCloseHandler = () =>
  {
    close();
  };

  const layerClasses = classNames({
    layer: true,
    active,
    [method]: true,
    closeable,
    [className]: true,
  });

  $(document).off('.layer');

  if (active)
  {
    if (method === 'popover')
    {
      $('body').addClass('layer-popover');
    }
    else
    {
      $('body').addClass(`overflow h-screen layer-${method}`);
    }

    $('body').data('scrollTop', $('body').scrollTop());

    if (closeable)
    {
      $(document).on('keyup.layer', onKeyUpListener);
    }

    if (method === "fullscreen")
    {
      window.scrollTo(0, 0);
    }
  }
  else
  {
    $('body').removeClass();
    $('body').scrollTop($('body').data('scrollTop'));
  }

  return (
    <div
      className={layerClasses}
      onClick={onClickLayerCurtain}
    >
      <div
        className="container"
        style={containerStyle}
      >
        <div className="close" onClick={onClickCloseHandler}>
          <IconClose />
        </div>

        <div className="content">
          { React.isValidElement(element) && element }
          { typeof element === 'function' && element() }
        </div>

      </div>
    </div>
  );
};

Layer.propTypes =
{
  active: PropTypes.bool,
  method: PropTypes.oneOf(AVAILABLE_METHODS),
  element: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.element,
  ]),
  closeable: PropTypes.bool,
  close: PropTypes.func.isRequired,
  className: PropTypes.string,
  containerStyle: PropTypes.objectOf(PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ])),
};

Layer.defaultProps =
{
  active: false,
  method: 'dialog',
  element: <div />,
  className: '',
  closeable: true,
  containerStyle: {},
};


export default connect(
  ({ layer }) => ({
    active: layer.active,
    method: layer.method,
    element: layer.element,
    closeable: layer.closeable,
    containerStyle: layer.containerStyle,
    className: ((layer.options) ? layer.options.className || '' : ''),
  }),
  {
    ...Actions,
  },
)(Layer);
