
import React, { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * Resize component
 *
 * Calculate parent element dimension and
 * push width and height props to children
 *
 *
 * @example
 * <Resize>{width => <svg width={width} />}</Resize>
 */
class Resize extends Component
{
  componentDidMount()
  {
    this.forceUpdate();
  }
  render()
  {
    const width = this.element ? this.element.offsetWidth : this.props.initWidth;
    const height = this.element ? this.element.offsetHeight : width;

    return (
      <div
        style={{ width: '100%', height: '100%' }}
        ref={(ref) =>
        {
          this.element = ref;
        }}
      >
        {React.cloneElement(this.props.children, { width, height })}
      </div>
    );
  }
}

/**
 * propTypes
 * @type {Object}
 */
Resize.propTypes =
{
  /**
   * Initial width
   */
  initWidth: PropTypes.number,
  children: PropTypes.element.isRequired,
};


/**
 * defaultProps
 * @type {Object}
 */
Resize.defaultProps =
{
  initWidth: 200,
};

export default Resize;
