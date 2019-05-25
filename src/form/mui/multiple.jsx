import React from 'react';
import PropTypes from 'prop-types';

/* !- React Elements */

import MuiIconButton from 'material-ui/IconButton';
import IconButton from 'material-ui/svg-icons/content/add-circle-outline';
import IconArrowRight from 'material-ui/svg-icons/navigation-arrow-drop-right';
import MuiIconMenu from 'material-ui/IconMenu';
import MuiMenuItem from 'material-ui/MenuItem';

import Field from '../formField';

/**
* Multiple Component
* Simple or Nested list
*
* @extends Field
* @example
<Multiple
  id="services"
  label="Services"
  value={[1, 2]}
  data={[{ id: 1, title: '#1' }, { id: 2, title: '#2' }]}
  onChange={(relay) =>
  {
    console.log(relay.id, relay.value, relay.form);
  }}

  error="Something wrong"
  mandatory
/>

// or other data type

<Multiple
  id="gender"
  label="Gender"
  data={{
    0: 'inactive',
    1: 'active',
  }}
/>

// or nested data

<Multiple
  id="services"
  label="Services"
  data={[
    {
      id: 1,
      title: 'first item',
      children: [
        { id: 11, title: '1.1' },
        { id: 12, title: '1.2' },
      ],
    },
    {
      id: 2,
      title: 'second item',
      children: [
        { id: 21, title: '2.1' },
        { id: 22, title: '2.2' },
      ],
    },
  ]}
/>

*/
class Multiple extends Field
{

  /* !- Handlers */

  /**
   * @private
   * @emits
   * @param  {SytheticEvent} event
   * @param  {bool} checked
   * @return {void}
   */
  onChangeMultipleHandler = (event) =>
  {
    const id = event.currentTarget.dataset.id;

    if (!id)
    {
      return;
    }

    const value = [...this.state.value];
    const index = value.indexOf(id);

    if (index === -1)
    {
      value.push(id);
    }
    else
    {
      value.splice(index, 1);
    }

    this.onChangeHandler(value, id);
  }

  renderMenuItems(data)
  {
    return data.map((option, index) =>
    {
      let checked = false;
      let onClick = this.onChangeMultipleHandler;

      if (this.state.value.indexOf(option.id.toString()) > -1)
      {
        checked = true;
      }

      if (Array.isArray(option.children))
      {
        onClick = undefined;
        checked = option.children.every(child =>
          this.state.value.indexOf(child.id.toString()) > -1,
        );
      }

      const props = {
        key: option.id || index,
        'data-id': option.id,
        primaryText: option.title,
        checked,
        onClick,
        disabled: this.props.disabled,
        insetChildren: true,
      };

      if (option.children)
      {
        props.rightIcon = <IconArrowRight />;
        props.menuItems = this.renderMenuItems(option.children);
      }

      return React.createElement(MuiMenuItem, props);
    });
  }

  /**
   * This method is called when render the Component instance.
   * @override
   * @return {ReactElement}
   */
  render()
  {
    /**
     * convert data
     * it is object type, convert to array
     * { 0: 'inactive'} => [{id: 0, title: 'inactive'}]
     * @type {array}
     */
    let data = this.props.data;

    if (typeof data.length === 'undefined')
    {
      data = Object.keys(data).map(key => ({ id: key, title: this.props.data[key] }));
    }

    return (
      <div>
        {this.label}

        <MuiIconMenu
          iconButtonElement={this.props.button}
          maxHeight={272}
        >
          {this.renderMenuItems(data)}
        </MuiIconMenu>

        <div className="error">
          {this.state.error}
        </div>
      </div>
    );
  }
}

/**
 * propTypes
 * @override
 * @type {Object}
 */
Multiple.propTypes =
{
  ...Multiple.propTypes,
  /**
   * The selected values.
   * @override
   */
  value: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
  ),
  /**
   * Dropdown items
   * @example
   * [{ id: 2, title: 'Bar' }, { id: 1, title: 'Foo' }]
   * or
   * { 0: 'inactive', 1: 'active' }
   */
  data: PropTypes.oneOfType([
    PropTypes.objectOf(PropTypes.string),
    PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.number,
        ]),
        title: PropTypes.string,
      })),
  ]).isRequired,
  /**
   * Multiple button
   */
  button: PropTypes.element,
};

/**
 * defaultProps
 * @override
 * @type {Object}
 */
Multiple.defaultProps =
{
  ...Multiple.defaultProps,
  value: [],
  button: <MuiIconButton><IconButton /></MuiIconButton>,
};

export default Multiple;
