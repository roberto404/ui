
import React from 'react';
import { FormattedNumber } from 'react-intl';
import isEmpty from 'lodash/isEmpty';
// import { getFields, getScheme, DEFAULT_FIELDS, DEFAULT_SCHEME } from '@1studio/ui/form/constants';
// import * as Filters from '@1studio/ui/grid/filters';


/* !- Components */

import IconViewCard from '@1studio/ui/icon/la/th-large';
import IconViewTable from '@1studio/ui/icon/la/th-list';
import IconViewList from '@1studio/ui/icon/la/columns';
import IconViewFilter from '@1studio/ui/icon/la/sliders';


/* !- Constants */

import { SEARCH_MULTIPLE_HANDLER } from '../../constants/filters';
import { EMPTY_FILTER } from './filter';

export const EDITABLE_FLAGS = ['SALE', 'MONEY_BACK_30', 'THM_0', 'RS_OFFER'];


// http://kontakt2.rs.hu/product_images/D8/D8MRIA1A40-01.jpg
export const IMAGE_URL = 'http://kontakt2.rs.hu/product_images/';


const filterHandler = field => (record, terms) =>
(
  !terms.length
  || (terms[0] === EMPTY_FILTER && isEmpty(record[field]))
  || terms.some(term => term === record[field])
);

let wrongRelatedIds = [];

/**
 * Collect wrong relatedIds
 * @return {array}        [relateId, ...]
 */
const wrongRelatedIdReducer = (result, { color }) =>
{
  if (result.indexOf(color) === -1)
  {
    result.push(color);
  }
  return result;
}

const filterError = ({ id, related_id, color, manufacturer, title, category, images, features }, terms, filters, model) =>
{
  switch (terms)
  {
    case 'images':
      return !images || isNaN(images);

    // true = error product
    case 'color':
      return (
        isEmpty(color)
        && Array.isArray(features) && features[1] === '2' // fenyő
        // && ['1', '8', 'D1', 'D8', 'F13', 'F25', /* 'F26', */ 'K15', 'K23', 'K25', 'K26', 'K27', 'K29', 'K34', 'K35', 'K36', 'K39', 'K41', 'K45', 'K49', 'K54', 'K55', 'K57', 'K60', 'K65', 'K80', 'NF1', 'NF2', 'NF3', 'NI', 'NK3', 'NK5', 'NK8', 'NK9'].indexOf(manufacturer) !== -1 // F26 natúr fenyő
        && !/.*\([a-zéáűőúüóóöí ]+\)$/.exec(title) // unique color (Ex. piros)
        && ['1'].indexOf(category) === -1 // category which hasn't color (Ex. matrac)
      );

    case 'related_id':
      {
        if (model.paginate.results[0] !== undefined && id === model.paginate.results[0].id)
        {
          /**
           * Wrong related Ids
           * @type {array} [relateId, ...]
           */
          wrongRelatedIds = model
            .getResultsGroupBy('related_id', undefined, records => records)
            .filter(({ title }) => title.length > 1 && title.reduce(wrongRelatedIdReducer, []).length !== title.length)
            .map(({ id }) => id);
        }

        return wrongRelatedIds.indexOf(related_id) !== -1;
      }
    default:
      return true;
  }
};


export const SETTINGS = {
  paginate:
  {
    page: 1,
    limit: 0,
  },
  // order:
  // {
  //   column: 'm',
  //   order: 'asc',
  // },
  filters:
  [
    {
      id: 'search',
      handler: SEARCH_MULTIPLE_HANDLER(['id', 'brand', 'title', 'title_orig']),
      arguments: [],
      status: false,
    },
    {
      id: 'category',
      handler: (record, terms) => record.category === terms,
      arguments: [],
      status: false,
    },
    {
      id: 'instore',
      handler: (record, terms) => parseInt(record.instore) === +terms,
      arguments: [true],
      status: true,
    },
    {
      id: 'filterCategory',
      handler: filterHandler('category'),
      arguments: [],
      status: false,
    },
    // {
    //   id: 'flag',
    //   handler: ({ flag }, terms) => flag && Array.isArray(flag) && flag.indexOf(terms) !== -1,
    //   arguments: [],
    //   status: false,
    // },
    {
      id: 'filterFlag',
      handler: ({ flag }, terms) =>
        !terms.length
        || (terms[0] === EMPTY_FILTER && isEmpty(flag))
        || (Array.isArray(flag) && terms.every(term => flag.indexOf(term) !== -1)),
      arguments: [],
      status: false,
    },
    {
      id: 'filterBrand',
      handler: filterHandler('brand'),
      arguments: [],
      status: false,
    },
    {
      id: 'filterColor',
      handler: filterHandler('color'),
      arguments: [],
      status: false,
    },
    {
      id: 'filterManufacturer',
      handler: filterHandler('manufacturer'),
      arguments: [],
      status: false,
    },
    {
      id: 'filterFeature',
      handler: ({ features }, terms) =>
        features
        && Object
          .keys(terms)
          .every(id =>
            terms[id].length === 0
            || (
              features[id]
              && (
                features[id] === terms[id]
                || terms[id].some(v =>
                  (
                    Array.isArray(features[id]) ?
                      features[id].indexOf(v) !== -1 : features[id].toString() === v),
                  )
              )
            ),
          ),
      arguments: [],
      status: false,
    },
    {
      id: 'error',
      handler: filterError,
      arguments: [],
      status: false,
    },
  ],
};

export const HOOK_LIST = {
  id:
  {
    title: 'Termék',
    width: '100%',
    align: 'left',
    format: ({ record }) =>
    (
      <div className="pl-1">
        <div className="ellipsis" style={{ height: '1.5em' }}>{record.brand} {record.title}</div>
        <div className="text-s text-gray light ellipsis" style={{ height: '1.5em' }}>{record.subtitle}</div>
        <div className="text-s text-gray light ellipsis" style={{ height: '1.5em' }}>{record.id}</div>
      </div>
    ),
  },
};


export const HOOK_TABLE = {
  id:
  {
    title: 'Cikkszám',
    width: '20%',
    align: 'left',
  },
  brand:
  {
    title: 'Termék',
    width: '30%',
    align: 'left',
    format: ({ record }) =>
    (
      <div className="pl-1">
        <div className="ellipsis">{record.brand} {record.title}</div>
        <div className="text-s text-gray light ellipsis" style={{ height: '1.5em' }}>{record.subtitle}</div>
      </div>
    ),
  },
  // related_id:
  // {
  //   title: 'related_id',
  //   width: '15%',
  //   align: 'left',
  // },
  title_orig:
  {
    title: 'DOS név',
    width: '30%',
    align: 'left',
    format: ({ record }) =>
    (
      <div className="text-s light text-gray ellipsis">{record.title_orig}</div>
    ),
  },
  // title_orig_rest:
  // {
  //   title: 'title_orig_rest',
  //   width: '20%',
  //   align: 'left',
  // },
  price_sale_gross:
  {
    title: 'Eladási ár',
    format: ({ record }) =>
    (
      <div>
        <div className="relative inline-block">
          <FormattedNumber value={record.price_sale_gross} /> Ft
          {
            parseInt(record.price_discount) !== 0 &&
            <div className="badge">-{record.price_discount}%</div>
          }
        </div>
        {
          parseInt(record.price_discount) !== 0 &&
          <div className="text-s text-gray light"><FormattedNumber value={record.price_orig_gross} /> Ft</div>
        }
      </div>
    ),
    width: '20%',
  },
  category:
  {
    title: 'Kategória',
    width: '15%',
    // align: 'left',
    format: ({ record, helper }) =>
    (
      <div className="text-s ellipsis">{helper.categories.find(({ id }) => id === record.category).title}</div>
    ),
  },
  flag:
  {
    title: 'Címkék',
    width: '15%',
    align: 'left',
    format: ({ record }) =>
    (
      <div className="text-s text-gray light ellipsis" style={{ height: '1.5em' }}>
        {record.flag && record.flag.join(', ')}
      </div>
    ),
  },
  color:
  {
    title: 'Szín',
    width: '5%',
    format: ({ record }) =>
    (
      <div className="text-s light text-gray ellipsis">{record.color}</div>
    ),
  },
  // priority:
  // {
  //   title: 'Prioritás',
  //   width: '5%',
  // },
};


export const SETTINGS_VIEW = {
  groups: {
    0: [
      { id: 'list', title: 'Lista', status: 1, icon: IconViewList },
      { id: 'table', title: 'Táblázat', status: 0, icon: IconViewTable },
      { id: 'card', title: 'Kártya', status: 0, icon: IconViewCard },
      // { id: 'groupby', title: 'Csoportos', status: 0, icon: IconViewList },
      { id: 'filter', title: 'Szűrő', status: 1, icon: IconViewFilter },
    ],
  },
};



/* !- FORM */

// id, -> DOS
// brand, -> DOS
// title, -> DOS
// vat, -> DOS
// price_orig, -> DOS
// price_orig_gross, -> DOS
// price_sale, -> DOS
// price_sale_gross, -> DOS
// price_discount, -> DOS
// manufacturer, -> DOS
// category,
// features,
// dimension -> DOS,
// images,
// instore,
// incart,
// description


export const FIELDS = {
  id: {
    id: 'id',
    label: 'product.field.sku',
    disabled: true,
  },
  relatedId: {
    id: 'related_id',
    label: 'product.field.relatedId',
  },
  flag: {
    id: 'flag',
    label: 'field.flag',
  },
  brand: {
    id: 'brand',
    label: 'product.field.brand',
    disabled: true,
  },
  title: {
    id: 'title',
    label: 'field.title',
    disabled: true,
  },
  vat: {
    id: 'vat',
    label: 'field.vat',
    disabled: true,
  },
  price_orig: {
    id: 'price_orig',
    label: 'product.field.price_orig',
    disabled: true,
  },
  price_orig_gross: {
    id: 'price_orig_gross',
    label: 'product.field.price_orig_gross',
    disabled: true,
  },
  price_sale: {
    id: 'price_sale',
    label: 'product.field.price_sale',
    disabled: true,
  },
  price_sale_gross: {
    id: 'price_sale_gross',
    label: 'product.field.price_sale_gross',
    disabled: true,
  },
  price_discount: {
    id: 'price_discount',
    label: 'product.field.price_discount',
    disabled: true,
  },
  price_installation: {
    id: 'price_installation',
    label: 'product.field.price_installation',
    // postfix: 'Ft / %',
    onBlur: (e) => console.log(e),
    stateFormat: (value) =>
    {
      const installationRegex = /^([0-9]+) *(Ft|%)/;
      const matches = value.match(installationRegex);

      if (matches)
      {
        return matches[1];
      }

      return value;
    },
  },
  category: {
    id: 'category',
    label: 'field.category',
    placeholder: 'placeholder.select',
    dataTranslate: false,
  },
  // features: {
  //   id: 'features',
  //   label: 'product.field.features',
  // },
  instore: {
    id: 'instore',
    label: 'product.field.instore',
  },
  incart: {
    id: 'incart',
    label: 'product.field.incart',
  },
  description: {
    id: 'description',
    label: 'field.description',
    mandatory: true,
  },
  priority: {
    id: 'priority',
    label: 'field.priority',
  },
};

export const SCHEME = {
  // categories: DEFAULT_SCHEME.pid,
  // brands: DEFAULT_SCHEME.title,
};
