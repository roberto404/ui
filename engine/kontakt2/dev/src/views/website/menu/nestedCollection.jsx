
import React from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';

/* !- Redux Actions */

// ...

/* !- React Elements */

import
{
  Checkbox,
  Input,
  Select,
  Collection,
}
from '@1studio/ui/form/pure/intl';

import { CollectionItem } from '@1studio/ui/grid/pure/gridSearch';



/**
 * [NestedCollectionItem description]
 */
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
        data={[{ id: 'ProductGrid', title: 'Termékek' }, { id: 'Gallery', title: 'Galéria' }]}
        dataTranslate={false}
        value={record.modul}
      />
      <div className="label">Settings</div>

      { record.modul === 'ProductGrid' &&
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
            { id: 'order', title: 'Rendező' },
            { id: 'filter', title: 'Szűrő' },
          ]}
        />

        <div className="label">Termék kereső</div>
        <Collection
          id={`${id}-${index}`}
          UI={CollectionItem}
          uiProps={{
            fields: [
              { id: 'id', title: 'Sku' },
              // { id: 'flag', title: 'Címke' }, // select
              { id: 'brand', title: 'Márka' },
              { id: 'title', title: 'Megnevezés' },
              { id: 'price_sale_gross', title: 'Ár' },
              { id: 'price_discount', title: 'Kevezmény' },
              { id: 'manufacturer', title: 'Gyártó' }, // select
              { id: 'category', title: 'Kategória' }, // select
              // { id: 'features', title: 'Jellemző' }, // ???
              // { id: 'dimension', title: 'Méret?' }, // ???
              // { id: 'priority', title: 'Prioritás' }, // ???
            ],
          }}
          value={record.props.filters && record.props.filters.length ? record.props.filters : [{ field: 'id', operator: '=', value: '' }]}
          onChange={onChangePropsFiltersHandler}
          className="border shadow-outer-3 p-2 rounded bg-gray-light"
        />
      </div>
      }

    </div>
  );
};

export default NestedCollectionItem;
