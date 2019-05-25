import React from 'react';
import PropTypes from 'prop-types';

/* !- React Elements */

import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import Field from '../formField';


/**
* Dropdown Component
*
* @extends Field
* @example
<Dropdown
  id="restaurantId"
  label="Restaurant"
  placeholder="Please select"
  value="1"
  data={[{ id: 1, title: '#1' }, { id: 2, title: '#2' }]}
  onChange={(relay) =>
  {
    console.log(relay.id, relay.value, relay.form);
  }}

  error="Something wrong"
  mandatory
/>
*/
class Dropdown extends Field
{
  /**
   * This method is called when render the Component instance.
   * @override
   * @return {ReactElement}
   */
  render()
  {
    return (
      <SelectField
        onChange={(event, index, value) => this.onChangeHandler(value)}
        value={this.state.value}

        floatingLabelText={this.label}
        floatingLabelFixed={!!this.props.placeholder}
        hintText={this.props.placeholder}
        errorText={this.state.error}
        disabled={this.props.disabled}

        maxHeight={272}
        fullWidth
      >
        {
          this.props.data.map(option =>
            (
              <MenuItem
                key={option.id.toString().replace(/\W/g, '')}
                value={option.id}
                primaryText={option.title}
              />
            ))
          }
      </SelectField>
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
  /**
   * Dropdown elements
   * @example
   * [{ id: 2, title: 'Bar' }, { id: 1, title: 'Foo' }]
   */
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]),
      title: PropTypes.string,
    })).isRequired,
};

export default Dropdown;
