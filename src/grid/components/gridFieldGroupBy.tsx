
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import reduce from 'lodash/reduce';
import { useDispatch, useStore } from 'react-redux';
import { GridContext } from '../context';


/* !- Actions */

import { setValues } from '../../form/actions';


/* !- React Elements */

import Connect from '../connect';
import Dropdown from '../../form/components/dropdown';


/* !- Types */

const defaultProps =
{
  /**
   * Redux form state id
   */
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

type PropTypes = Partial<typeof defaultProps> &
{
}



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
const GridFieldGroupBy = (props: PropTypes) =>
{
  const { id, reducer } = props;

  const context = useContext(GridContext);
  const dispatch = useDispatch();
  const store = useStore();

  const fetchData = () =>
  {
    const helper = typeof props.helper === 'function' ? props.helper() : props.helper || [];
    const grid = store.getState().grid[context.grid] || {};

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
        onChange: ({ value }) => dispatch(setValues({ [id]: value })),
        dataTranslate: false,
      }}
    />
  );
};

GridFieldGroupBy.defaultProps = defaultProps;

export default GridFieldGroupBy;
