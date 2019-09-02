import React from 'react';
import PropTypes from 'prop-types';


/* !- Actions */

import * as layerActions from '../../layer/actions';

/* !- React Elements */

import Field from '../../form/formField';


/**
* Extended Field component.
*
* @extends Field
* @example
*
* <Button
*   id="city"
*   label="City"
* />
*/
class Button extends Field
{
  /* !- Handlers */

  /**
   * Extends default onChangeHandler
   *
   * @private
   * @override
   * @emits
   * @return {void}
   */
  onChangeButtonHandler = (event) =>
  {
    event.preventDefault();

    if (this.props.popover)
    {
      const layerElement = React.isValidElement(this.props.popover) ?
        this.props.popover : React.createElement(this.props.popover, { id: this.props.id });

      this.context.store.dispatch(layerActions.popover(
        <div className="pr-4">{layerElement}</div>,
        event,
      ));
    }
    else if (this.props.onClick(event))
    {
      this.onChangeHandler(!this.state.value);
    }
  }

  /* !- Renders */

  /**
   * This method is called when render the Component instance.
   * @override
   * @return {ReactElement}
   */
  render()
  {
    const { data, placeholder } = this.props;

    let value = this.state.value;

    if (typeof data === 'object' && data[+this.state.value])
    {
      value = data[+this.state.value];
    }

    return super.render() || (
      <div
        className={`${this.getClasses('button')} pointer`}
        onClick={this.onChangeButtonHandler}
      >

        { this.label }

        <div className="table">

          { this.state.prefix &&
          <div className="prefix">{this.state.prefix}</div>
          }

          <button
            className={this.props.buttonClassName}
          >
            { this.props.icon && React.createElement(this.props.icon)}
            <span>{ value && typeof value === 'string' ? value : placeholder }</span>
          </button>

          { this.props.postfix &&
          <div className="postfix">{this.state.postfix}</div>
          }

        </div>

        { this.state.error &&
          <div className="error">{this.state.error}</div>
        }
      </div>
    );
  }
}

Button.propTypes = {
  ...Button.propTypes,
  data: PropTypes.shape({
    0: PropTypes.string,
    1: PropTypes.string,
  }),
  onClick: PropTypes.func,
  popover: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.element,
  ]),
};

Button.defaultProps = {
  ...Button.defaultProps,
  onClick: () => true,
  data: {},
};

export default Button;
