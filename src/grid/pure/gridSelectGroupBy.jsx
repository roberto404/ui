
import React from 'react';
import PropTypes from 'prop-types';
import reduce from 'lodash/reduce';
import findIndex from 'lodash/findIndex';


/* !- Actions */

import { setValues } from '../../form/actions';


/* !- React Elements */

import Connect from '../connect';
import Select from '../../form/pure/select';


/**
* Grid SelectGroupBy Component.
*
* Collect unique data from rawData and connected to grid state via Redux.
*
* @example
<GridSelectGroupBy
  id="category"
  label="Category"
  ?grid="robot"
/>
*/
const GridSelectGroupBy = (props, context) =>
{
  const { helper, id, reducer } = props;

  const fetchData = () =>
  {
    const grid = context.store.getState().grid[context.grid] || {};

    return (
      reduce(
        grid.rawData,
        (result, record) => reducer(result, record, id),
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
      )
      .sort((a, b) => a.title.localeCompare(b.title))
    );
  };

  return (
    <Connect
      listen="rawData"
      UI={Select}
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
GridSelectGroupBy.propTypes =
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
  helper: PropTypes.arrayOf(PropTypes.object),
  reducer: PropTypes.func,
};

/**
 * defaultProps
 * @type {Object}
 */
GridSelectGroupBy.defaultProps =
{
  id: 'dropdownGroupByFilter',
  label: '',
  placeholder: '',
  helper: [],
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
    else if (['string', 'number'].indexOf(typeof record[id]) !== -1)
    {
      const value = record[id].toString();

      if (result.indexOf(value) === -1)
      {
        result.push(value);
      }
    }
    return result;
  },
};

GridSelectGroupBy.contextTypes =
{
  grid: PropTypes.string,
  store: PropTypes.object,
};

export default GridSelectGroupBy;
