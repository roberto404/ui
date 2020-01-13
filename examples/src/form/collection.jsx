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

import { CollectionItem, NestedCollectionItem } from '../../../src/grid/pure/gridSearch';


/* !- Constants */


/**
 * CollectionItem contains collection. Inside colleciton pass data to parent Collection
 */
const CustomNestedCollectionItem = ({ record, index, id, onChange }) =>
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
          UI={NestedCollectionItem}
          uiProps={{
            fields: [{ id: 1, title: 'foo' }, { id: 2, title: 'bar' }],
          }}
          value={record.props.filters && record.props.filters.length ? record.props.filters : [[{ field: '1', operator: '=', value: '' }]]}
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
  }, 'example'));

  return (
    <Form
      id="example"
      className="p-2"
    >
      <h2>Default collection UI items</h2>
      <Collection
        id="collection"
        label="Collection"
        value={[{ id: 1, title: 'foo' }]}
      />

      <h2>Custom UI items (GridSearch)</h2>
      <Collection
        id="collection2"
        value={[{ field: '1', operator: '=', value: '' }]}
        UI={CollectionItem}
        uiProps={{
          fields: [{ id: 1, title: 'foo' }, { id: 2, title: 'bar' }],
        }}
      />

    <h2>Custom UI Nested items (GridSearch)</h2>
      <Collection
        id="collection3"
        value={[[{ field: '1', operator: '=', value: '' }]]}
        UI={NestedCollectionItem}
        uiProps={{
          fields: [
            { id: 1, title: 'foo' },
            { id: 2, title: 'bar' },
          ],
        }}
      />

      <h2>Complex Nested Collection</h2>
      <Collection
        id="collection4"
        UI={CustomNestedCollectionItem}
        value={[
          {
            modul: 'product',
            title: '',
            subTitle: '',
            props: {
              colNum: 4,
              rowNum: 0,
              features: ['order', 'filter'],
              filters: [[{ field: '1', operator: '=', value: 'a' }]],
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
