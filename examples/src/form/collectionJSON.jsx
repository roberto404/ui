import React from 'react';
import PropTypes from 'prop-types';


/* !- Redux Actions */

import { setValues } from '../../../src/form/actions'


/* !- React Elements */

import
{
  Input,
  Select,
  Collection,
}
from '../../../src/form/pure/intl';

import { NestedCollectionItem } from '../../../src/grid/pure/gridSearch';


const DiscountCollectionItem = ({
  onChange,
  record,
  fields,
  operators,
  dataTranslateOperators,
  dataTranslateFields,
}) =>
{
  /**
   * onChange => { field, operator, value }
   */
  const onChangeHandler = ({ id, value }) =>
  {
    onChange({ ...record, [id]: value });
  };

  // const item = (fields.find(field => field.id === record.field) || {});

  /**
   * form collection pass onChange method
   */
  return (
    <div className="grid-2 w-full">
      <Input
        id="value"
        onChange={onChangeHandler}
        value={record.value}
        className="col-4-12"
        regexp="^[0-9]+$"
      />

      <Select
        id="method"
        onChange={onChangeHandler}
        data={[
          { id: 'ft', title: 'Ft' },
          { id: '%', title: '%' },
        ]}
        dataTranslate={false}
        className="col-4-12"
        value={record.method}
      />

      <Select
        id="subject"
        onChange={onChangeHandler}
        data={[
          { id: 'cart', title: 'Vásárlásból' },
          { id: 'ship', title: 'Szállításból' },
          { id: 'assembly', title: 'Szerelésből' },
        ]}
        dataTranslate={false}
        className="col-4-12"
        value={record.subject}
      />
    </div>
  );
};

/**
 * 
 * @returns React.Component
 */
const FieldProps = (props, { store, }) =>
{
  const onChangeListener = id => ({ value, form }) =>
  {
    const props = {
      ...store.getState().form[form]?.props || {},
      [id]: value,
    };

    store.dispatch(setValues({ props }, form));
  }

  const onChangeState = id => value =>
  {
    return value[id] || [];
  }

  return (
    <div>
      <h3>Discounts</h3>

      {/* <Collection
        id="props"
        UI={DiscountCollectionItem}
        value={{
          discounts: [{ value: '0', method: 'ft', subject: 'cart' }],
          filters: [[{ field: 'discount', operator: '=', value: '0' }]],
          validators: [[{ field: 'totalSaleGross', operator: '=', value: '0' }]],
        }}
      /> */}


      <Collection
        id="props"
        UI={DiscountCollectionItem}
        stateFormat={onChangeState('discounts')}
        onChange={onChangeListener('discounts')}
        value={[{ value: '0', method: 'ft', subject: 'cart' }]}
      />


      <h3>filters</h3>
      <Collection
        id="props"
        UI={NestedCollectionItem}
        uiProps={{
          fields: [
            {
              id: 'discount',
              title: 'Kedvezmény',
              operators: ['=', '!=', '>', '<'],
            },
            {
              id: 'flag',
              title: 'Címke',
              field: (
                <Select
                  data={[
                    { id: 'RSTOP', title: 'RSTOP'},
                  ]}
                  placeholder="Válassz"
                  dataTranslate={false}
                />
              ),
              operators: ['=', '!='],
            },
          ],
          // operators: ['=', '!=', '>', '<'],
          draggable: true,
          dataTranslateFields: false,
          dataTranslateOperators: false,
        }}
        stateFormat={onChangeState('filters')}
        onChange={onChangeListener('filters')}
        value={[[{ field: 'discount', operator: '=', value: '0' }]]}
      />
      
      <h3>validators:</h3>
      <Collection
        id="props"
        UI={NestedCollectionItem}
        uiProps={{
          fields: [
            {
              id: 'totalSaleGross',
              title: 'Termékek értéke',
              operators: ['=', '!=', '>', '<'],
            },
          ],
          // operators: ['=', '!=', '>', '<'],
          draggable: true,
          dataTranslateFields: false,
          dataTranslateOperators: false,
        }}
        stateFormat={onChangeState('validators')}
        onChange={onChangeListener('validators')}
        value={[[{ field: 'totalSaleGross', operator: '=', value: '0' }]]}
      />

    </div>
  );
}

FieldProps.contextTypes = {
  store: PropTypes.object,
}

export default FieldProps;