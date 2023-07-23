
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import reduce from 'lodash/reduce';
import findIndex from 'lodash/findIndex';
import { GridContext } from '../context';
import { useDispatch, useStore } from 'react-redux';


/* !- Actions */

import { setValues } from '../../form/actions';


/* !- React Elements */

import Connect from '../connect';
import Select from '../../form/components/select';


/* !- Types */

const defaultProps =
{
  id: 'dropdownGroupByFilter',
  label: '',
  placeholder: '',
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

type PropTypes = Partial<typeof defaultProps> &
{
  /**
   * Redux form state id
   */
  id: string,
  /**
   * Change dropdown id to title from helper object
   */
  helper?: [{}],
}





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
const GridSelectGroupBy = (props: PropTypes) =>
{
  const { id, reducer } = props;

  const context = useContext(GridContext);
  const dispatch = useDispatch();
  const store = useStore();


  const fetchData = () =>
  {
    const grid = store.getState().grid[context.grid] || {};
    const helper = props.helper || grid.helper?.[id];

    return (
      reduce(
        grid.rawData,
        (result, record) => reducer(result, record, id),
        [],
      )
      .map(
        (item) =>
        {
          const title = helper.find(({ id }) => id.toString() === item.toString())?.title || item;

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
        onChange: ({ value }) => dispatch(setValues({ [id]: value })),
        dataTranslate: false,
      }}
    />
  );
};


/**
 * defaultProps
 * @type {Object}
 */
GridSelectGroupBy.defaultProps = defaultProps;

export default GridSelectGroupBy;
