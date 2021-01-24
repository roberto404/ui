
import React from 'react';
import PropTypes from 'prop-types';
import reduce from 'lodash/reduce';
import findIndex from 'lodash/findIndex';


/* !- Actions */

import { setValues } from '../../form/actions';


/* !- React Elements */

import Connect from '../connect';
import Dropdown from '../../form/pure/dropdown';


/**
* Grid GridFieldGroupBy Component.
*
* Collect unique data from rawData and connected to grid state via Redux.
*
* @example
<GridFieldGroupBy
  id="category"
  label="Category"
  ?grid="robot"
/>
*/
const GridFieldGroupBy = (props, context) =>
{
  const { id, reducer } = props;


  const fetchData = () =>
  {
    const helper = typeof props.helper === 'function' ? props.helper() : props.helper;
    const grid = context.store.getState().grid[context.grid] || {};

    return (
      reduce(
        grid.rawData,
        (result, record) => reducer(result, record, id),
        [],
      )
      .map(
        item => ({
          id: item,
          title: (helper.find(({ id }) => id.toString() === item.toString()) || {}).title || item.toString(),
        }),
      )
      .sort((a, b) => a.title.localeCompare(b.title))
    );
  };

  return (
    <Connect
      listen="rawData"
      UI={Dropdown}
      uiProps={{
        ...props,
        data: fetchData,
        onChange: ({ value }) => context.store.dispatch(setValues({ [id]: value })),
        dataTranslate: false,
      }}
    />
  );
};


/**
 * propTypes
 * @type {Object}
 */
GridFieldGroupBy.propTypes =
{
  /**
   * Redux form state id
   */
  id: PropTypes.string,
  /**
   * Filter label
   */
  label: PropTypes.string,
  /**
   * Field placeholder
   */
  placeholder: PropTypes.string,
  /**
   * Change dropdown id to title from helper object
   */
  helper: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.arrayOf(PropTypes.object),
  ]),
  reducer: PropTypes.func,
};

/**
 * defaultProps
 * @type {Object}
 */
GridFieldGroupBy.defaultProps =
{
  id: 'fieldGroupByFilter',
  label: '',
  //TODO field placeholderét kellene h megörökölje
  placeholder: '',
  helper: [],
  /**
   * Collect records from rawData of Grid
   * @return {array}        collected unique field name
   * @example
   * ['male', 'femail']
   */
  reducer: (result, record, id) =>
  {
    if (Array.isArray(record[id]))
    {
      record[id].forEach((field) =>
      {
        if (result.indexOf(field) === -1)
        {
          result.push(field);
        }
      });
    }
    else if (
      ['string', 'number'].indexOf(typeof record[id]) !== -1
      && result.indexOf(record[id].toString()) === -1
    )
    {
      result.push(record[id].toString());
    }
    return result;
  },
};

GridFieldGroupBy.contextTypes =
{
  grid: PropTypes.string,
  store: PropTypes.object,
};

export default GridFieldGroupBy;
