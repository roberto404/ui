import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';


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
    if (this.props.disable === false)
    {
      this.context.addListener('scroll', this.onScrollListener);
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

  onScrollListener = () =>
  {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const rect = this.element.getBoundingClientRect();
    const parentRect = this.element.parentElement.parentElement.getBoundingClientRect();
    const parentAbsTop = scrollTop + parentRect.y;
    const rectMaxY = parentRect.height + parentAbsTop - rect.height - this.props.top;

    // floating
    if (
      (rect.y < this.props.top && this.state.style.position === undefined)
      || (this.state.style.position === 'absolute' && rectMaxY > scrollTop)
    )
    {
      const style = {
        position: 'fixed',
        width: `${rect.width}px`,
        left: `${rect.left}px`,
        top: `${this.props.top}px`,
        maxHeight: 'calc(100vh - 50px)',
        overflowY: 'auto',
      };

      this.setState({ style });
    }
    // not floating after bottom limit, stay that position
    else if (this.state.style.position === 'fixed' && rectMaxY < scrollTop)
    {
      const style = {
        position: 'absolute',
        top: `${rectMaxY + this.props.top}px`,
        width: `${rect.width}px`,
        left: `${rect.left}px`,
      }

      this.setState({ sticky: true, style });
    }
    // default position
    else if (this.state.style.position !== undefined && scrollTop < parentAbsTop - this.props.top)
    {
      this.setState({ style: {} });
    }
  }

  render()
  {
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
