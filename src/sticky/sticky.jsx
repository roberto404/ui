import React, { Component } from 'react';
import isEmpty from 'lodash/isEmpty';
import { AppContext } from '../context';


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

    this.prevScrollTop = 0;
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
      this.forceUpdate(() =>
      {
        // wheel not contains touchpad scroll on windown :(
        this.context.addListener('scroll', this.onScrollListener);

        // this.scrollableParent = this.findScrollableParent();
        // this.scrollableParent.addEventListener('scroll', this.onScrollListener);
      });
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
    if (!this.element)
    {
      return;
    }

    const rect = this.element.getBoundingClientRect();
    const parentRect = this.element.parentElement.parentElement.getBoundingClientRect();

    /**
     * clientHeight: content & padding in viewport,
     * but if scrollbar visible that height not include (offsetHeight contains that)
     */
    const screenHeight = document.documentElement.clientHeight;

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    /**
     * Total screen height from 0 to current scroll position screen bottom
     */
    const scrollScreenHeight = scrollTop + screenHeight;


    const parentIsUpsideViewport = parentRect.height + parentRect.top < 0;
    const parentIsDownsideViewport = scrollScreenHeight < parentRect.top;

    const parentIsOnScreen = !parentIsUpsideViewport && !parentIsDownsideViewport;

    const screenBottomLowerThanRectInitialAbsBottom = rect.height + parentRect.top < screenHeight;

    /**
     * Case:
     * - sticky highest than container
     * scrollHeight: content & padding (visible or outside viewport) => absolute height
     */
    if (
      this.element.scrollHeight >= this.element.parentElement.parentElement.scrollHeight
      || parentRect.height <= screenHeight
      || !parentIsOnScreen
      || parentRect.top >= 0
    )
    {
      if (this.state.style && this.state.style.position)
      {
        this.setState({ style: {}});
      }

      return;
    }


    const isScrollDown = scrollTop - this.prevScrollTop > 0;
    this.prevScrollTop = scrollTop;



    // parent absolute top value
    const parentAbsTop = scrollTop + parentRect.top;
    const parentAbsBottom = parentRect.height + parentAbsTop;

    const rectAbsTopFromParentBottom = parentAbsBottom - rect.height;
    const rectAbsTopFromScreenBottom = screenHeight - rect.height;


    /**
     * Sticky heightest than screen, this value is the differences
     */
    const rectHeightOutsideScreen = Math.max(0, (rect.height - screenHeight));

    const style = {
      width: `${rect.width}px`,
      left: `${rect.left}px`,
      top: 0,
    };

    const diff = this.state.style.position === 'fixed' && this.state.style.top === -rectHeightOutsideScreen ?
      -rectHeightOutsideScreen : 0;

    if (
      isScrollDown
      && screenBottomLowerThanRectInitialAbsBottom
    )
    {
      if (
        rectAbsTopFromParentBottom < scrollTop + diff
      )
      {
        style.position = 'absolute';
        style.top = rectAbsTopFromParentBottom;
      }
      else
      {
        style.position = 'fixed';
        // ha nagyobb mint a screen akkor annyival elcsúsztatva;
        style.top = rect.height > screenHeight ? rectAbsTopFromScreenBottom : 0;
      }
    }
    else if (
      !isScrollDown // scrollUp
    )
    {
      if (rectAbsTopFromParentBottom > scrollTop )
      {
        style.position = 'fixed';
      }
      else
      {
        style.position = 'absolute';
        style.top = rectAbsTopFromParentBottom;
      }
    }

    this.setState({ style });
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

Sticky.contextType = AppContext;

export default Sticky;
