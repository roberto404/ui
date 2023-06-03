import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';


/* !- Contexts */

import { bindFormContexts } from '../context';



/* !- React Elements */

import Field from '../formField';


/**
* Extended Field component.
*
* @extends Field
* @example
*
* <Toggle
*   id="city"
*   label="City"
* />
*/
class Toggle extends Field
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
  onChangeToggleHandler = (event) =>
  {
    event.preventDefault();
    this.onChangeHandler(typeof this.state.value === 'boolean' ? !this.state.value : !parseInt(this.state.value), event);
  }

  /* !- Renders */

  /**
   * This method is called when render the Component instance.
   * @override
   * @return {ReactElement}
   */
  render()
  {
    return super.render() || (
      <div className={this.getClasses('toggle')}>

        { this.label }

        <button
          onClick={this.onChangeToggleHandler}
        />

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
Toggle.propTypes =
{
  ...Toggle.propTypes,
  /**
   */
  data: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    })),
  ]),
};

/**
 * defaultProps
 * @type {Object}
 */
Toggle.defaultProps =
{
  ...Toggle.defaultProps,
  data: [],
  /**
   * Cast to boolean, because Formfield getClasses always give back active
   */
  stateFormat: value => !!+value,
};

export default bindFormContexts(Toggle);