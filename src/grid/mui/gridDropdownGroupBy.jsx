
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import reduce from 'lodash/reduce';
import findIndex from 'lodash/findIndex';
import orderBy from 'lodash/orderBy';


/* !- Actions */

import { setValues } from '../../form/actions';


/* !- React Elements */

import Dropdown from '../../form/mui/dropdown';


/**
* Grid Dropdown Filter Stateless Component
*
* Collect unique data from rawData
* Connected to grid state via Redux.
*
* @example
<GridDropdownGroupBy
  id="category"
  label="Category"
/>
*/
const GridDropdownGroupBy = (
  {
    id,
    label,
    data,
    rawData,
    helper,
    placeholder,
    changeValue,
  },
) =>
{
  if (!data.length)
  {
    data = [
      { id: '-1', title: 'Összes' },
      ...orderBy(
        reduce(
          rawData,
          (result, record) =>
          {
            if (typeof record[id] !== 'undefined' && result.indexOf(record[id]) === -1)
            {
              result.push(record[id]);
            }
            return result;
          },
          [],
        )
        .map(
          (item) =>
          {
            let title = item;
            const helperIndex = findIndex(helper, { id: item.toString() });

            if (helperIndex >= 0)
            {
              title = helper[helperIndex].title;
            }
            return { id: item, title };
          },
        ),
        ['title'],
        ['asc'],
      ),
    ];
  }

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
GridDropdownGroupBy.propTypes =
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
   * Data
   */
  data: PropTypes.arrayOf(PropTypes.object),
  /**
   * Data from redux
   */
  rawData: PropTypes.arrayOf(PropTypes.object).isRequired,
  /**
   * Change dropdown id to title from helper object
   */
  helper: PropTypes.arrayOf(PropTypes.object),
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
GridDropdownGroupBy.defaultProps =
{
  id: 'dropdownGroupByFilter',
  placeholder: '',
  helper: [],
  data: [],
};

export default connect(
  (state, props) => ({
    ...props,
    rawData: state.grid.rawData,
  }),
  {
    changeValue: setValues,
  },
)(GridDropdownGroupBy);
