import React from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';


/* !- Redux Actions */

import { setValues } from '../../../src/form/actions';


/* !- React Elements */

import Form,
{
    Checkbox,

  Input,
  Select,
  Collection,
}
from '../../../src/form/pure/intl';

import { CollectionItem } from '../../../src/grid/pure/gridSearch';


/* !- Constants */


const NestedCollectionItem = ({ record, index, id, onChange }) =>
{
  const onChangePropsFiltersHandler = ({ value }) =>
  {
    if (!isEqual(value, record.props))
    {
      onChange({ ...record, props: { ...record.props, filters: value } });
    }
  }
  const onChangePropsHandler = ({ value, id }) =>
  {
    if (!isEqual(value, record.props))
    {
      onChange({ ...record, props: { ...record.props, [id]: value } })
    }
  }

  const onChangeHandler = ({ id, value }) =>
  {
    onChange({ ...record, [id]: value });
  };

  return (
    <div className="w-full border shadow rounded p-2 mb-4">
      <Input
        id="title"
        label="Title"
        value={record.title}
        onChange={onChangeHandler}
      />
      <Input
        id="subTitle"
        label="Subtitle"
        value={record.subTitle}
        onChange={onChangeHandler}
      />
      <Select
        id="modul"
        label="Type"
        onChange={onChangeHandler}
        data={[{ id: 'product', title: 'Product' }, { id: 'gallery', title: 'Gallery' }]}
        dataTranslate={false}
        value={record.modul}
      />
      <div className="label">Settings</div>

      { record.modul === 'product' &&
      <div className="border shadow-outer-3 p-2 rounded bg-gray-light">
        <div className="grid-2">
          <div className="col-1-2">
            <Input
              id="colNum"
              label="Columns"
              value={record.props.colNum}
              onChange={onChangePropsHandler}
            />
          </div>
          <div className="col-1-2">
            <Input
              id="rowNum"
              label="Rows"
              value={record.props.rowNum}
              onChange={onChangePropsHandler}
            />
          </div>
        </div>

        <Checkbox
          id="features"
          label="Features"
          value={record.props.features}
          valueClassName="col-3-12"
          onChange={onChangePropsHandler}
          data={[
            { id: 'order', title: 'Order' },
            { id: 'filter', title: 'Filter' },
          ]}
        />
        <div className="label">Filter</div>
        <Collection
          id={`${id}-${index}`}
          UI={CollectionItem}
          uiProps={{
            fields: [{ id: 1, title: 'foo' }, { id: 2, title: 'bar' }],
          }}
          value={record.props.filters && record.props.filters.length ? record.props.filters : [{ field: '1', operator: '=', value: '' }]}
          onChange={onChangePropsFiltersHandler}
          className="border shadow-outer-3 p-2 rounded bg-gray-light"
        />
      </div>
      }

    </div>
  );
};


/**
 * [Example description]
 */
const Example = (props, { store }) =>
{
  store.dispatch(setValues({
    collection: [
      { id: 1, title: 'foo' },
      { id: 2, title: 'bar' },
    ],
    collection2: [
      { field: 'name', operator: '=', value: 'Á' },
      { field: 'gender', operator: '==', value: 'male' },
      { field: 'id', operator: '<', value: '10' },
    ],
    // collection4: [
    //   {
    //     modul: 'product',
    //     title: 'Title',
    //     subTitle: 'subTitle',
    //     props: [
    //       { field: 'name', operator: '=', value: 'Á' },
    //       { field: 'gender', operator: '==', value: 'male' },
    //       { field: 'id', operator: '<', value: '10' },
    //     ],
    //   },
    // ],
  }, 'example'));

  return (
    <Form
      id="example"
      className="p-2"
    >
      <Collection
        id="collection"
        label="Collection"
      />
    
      <h2>Custom UI</h2>
      <Collection
        id="collection2"
        UI={CollectionItem}
      />

      <h2>Custom UI empty form</h2>
      <Collection
        id="collection3"
        value={[{ field: '1', operator: '=', value: '' }]}
        UI={CollectionItem}
        uiProps={{
          fields: [{ id: 1, title: 'foo' }, { id: 2, title: 'bar' }],
        }}
      />

      <h2>Nested Collection</h2>
      <Collection
        id="collection4"
        UI={NestedCollectionItem}
        value={[
          {
            modul: 'product',
            title: '',
            subTitle: '',
            props: {
              colNum: 4,
              rowNum: 0,
              features: ['order', 'filter'],
              filters: [{ field: '1', operator: '=', value: 'a' }],
            },
          },
        ]}
      />
    </Form>
  );
};

Example.contextTypes = {
  store: PropTypes.object,
};

export default Example;
