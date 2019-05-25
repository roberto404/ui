import React from 'react';
import PropTypes from 'prop-types';


/* !- Redux Action */

import { menu, close } from '../../layer/actions';


/* !- React Elements */

import Field from '../../form/formField';


/**
* Use layer menu show items
*
* @extends Field
* @example
* <Dropdown
*   id="city"
*   label="City"
*   placeholder="Please select"
*   data={[{ id, title }, ...]}
* />
*
* @example
* // => overwrite default handler
* data = [
* {
*   id: 'color',
*   title: 'Color',
*   handler: (handler) => ({ id, title }) => setValues({ [id]: title },
* },
* {
*   id: 'color2',
*   title: 'Color',
*   handler: (handler) => ({ id, title }) =>
*   {
*     console.log(id);
*     return handler; // formField onChange handler
*   },
* },
* ]
*/
class Dropdown extends Field
{
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
   * Extends default onChangeHandler redux layer close action dispatch.
   *
   * @private
   * @override
   * @emits
   * @param  {Object} item { id, title }
   * @return {void}
   */
  onChangeDropdownHandler = ({ id }) =>
  {
    this.onChangeHandler(
      this.props.multiple ? this.createMultipleValueHelper(this.state.value, id) : id,
    );
    this.context.store.dispatch(close());
  }

  onClickButtonHandler = (event) =>
  {
    event.preventDefault();

    const value = this.state.value;

    // Check Active, which different in multiple mode
    const isActive = id => Array.isArray(value) ? value.indexOf(id) !== -1 : id === value;

    this.context.store.dispatch(menu({
      items: this.data.map(item =>
        ({
          ...item,
          className: item.className + (isActive(item.id) ? ' active' : ''),
          handler: item.handler ? item.handler(this.onChangeDropdownHandler) : this.onChangeDropdownHandler,
        }),
      ),
    }, event));
  }


  /* !- Renders */

  /**
   * This method is called when render the Component instance.
   * @override
   * @return {ReactElement}
   */
  render()
  {
    let value = this.state.value || [];
    value = Array.isArray(value) ? value : [value];

    const valueText = value
      .map(id => (this.data.find(item => item.id === id) || {}).title || '?')
      .join(', ');

    return (
      <div className={this.getClasses('dropdown')}>

        { this.label }

        <button
          className={`value ${this.props.buttonClassName}`}
          onClick={this.onClickButtonHandler}
        >
          { valueText || this.props.placeholder }
        </button>

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
Dropdown.propTypes =
{
  ...Dropdown.propTypes,
  multiple: PropTypes.bool,
};

/**
 * defaultProps
 * @type {Object}
 */
Dropdown.defaultProps =
{
  ...Dropdown.defaultProps,
  multiple: false,
  placeholder: 'Kérem válasszon.',
};

export default Dropdown;
