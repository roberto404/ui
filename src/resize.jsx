
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
    const width = this.element && !this.props.width ?
      this.element.offsetWidth : this.props.width || this.props.initWidth;

    const height = this.element && !this.props.height ?
      this.element.offsetHeight : this.props.height || width;

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
   * Overwrite dynamic width and height value
   */
  width: PropTypes.number,
  height: PropTypes.number,
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
  width: 0,
  height: 0,
  initWidth: 200,
};

export default Resize;
