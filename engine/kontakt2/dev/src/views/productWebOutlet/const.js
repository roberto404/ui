
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
    title:
    {
      title: 'Megnevezés',
      width: '15%',
    },
    vat:
    {
      title: 'vat',
    },
    // price_sale_net:
    // {
    //   title: 'Akciós nettó',
    // },
    // price_orig_gross:
    // {
    //   title: 'Eladási ár',
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
    category:
    {
      title: 'Kategória',
      width: '20%',
      align: 'left',
    },
    // dimension:
    // {
    //   title: 'dimension',
    // },
    // features:
    // {
    //   title: 'features',
    // },
    description:
    {
      title: 'description',
    },
    images:
    {
      title: 'Kép',
      width: '5%',
    },
    incart:
    {
      title: 'Kosár',
      width: '5%',
    },
  },
  paginate:
  {
    page: 1,
    limit: 150,
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
      handler: SEARCH_MULTIPLE_HANDLER(['id', 'title']),
      arguments: [],
      status: false,
    },
  ],
};
