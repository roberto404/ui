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
      percent: 0,
      active: false,
    };
  }

  /* !- Handlers */

  /**
   * @private
   * @emits
   * @param  {SytheticEvent} event
   * @return {void}
   */
  onFocusHandler = (event) =>
  {
    this.props.onFocus({ id: this.props.name, value: event.target.value });
  }

  /**
   * @private
   * @emits
   * @param  {SytheticEvent} event
   * @return {void}
   */
  onBlurHandler = (event) =>
  {
    this.props.onBlur({ id: this.props.name, value: event.target.value });
  }


  /**
   * Convert current slider x,y position to real value
   * @param  {Integer} x
   * @param  {Integer} y
   * @return {Interger|String}   converted and formated value
   */
  convertPositionToValue({ x, percent } = this.state)
  {
    const { from, to } = this.props;

    /**
     * Converted value, determine props.from props.to
     * @type {Integer}
     */
    return ((parseFloat(to) - parseFloat(from)) * percent) + parseFloat(from);
  }

  convertPositionToPercent(x = this.state.x)
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

  get percent()
  {
    return (parseFloat(this.state.value) - parseFloat(this.props.from))
      / (parseFloat(this.props.to) - parseFloat(this.props.from));
  }

  initHammerDrag()
  {
    if (!this.hammerDragManager)
    {
      this.hammerDragManager = new Hammer.Manager(this.handle);
      this.hammerDragManager.add(new Hammer.Pan({ direction: Hammer.DIRECTION_HORIZONTAL }));
      this.hammerDragManager.on('panstart panmove pancancel panend', this.dragListener);
    }
  }

  dragListener = (event) =>
  {
    if (this.state.active === false)
    {
      this.setState({ active: true });
    }

    const x = clamp(
      event.center.x - this.field.getBoundingClientRect().x,
      0,
      this.field.offsetWidth,
    );

    switch (event.type)
    {
      case 'panmove':
        {
          const percent = this.convertPositionToPercent(x);

          if (this.state.percent !== percent)
          {
            this.setState({
              percent,
            });

            this.onChangeHandler(this.convertPositionToValue());
          }
          break;
        }

      case 'panend':
        {
          this.setState({
            active: false,
          });

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
  }

  // componentDidUpdate(props, nextState)
  // {
  //   /**
  //    * next value = 0 percent 0
  //    * state value = 2000 percent 0
  //    */
  //
  //   if (!this.state.percent && this.state.value && !nextState.percent)
  //   {
  //     console.warn(
  //       nextState,
  //       this.state,
  //     );
  //   }
  // }



  /* !- Renders */

  /**
   * This method is called when render the Component instance.
   * @override
   * @return {ReactElement}
   */
  render()
  {
    const percent = this.state.active ? this.state.percent : this.percent;

    const sliderClass = classNames({
      slider: true,
      active: this.state.active,
    });

    return (
      <div
        className={`field slider-field ${this.props.className}`}
        ref={(ref) =>
        {
          this.field = ref;
        }}
      >

        { this.label }

        <div className="table">

          { this.state.prefix &&
          <div className="prefix">{this.state.prefix}</div>
          }

          <div className="value">{this.state.value}</div>

          { this.props.postfix &&
          <div className="postfix">{this.state.postfix}</div>
          }

        </div>

        <div className={sliderClass}>
          <div className="inactive-line" />
          <div
            className="active-line"
            style={{ width: `${Math.round(percent * 100)}%` }}
          />
          <div
            className="handle"
            ref={(ref) =>
            {
              this.handle = ref;
            }}
            style={{ left: `${Math.round(percent * 100)}%` }}
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
  /**
   *
   */
  from: PropTypes.number,
  to: PropTypes.number,
  format: PropTypes.number,

  // prefix: PropTypes.oneOfType([
  //   PropTypes.element,
  //   PropTypes.string,
  // ]),
  // postfix: PropTypes.oneOfType([
  //   PropTypes.element,
  //   PropTypes.string,
  // ]),
};

/**
 * defaultProps
 * @override
 * @type {Object}
 */
Slider.defaultProps =
{
  ...Slider.defaultProps,
  // type: 'text',
  // underlineStyle: {},
  // onBlur()
  // {},
  // onFocus()
  // {},
  // regexp: '',
  prefix: '',
  postfix: '',
  from: '0',
  to: '100',
  format: v => Math.round(v).toString(),
};

export default Slider;
