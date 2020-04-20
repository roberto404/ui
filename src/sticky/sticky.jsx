import React, { Component } from 'react';
import PropTypes from 'prop-types';


class Sticky extends Component
{
  constructor(props)
  {
    super(props);

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
    const parentRect = this.element.parentElement.getBoundingClientRect();
    const parentAbsTop = scrollTop + parentRect.y;
    const rectMaxY = parentRect.height + parentAbsTop - rect.height - this.props.top;

    if (
      (rect.y < this.props.top && this.state.style.position === undefined)
      || (this.state.style.position === 'absolute' && rectMaxY > scrollTop)
    )
    {
      const style = {
        position: 'fixed',
        width: `${rect.width}px`,
        top: `${this.props.top}px`,
      };

      this.setState({ style });
    }
    else if (this.state.style.position === 'fixed' && rectMaxY < scrollTop)
    {
      const style = {
        position: 'absolute',
        top: `${rectMaxY + this.props.top}px`,
        width: `${rect.width}px`,
      }

      this.setState({ sticky: true, style });
    }
    else if (this.state.style.position !== undefined && scrollTop < parentAbsTop - this.props.top)
    {
      this.setState({ style: {} });
    }
  }

  render()
  {
    return (
      <div
        style={this.state.style}
        ref={(ref) =>
        {
          this.element = ref;
        }}
      >
        { this.props.children }
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
