import React from 'react';
import PropTypes from 'prop-types';
import capitalizeFirstLetter from '@1studio/utils/string/capitalizeFirstLetter';

/* !- Contexts */

import { FormContext } from '../context';
import { AppContext, bindContexts } from '../../context';


/* !- Redux Action */

import { menu, close } from '../../layer/actions';


/* !- React Elements */

import Field from '../formField';


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
    this.context.store.dispatch(close());

    if (this.props.multiple &&!id && this.props.placeholder && !find(this.data, i => i.id === 0))
    {
      this.onChangeHandler([]);
    }
    else
    {
      this.onChangeHandler(
        this.props.multiple ? this.createMultipleValueHelper(this.state.value, id) : id,
      );
    }
  }

  onClickButtonHandler = (event) =>
  {
    event.preventDefault();

    const value = this.state.value;

    // Check Active, which different in multiple mode
    const isActive = id => Array.isArray(value) ? value.indexOf(id) !== -1 : id === value;

    const data = [...this.data];

    if (this.props.placeholder && !find(this.data, i => i.id === 0))
    {
      data.unshift({
        id: 0,
        title: this.props.intl ?
          this.props.intl.formatMessage({ id: this.props.placeholder, default: this.props.placeholder })
          : this.props.placeholder,
      });
    }

    this.context.store.dispatch(menu(
      {
        items: data.map(item =>
          ({
            ...item,
            title: this.props.intl && this.props.dataTranslate ?
              capitalizeFirstLetter(this.props.intl.formatMessage({ id: item.title, default: item.title }))
              : item.title,
            className: item.className + (isActive(item.id) ? ' active' : ''),
            handler: item.handler ?
              item.handler(this.onChangeDropdownHandler) : this.onChangeDropdownHandler,
          }),
        ),
      },
      {
        currentTarget: this.element,
      },
    ));
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

    const placeholder = this.props.intl && this.props.dataTranslate ?
      this.props.intl.formatMessage({ id: this.props.placeholder, default: this.props.placeholder })
      : this.props.placeholder;

    const valueText = value
      .map(id =>
      {
        const title = (this.data.find(item => item.id.toString() === id.toString()) || {}).title;

        if (title)
        {
          return this.props.intl && this.props.dataTranslate ?
            capitalizeFirstLetter(this.props.intl.formatMessage({ id: title, default: title }))
            : title;
        }

        return '?';
      })
      .join(', ');

    return super.render() || (
      <div
        className={this.getClasses('dropdown')}
        onClick={this.onClickButtonHandler}
      >

        { this.label }

        <div className="h-center">

          { this.state.prefix &&
          <div className="prefix">{this.state.prefix}</div>
          }

          <button
            className={`value ${this.props.buttonClassName}`}
            onClick={this.onClickButtonHandler}
            ref={(ref) =>
            {
              this.element = ref;
            }}
          >
            { valueText || placeholder }
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
  placeholder: 'Kérem válasszon',
  buttonClassName: 'input firstcase v-left embed-expand-more-gray text-black',
};


export default bindContexts(Dropdown, [FormContext, AppContext]);