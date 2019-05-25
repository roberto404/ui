import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';


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
  onChangeButtonHandler = () =>
  {
    this.onChangeHandler(!this.state.value);
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
    let value = placeholder;

    if (typeof data === 'object')
    {
      value = data[+this.state.value] || placeholder;
    }
    else if (typeof data === 'function')
    {
      value = data(this.state.value);
    }

    return (
      <div className={this.getClasses('button')}>

        { this.label }

        <button
          onClick={this.onChangeButtonHandler}
        >
          { value }
        </button>

        { this.state.error &&
          <div className="error">{this.state.error}</div>
        }
      </div>
    );
  }
}

export default Button;
