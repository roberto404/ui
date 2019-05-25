
import React from 'react';
import PropTypes from 'prop-types';
import reactTapEventPlugin from 'react-tap-event-plugin';
import { connect } from 'react-redux';


/* !- React Elements */

import Dropdown from '../../form/mui/dropdown';


/* !- Actions */

import { setValues } from '../../form/actions';


/* !- Init Material-UI */

reactTapEventPlugin();


/**
 * Grid Dropdown Filter Stateless Component
 *
 * Connected to grid state via Redux.
 * @example
 * // id same Redux form[id] and grid.filters[id]
 *
 * <GridDropdown
 *   id="gender"
 *   label="Gender"
 *   data={[{ id: 1, title: 'Male' }, { id: 2, title: 'Female' }]}
 * />
 *
 * <GridDropdown
 *   id="restaurantId"
 *   label="Restaurants"
 *   data={
 *     orderBy(this.props.settings.helper.restaurants, ['title'], ['asc']),
 *   }
 * />
 */
const GridDropdown = (
  {
    id,
    label,
    placeholder,
    data,
    changeValue,
  },
) =>
{
  return (
    <div>
      <Dropdown
        id={id}
        label={label}
        placeholder={placeholder}
        data={data}
        onChange={({ value }) =>
        {
          changeValue({ [id]: value });
        }}
      />
    </div>
  );
};


/**
 * propTypes
 * @type {Object}
 */
GridDropdown.propTypes =
{
  /**
   * Redux form state id
   */
  id: PropTypes.string,
  /**
   * Filter label
   */
  label: PropTypes.string.isRequired,
  /**
   * Field placeholder
   */
  placeholder: PropTypes.string,
  /**
   * Dropdown elements
   * @example
   * [{ id: 2, title: 'Bar' }, { id: 1, title: 'Foo' }]
   */
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
      ]),
      title: PropTypes.string,
    })).isRequired,
  /**
   * Callback function that is fired when the input value changes.
   * setValues Form Action
   *
   * @param {integer} nextPage
   */
  changeValue: PropTypes.func.isRequired,
};

/**
 * defaultProps
 * @type {Object}
 */
GridDropdown.defaultProps =
{
  id: 'dropdownFilter',
  placeholder: '',
};

export default connect(
  (state, props) => (props),
  {
    changeValue: setValues,
  },
)(GridDropdown);
