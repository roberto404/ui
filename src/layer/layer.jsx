
import React, { Component } from 'react';
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
class Layer extends Component
{
  constructor(props, context)
  {
    super(props);

    this.state = {
      show: false,
    };
  }

  shouldComponentUpdate(nextProps, nextState)
  {
    if (nextProps.active === false)
    {
      nextState.show = false;
    }

    return true;
  }

  componentDidUpdate(prevProps, prevState)
  {
    if (this.props.active === true && this.state.show === false)
    {
      this.setState({ show: true });
    }
  }

  onMouseDownHandler = (event) =>
  {
    this.mouseDownElementTarget = event.target;
  }

  render()
  {
    const {
      active,
      method,
      element,
      closeable,
      close,
      containerStyle,
      className,
      options,
      flush,
    } = this.props

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
        onClickCloseHandler();
      }
    };

    const onClickLayerCurtain = (event) =>
    {
      if (
        closeable
        && event.currentTarget.isEqualNode(event.target)
        && event.target === this.mouseDownElementTarget
      )
      {
        onClickCloseHandler();
      }
    };

    /**
     * Invoke when press close button.
     * @type {Function}
     * @return {void}
     */
    const onClickCloseHandler = () =>
    {
      if (typeof options.onClose === 'function')
      {
        if (options.onClose() === false)
        {
          return;
        };
      }

      close();
    };

    const layerClasses = classNames({
      layer: true,
      active,
      show: this.state.show,
      [method]: true,
      closeable,
      [className]: true,
    });

    if (options.autoClose)
    {
      setTimeout(() => flush(), parseInt(options.autoClose) * 1000);
    }

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

      if (options.bodyClass)
      {
        $('body').addClass(options.bodyClass);
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

    // const documentOnClickListener = (event) =>
    // {
    //   document.onclick = null;
    //   const layer = store.getState().layer;
    //
    //
    //   // if (layer.active && layer.method === 'popover' && JSON.stringify(layer.containerStyle()) === layer.element.toString())
    //   // {
    //   //   onClickCloseHandler();
    //   // }
    // }
    //
    // if (method === 'popover')
    // {
    //   document.onclick = documentOnClickListener;
    // }

    return (
      <div
        className={layerClasses}
        style={options.style || {}}
        onClick={onClickLayerCurtain}
        onMouseDown={this.onMouseDownHandler}
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
  }
}

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
  options: {},
  onClose: () => {},
};

Layer.contextTypes =
{
  store: PropTypes.object,
};


export default connect(
  ({ layer }) => ({
    active: layer.active,
    method: layer.method,
    element: layer.element,
    closeable: layer.closeable,
    containerStyle: layer.containerStyle,
    options: layer.options,
    className: ((layer.options) ? layer.options.className || '' : ''),
  }),
  {
    ...Actions,
  },
)(Layer);
