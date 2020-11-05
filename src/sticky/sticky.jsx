import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';

/**
 * Floating element inside parent DOM
 * @extends Component
 */
class Sticky extends Component
{
  constructor(props)
  {
    super(props);

    this.style = {};

    this.state = {
      style: {},
    };
  }

  componentDidMount()
  {
    /**
     * Ha a scollable document nagyobb mint parent
     * @param  {[type]} this [description]
     * @return {[type]}      [description]
     */
    if (this.props.disable === false)
    {
      this.context.addListener('wheel', this.onScrollListener);
      // this.scrollableParent = this.findScrollableParent();
      // this.scrollableParent.addEventListener('scroll', this.onScrollListener);
      this.forceUpdate();
    }
  }

  componentWillUnmount()
  {
    if (this.props.disable === false)
    {
      this.context.removeListener(this.onScrollListener);
    }
  }

  /**
   * Proof of concept when scrollable element is not document
   * @return {[type]} [description]
   */
  // findScrollableParent = () =>
  // {
  //   let parent = this.element.parentNode;
  //
  //   while (
  //     parent.parentNode !== null
  //     && parent.scrollHeight === parent.clientHeight
  //   )
  //   {
  //     parent = parent.parentNode;
  //   }
  //
  //   return parent;
  // }

  onScrollListener = (event) =>
  {
    if (this.element.scrollHeight >= this.element.parentElement.parentElement.scrollHeight)
    {
      if (this.state.style && this.state.style.position)
      {
        this.setState({ style: {}});
      }

      return;
    }

    const isScrollDown = event.deltaY > 0;

    const screenHeight = document.documentElement.clientHeight;

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    // const scrollTop = this.scrollableParent.scrollTop;

    // total screen height until the current scroll position
    const scrollScreenHeight = scrollTop + screenHeight;

    const rect = this.element.getBoundingClientRect();
    const parentRect = this.element.parentElement.parentElement.getBoundingClientRect();


    // parent absolute top value
    const parentAbsTop = scrollTop + parentRect.top;

    const rectAbsTopFromParentBottom = parentRect.height - rect.height + parentAbsTop;
    const rectAbsTopFromScreenBottom = screenHeight - rect.height;


    // sticky maximum floating top value
    const rectMaxTop = rectAbsTopFromParentBottom - this.props.top;

    const rectIsOnParentBottom = parentRect.bottom <= rect.bottom;
    const rectIsOnScreenBottom = rect.height + parentRect.top <=  screenHeight;
    const rectIsRunOutOnTop = rect.top < 0;


    if (isScrollDown)
    {
      if (
        rectIsRunOutOnTop
        && rectIsOnScreenBottom // enable scroll up if element is highest than screen
        && !rectIsOnParentBottom
      )
      {
        const style = {
          position: 'fixed',
          width: `${rect.width}px`,
          left: `${rect.left}px`,
          top: rect.height > screenHeight ? rectAbsTopFromScreenBottom : 0, // ha nagyobb mint a screen akkor annyival elcsúsztatva
        };

        this.setState({ style });
      }
      else if (rectIsOnParentBottom)
      {
        const style = {
          position: 'absolute',
          top: `${rectAbsTopFromParentBottom}px`,
          width: `${rect.width}px`,
          left: `${rect.left}px`,
        }

        this.setState({ style });
      }
    }
    else
    {
      if (rect.top >= 0)
      {
        if (parentRect.top < 0)
        {
          const style = {
            position: 'fixed',
            width: `${rect.width}px`,
            left: `${rect.left}px`,
            top: `0px`,
          };

          this.setState({ style });
        }
        else
        {
          this.setState({ style: {} });
        }
      }
    }
  }

  render()
  {
    if (this.props.disable === true)
    {
      const children = this.props.children;
      return (Array.isArray(children) ? <div>{children}</div> : children);
    }

    // Fixing container element dimensions. When this.element is floating, the container is empty
    if (isEmpty(this.style) && this.element)
    {
      const rect = this.element.getBoundingClientRect();

      this.style = {
        minWidth: `${rect.width}px`,
        minHeight: `${rect.height}px`,
      };
    }


    return (
      <div style={this.style}>
        <div
          style={this.state.style}
          ref={(ref) =>
          {
            this.element = ref;
          }}
        >
          { this.props.children }
        </div>
      </div>
    );
  }
}

Sticky.defaultProps =
{
  top: 0,
  disable: false,
};

Sticky.contextTypes =
{
  addListener: PropTypes.func,
  removeListener: PropTypes.func,
};

export default Sticky;
