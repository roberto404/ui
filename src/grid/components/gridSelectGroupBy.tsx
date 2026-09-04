
import React, { useContext, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import reduce from 'lodash/reduce';
import findIndex from 'lodash/findIndex';
import { GridContext } from '../context';
import { useDispatch, useSelector, useStore } from 'react-redux';


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
  reducer: (result, record, id) => {
    if (Array.isArray(record[id])) {
      record[id].forEach((field) => {
        if (result.indexOf(field) === -1) {
          result.push(field);
        }
      });
    }
    else if (['string', 'number'].indexOf(typeof record[id]) !== -1) {
      const value = record[id].toString();

      if (result.indexOf(value) === -1) {
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
  /**
   * Initial value.
   * Function form is resolved from the collected (async loaded) grid data.
   * @example
   * value={data => data.sort((a, b) => b.id - a.id)[0]?.id}
   */
  value?: string | number | ((data: { id: string, title: string }[]) => string | number | undefined),
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
*
* @example initial value from the loaded data
<GridSelectGroupBy
  id="couponId"
  value={data => data.sort((a, b) => b.id - a.id)[0]?.id}
/>
*/
const GridSelectGroupBy = (props: PropTypes) => {

  const { id, reducer } = props;

  const context = useContext(GridContext);
  const dispatch = useDispatch();
  const store = useStore();


  const fetchData = () => {

    const grid = store.getState().grid[context.grid] || {};
    const helper = props.helper || grid.helper?.[id] || [];

    return (
      reduce(
        grid.rawData,
        (result, record) => reducer(result, record, id),
        [],
      )
        .map(
          (item) => {
            const title = helper.find(({ id }) => id.toString() === item.toString())?.title || item;

            return { id: item, title };
          },
        )
        .sort((a, b) => a.title.localeCompare(b.title))
    );
  };

  /**
   * Resolve the initial value from the loaded data, when `value` is a function.
   *
   * The grid data arrives async, so the first non empty rawData is awaited,
   * then the resolved value is dispatched to the form store,
   * otherwise only the dropdown would display it, without filtering the grid.
   *
   * Applied only once and never overwrites an already set filter value.
   */
  const isDefaultValueApplied = useRef(false);
  const rawDataLength = useSelector(state => (state.grid[context.grid] || {}).rawData?.length || 0);

  useEffect(
    () => {
      if (
        typeof props.value !== 'function'
        || isDefaultValueApplied.current
        || rawDataLength === 0
      ) {
        return;
      }

      if (store.getState().form[id] !== undefined) {
        isDefaultValueApplied.current = true;
        return;
      }

      const value = props.value(fetchData());

      if (value === undefined || value === null) {
        return;
      }

      isDefaultValueApplied.current = true;
      dispatch(setValues({ [id]: value }));
    },
    [rawDataLength],
  );

  return (
    <Connect
      listen="rawData"
      UI={Select}
      uiProps={{
        ...props,
        data: fetchData,
        onChange: ({ value }) => dispatch(setValues({ [id]: value })),
        dataTranslate: false,
        // resolved value comes from the form store, see the effect above
        value: typeof props.value === 'function' ? undefined : props.value,
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
