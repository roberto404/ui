import React from 'react';
import PropTypes from 'prop-types';
import Hammer from 'hammerjs';
import clamp from '@1studio/utils/math/clamp';
import classNames from 'classnames';


/* !- React Elements */

import Field from '../../form/formField';


/**
* Slider Component
*
* @extends Field
*/
class Slider extends Field
{
  constructor(props)
  {
    super(props);

    this.state = {
      ...this.state,
      value: [this.percentToValue(0), this.percentToValue(1)],
      percent: [0, 1],
      active: false,
    };
  }

  /* !- Handlers */


  /**
   * Convert current slider x,y position to real value
   * @param  {Integer} x
   * @param  {Integer} y
   * @return {Interger|String}   converted and formated value
   */
  percentToValue(percent)
  {
    const { from, to } = this.props;

    /**
     * Converted value, determine props.from props.to
     * @type {Integer}
     */
    return ((parseFloat(to) - parseFloat(from)) * percent) + parseFloat(from);
  }

  pixelToPercent(x)
  {
    if (!this.field)
    {
      return 0;
    }

    const percent = x / this.field.offsetWidth;

    if (this.props.steps)
    {
      const oneStep = 1 / this.props.steps;
      return Math.round(percent / oneStep) * oneStep;
    }

    return percent;
  }

  percentToPixel(percent)
  {
    if (!this.field)
    {
      return 0;
    }

    return this.field.offsetWidth * percent;
  }

  getPercents = () =>
    this.state.value.map(value =>
      (parseFloat(value) - parseFloat(this.props.from))
        / (parseFloat(this.props.to) - parseFloat(this.props.from)),
    );

  getValues = () => [
    this.percentToValue(this.state.percent[0]),
    this.percentToValue(this.state.percent[1]),
  ];

  initHammerDrag()
  {
    if (this.props.enableStartHandler && !this.hammerDragManagerStart)
    {
      this.hammerDragManagerStart = new Hammer.Manager(this.handleStart);
      this.hammerDragManagerStart.add(new Hammer.Pan({ direction: Hammer.DIRECTION_HORIZONTAL }));
      this.hammerDragManagerStart.on('panstart panmove pancancel panend', this.dragListener);
    }

    if (!this.hammerDragManagerEnd)
    {
      this.hammerDragManagerEnd = new Hammer.Manager(this.handleEnd);
      this.hammerDragManagerEnd.add(new Hammer.Pan({ direction: Hammer.DIRECTION_HORIZONTAL }));
      this.hammerDragManagerEnd.on('panstart panmove pancancel panend', this.dragListener);
    }
  }

  dragListener = (event) =>
  {
    if (this.state.active === false)
    {
      this.setState({ active: true });
    }

    const index = parseInt(event.target.dataset.index);

    const x = clamp(
      event.center.x - this.field.getBoundingClientRect().x,
      index === 0 ? 0 : this.percentToPixel(this.state.percent[0]),
      index === 0 ? this.percentToPixel(this.state.percent[1]) : this.field.offsetWidth,
    );

    switch (event.type)
    {
      case 'panmove':
        {
          const percent = this.state.percent;
          percent[index] = this.pixelToPercent(x);

          if (this.state.percent[index] !== percent)
          {
            this.setState({
              percent,
            });

            if (this.props.onTheFly)
            {
              this.onChangeHandler(this.getValues());
            }
          }
          break;
        }

      case 'panend':
        {
          this.setState({
            active: false,
          });

          this.onChangeHandler(this.getValues());

          break;
        }

      default:
        break;
    }
  }


  componentDidMount()
  {
    super.componentDidMount();
    this.initHammerDrag();
    this.forceUpdate();
  }


  /* !- Renders */

  /**
   * This method is called when render the Component instance.
   * @override
   * @return {ReactElement}
   */
  render()
  {
    const percent = [
      this.state.active ? this.state.percent[0] : this.getPercents()[0],
      this.state.active ? this.state.percent[1] : this.getPercents()[1],
    ];

    const value = this.state.active ? this.props.stateFormat(this.getValues()) : this.state.value;

    console.log(value);

    const sliderClass = classNames({
      slider: true,
      active: this.state.active,
    });

    return (
      <div
        className={`field slider-field ${this.props.className}`}
      >

        { this.label }

        <div className="table">

          { this.state.prefix &&
          <div className="prefix">{this.state.prefix}</div>
          }

          { this.props.enableStartHandler &&
          <div className="value">{value[0]}</div>
          }
          <div className="value">{value[1]}</div>

          { this.props.postfix &&
          <div className="postfix">{this.state.postfix}</div>
          }

        </div>

        <div
          className={sliderClass}
          ref={(ref) =>
          {
            this.field = ref;
          }}
        >
          <div className="inactive-line" />
          <div
            className="active-line"
            style={{
              width: `${Math.round((percent[1] - percent[0]) * 100)}%`,
              left: `${Math.round(this.percentToPixel(percent[0]))}px`,
            }}
          />

          { this.props.enableStartHandler &&
          <div
            className="handle"
            ref={(ref) =>
            {
              this.handleStart = ref;
            }}
            style={{ left: `${Math.round(percent[0] * 100)}%` }}
            data-index="0"
          />
          }
          <div
            className="handle bg-red"
            ref={(ref) =>
            {
              this.handleEnd = ref;
            }}
            style={{ left: `${Math.round(percent[1] * 100)}%` }}
            data-index="1"
          />
        </div>

        { this.state.error &&
          <div className="error">{this.state.error}</div>
        }
      </div>
    );
  }
}

/**
 * propTypes
 * @override
 * @type {Object}
 */
Slider.propTypes =
{
  ...Slider.propTypes,
  value: PropTypes.arrayOf(PropTypes.number),
  /**
   * Slider value when handler is on 0%
   */
  from: PropTypes.number,
  /**
   * Slider value when handler is on 100%
   */
  to: PropTypes.number,
  /**
   * Sensitivity of handler x-axis moving
   */
  steps: PropTypes.number,
  /**
   * Component send data redux when handler is on moving
   */
  onTheFly: PropTypes.bool,
  /**
   * Enable to set start value. Visible two handler
   */
  enableStartHandler: PropTypes.bool,
};

/**
 * defaultProps
 * @override
 * @type {Object}
 */
Slider.defaultProps =
{
  ...Slider.defaultProps,
  value: [],
  stateFormat: state => (state || []).map(value => Math.round(value)),
  steps: 0,
  from: 0,
  to: 100,
  onTheFly: false,
  enableStartHandler: false,
};

export default Slider;
