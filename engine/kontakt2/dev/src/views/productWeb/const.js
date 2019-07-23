
import React from 'react';
import { FormattedNumber } from 'react-intl';
// import { getFields, getScheme, DEFAULT_FIELDS, DEFAULT_SCHEME } from '@1studio/ui/form/constants';

// import * as Filters from '@1studio/ui/grid/filters';

import { SEARCH_MULTIPLE_HANDLER } from '../../constants/filters';


/* !- Constants */


export const SETTINGS = {
  hook:
  {
    id:
    {
      title: 'Cikkszám',
      align: 'left',
    },
    brand:
    {
      title: 'Márka',
    },
    title:
    {
      title: 'Megnevezés',
      width: '15%',
    },
    // vat:
    // {
    //   title: 'vat',
    // },
    // price_sale_net:
    // {
    //   title: 'price_sale_net',
    // },
    // price_orig_gross:
    // {
    //   title: 'Lista ár',
    // },
    price_sale_gross:
    {
      title: 'Eladási ár',
      format: ({ record }) =>
      (
        <div>
          <div><FormattedNumber value={record.price_sale_gross} /> Ft</div>
          {
            record.price_discount &&
            <div className="text-s text-gray light"><FormattedNumber value={record.price_orig_gross} /> Ft</div>
          }
        </div>
      ),
      width: '10%',
    },
    price_discount:
    {
      title: 'Kedvez.',
      width: '5%',
    },
    manufacturer:
    {
      title: 'Gyártó',
      width: '5%',
    },
    colors:
    {
      title: 'Szövetek',
      width: '5%',
      format: ({ record }) =>
      (
        <span>{record.colors.items.length}</span>
      ),
    },
    // inoutlet:
    // {
    //   title: 'Leértékelt',
    //   width: '5%',
    // },
    category:
    {
      title: 'Kategória',
      width: '20%',
      align: 'left',
      format: ({ record }) =>
      (
        <ul className="m-0">
          {
            record.category.map(category => <li key={category} className="text-s light">{category}</li>)
          }
        </ul>
      ),
    },
    flag:
    {
      title: 'Címkék',
      width: '15%',
      align: 'left',
      format: ({ record }) =>
      (
        <ul className="m-0">
          {
            record.flag.map(flag => <li key={flag} className="text-s light">{flag}</li>)
          }
        </ul>
      ),
    },
    // dimension:
    // {
    //   title: 'dimension',
    // },
    // features:
    // {
    //   title: 'features',
    // },
    // description:
    // {
    //   title: 'description',
    // },
    images:
    {
      title: 'Kép',
      width: '5%',
    },
    // incart:
    // {
    //   title: 'Kosár',
    //   width: '5%',
    // },
    priority:
    {
      title: 'Prio',
      width: '5%',
    },
  },
  paginate:
  {
    page: 1,
    limit: 1000,
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
      handler: SEARCH_MULTIPLE_HANDLER(['id', 'brand', 'title']),
      arguments: [],
      status: false,
    },
    {
      id: 'category',
      handler: (record, terms) => record.category.indexOf(terms) !== -1,
      arguments: [],
      status: false,
    },
    {
      id: 'flag',
      handler: (record, terms) => record.flag.indexOf(terms) !== -1,
      arguments: [],
      status: false,
    },
    {
      id: 'images',
      handler: (record, terms) => parseInt(record.images) !== 1,
      arguments: [],
      status: false,
    },
    {
      id: 'inoutlet',
      handler: (record, terms) => parseInt(record.inoutlet) === 1,
      arguments: [],
      status: false,
    },
    {
      id: 'incart',
      handler: (record, terms) => parseInt(record.incart) !== 1,
      arguments: [],
      status: false,
    },
  ],
};
