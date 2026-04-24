import React, { useContext } from 'react';
import { useDispatch, useSelector, useStore } from 'react-redux';

/* !-- Actions */

import { setValues, unsetValues } from '../../form/actions';
import { GridContext } from '../context';


/* !-- Components */

// ...


/* !-- Constants */

import { FORM_PREFIX } from '../constants';


/* !-- Types */

type PropTypes = {

};


/**
*
*/
const GridRowCheckbox = ({ }: PropTypes) => {

  const store = useStore();
  const dispatch = useDispatch();
  const context = useContext(GridContext) || {};

  const gridId = context.grid;
  const formId = FORM_PREFIX + gridId;



  const status = useSelector(({ grid, form }) => {
    const formLength = form[formId] ? form[formId].length : 0;
    const gridLength = grid[gridId] ? grid[gridId].data.length : 0;

    return formLength && Math.floor((formLength + gridLength) / gridLength);
  });

  // onClick header checkbox
  const onClickHeaderCheckboxHandler = () => {
    const state = store.getState();
    const form = state.form[formId] || [];


    const { data = [] } = store.getState().grid?.[gridId] || {};

    if (form.length) {
      dispatch(unsetValues({ id: formId }));
    }
    else {
      dispatch(setValues({
        id: formId,
        value: data.map(({ id }) => id),
      }));
    }
  };

  return (
    <div
      className={`checkbox ${['empty', 'fragment', 'full'][status]}`}
      onClick={onClickHeaderCheckboxHandler}
    />
  );
}

export default GridRowCheckbox;


