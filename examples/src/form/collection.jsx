import React from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import formatThousand from '@1studio/utils/string/formatThousand';
import moment from 'moment';

/* !- Redux Actions */

import { setValues } from '../../../src/form/actions';


/* !- React Elements */

import Form,
{
  Checkbox,
  Input,
  Select,
  Toggle,
  Collection,
  CalendarMonthButton,
}
from '../../../src/form/pure/intl';

import { CollectionItem, NestedCollectionItem } from '../../../src/grid/pure/gridSearch';

import Grid from '../../../src/grid/pure/grid';

import Connect from '../../../src/form/connect';
import JsonCollection from './collectionJSON';



/* !- Constants */

import { DATE_FORMAT } from '../../../src/calendar/constants';

const example2GridValue = 
  [{"id":"141171","invoiceNumber":"T007725\/21","invoicingDate":"2021-10-19","paymentDate":"2021-10-17","priceGross":"15000"},{"id":"141851","invoiceNumber":"T007956\/21","invoicingDate":"2021-10-27","paymentDate":"2021-10-26","priceGross":"18850"}];


const CustomCollectionItem = ({ onChange, record, fields }) =>
{
  const onChangeHandler = ({ id, value }) =>
  {
    const collectionId = id.substring(id.indexOf('#') + 1);
    onChange({ ...record, [collectionId]: value });
  };

  return (
    <div className="grid-2 w-full">
      <Input
        id="search#title"
        className="col-1-2"
        value={record.title}
        onChange={onChangeHandler}
      />
      <Input
        id="search#url"
        className="col-1-2 col-br"
        value={record.url}
        onChange={onChangeHandler}
      />
    </div>
  );
};

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

const Example1 = ({ record, index, id, fields, onChange }) =>
{
  const onChangeHandler = ({ id, value }) =>
  {
    const collectionId = id.substring(id.indexOf('#') + 1);
    onChange({ ...record, [collectionId]: value });
  };

  return (
    <div className="h-center w-full">
      <Input
        id="search#id"
        className="grow m-0"
        value={record.id}
        onChange={onChangeHandler}
      />
      <Toggle
        id="search#status"
        className="m-0 w-6 mx-2"
        value={record.status}
        onChange={onChangeHandler}
      />
    </div>
  );
}
export const Example2 = ({ record, index, id, fields, onChange }) =>
{
  const onChangeHandler = ({ id, value }) =>
  {
    const collectionId = id.substring(id.indexOf('#') + 1);
    onChange({ ...record, [collectionId]: value });
  };

  return (
    <div className="grid-2">
      <Input
        id="search#id"
        className="col-1-6"
        value={record.id}
        onChange={onChangeHandler}
      />
      <Input
        id="search#invoiceNumber"
        className="col-1-6"
        value={record.invoiceNumber}
        onChange={onChangeHandler}
      />
      <div className="col-1-6">
        <CalendarMonthButton
          id="search#invoicingDate"
          value={record.invoicingDate}
          dateFormat={DATE_FORMAT}
          stateFormat={value => value ? moment(value).format('l') : ''}
          className="w-full"
          buttonClassName="border border-gray-light text-black shadow"
          onChange={onChangeHandler}
        />
      </div>
      <div className="col-1-6">
        <CalendarMonthButton
          id="search#paymentDate"
          value={record.paymentDate}
          dateFormat={DATE_FORMAT}
          stateFormat={value => value ? moment(value).format('l') : ''}
          className="w-full"
          buttonClassName="border border-gray-light text-black shadow"
          onChange={onChangeHandler}
        />
      </div>
      <Input
        id="search#priceGross"
        className="col-1-6"
        value={record.priceGross}
        onChange={onChangeHandler}
        stateFormat={value => formatThousand(value)}
        format={value => value.replaceAll(/[^0-9]/g, '')}
      />
      <Input
        id="search#payment"
        className="col-1-6 col-br"
        value={record.payment}
        onChange={onChangeHandler}
      />
      
    </div>
  );
}


/**
 * [Example description]
 */
const Example = (props, { store }) =>
{
  // store.dispatch(setValues({
  //   collection: [
  //     { id: 1, title: 'foo' },
  //     { id: 2, title: 'bar' },
  //   ],
  //   collection2: [
  //     { field: 'name', operator: '=', value: 'Á' },
  //     { field: 'gender', operator: '==', value: 'male' },
  //     { field: 'id', operator: '<', value: '10' },
  //   ],
  //   props: {
  //     discounts: [{ value: '0', method: 'ft', subject: 'cart' }],
  //     filters: [[{ field: 'discount', operator: '=', value: '0' }]],
  //     validators: [[{ field: 'totalSaleGross', operator: '=', value: '0' }]],
  //   },
  // }, 'example'));



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

      <h2>Default draggable collection</h2>
      <Collection
        id="collection"
        label="Collection"
        value={[{ id: 1, title: 'foo' }]}
        draggable
      />

      <h2>Array collection UI items</h2>
      <Collection
        id="collectionArray"
        label="CollectionArray"
        value={['foo', 'bar']}
        UI={Input}
      />

      <h2>Custom draggable UI items</h2>
      <Collection
        label={(
          <div className="grid-2 pr-4">
            <div className="col pb-2">Mellékelt dokumentumok</div>
            <div className="col-1-2 text-gray">Megnevezés</div>
            <div className="col-1-2 text-gray">Webcím</div>
          </div>
        )}
        id="docs"
        value={[{ title: '', url: '' }]}
        UI={CustomCollectionItem}
        draggable
      />

      <h2>Custom UI items (GridSearch)</h2>
      <Collection
        id="collection2"
        value={[{ field: '1', operator: '=', value: '' }]}
        UI={CollectionItem}
        uiProps={{
          fields: [{ id: 1, title: 'foo' }, { id: 2, title: 'bar' }],
        }}
        draggable
      />

    <h2>Custom UI Nested items (GridSearch) Dragable parents and children</h2>
      <Collection
        id="collection3"
        value={[[{ field: '1', operator: '=', value: '' }]]}
        UI={NestedCollectionItem}
        uiProps={{
          fields: [
            { id: 1, title: 'foo' },
            { id: 2, title: 'bar' },
          ],
          draggable: true,
        }}
        draggable
        />


      <h2>Custom UI Nested items (GridSearch) Extra</h2>
      <Collection
        id="collection3"
        value={[[{ field: '1', operator: '=', value: '' }]]}
        UI={NestedCollectionItem}
        uiProps={{
          fields: [
            { id: 1, title: 'foo' },
            { id: 2, title: 'bar' },
            {
              id: '3',
              title: 'baz',
              field: (
                <Select
                  data={[
                    { id: 1, title: 'foo'},
                    { id: 2, title: 'bar'},
                    { id: 3, title: 'baz'},
                  ]}
                  dataTranslate={false}
                />
              ),
              operators: ['='],
            },
          ],
          operators: ['=', '!=', '>', '<'],
          draggable: true,
          dataTranslateFields: false,
          dataTranslateOperators: false,
        }}
        draggable
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


      <h2>Multiple keys Json collection</h2>
      <JsonCollection />


      <h2>Use Case #1</h2>
      <div className="h-center w-full pb-1" style={{ paddingRight: '5rem' }}>
        <div className="grow light text-s">id</div>
        <div className="w-6 mx-2 light text-s">status</div>
      </div>
      <Collection
        id="example1"
        UI={Example1}
        value={[{ id: 'AAA', status: true }]}
        draggable
      />
      



      <h2>Use Case #2</h2>

      <Connect 
        id="example2"
        listen="grid"
        UI={({ grid }) => (
          <Grid
            data={grid || example2GridValue}
            className="text-s mb-6"
            hook={{
              invoiceNumber: 'Invoice Number',
              priceGross: {
                title: 'Gross',
                format: ({ value }) => `${value} HUF`, 
              },
            }}
          />
        )}
      />

      <div className="mt-2 text-xs h-center w-full pb-1" style={{ paddingRight: '5rem' }}>
        <div className="col-1-6">Azonosító</div>
        <div className="col-1-6">Száma száma</div>
        <div className="col-1-6">Számla kelte</div>
        <div className="col-1-6">Fizetés ideje</div>
        <div className="col-1-6">Bruttó összeg</div>
        <div className="col-1-6 col-br">Fizetés módja</div>
      </div>
      <Collection
        form="example2"
        id="grid"
        UI={Example2}
        value={example2GridValue}
      />
      
    </Form>
  );
};

Example.contextTypes = {
  store: PropTypes.object,
};

export default Example;
