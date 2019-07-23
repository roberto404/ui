
import React from 'react';
import { FormattedNumber } from 'react-intl';

import * as Filters from '@1studio/ui/grid/filters';


/* !- Constants */

export const SETTINGS = {
  hook:
  {
    id:
    {
      title: 'Cikkszám',
      width: '20%',
      align: 'left',
    },
    m:
    {
      title: 'Termék neve',
      width: '50%',
      align: 'left',
    },
    a1:
    {
      title: 'Eladási ár',
      format: ({ value }) => <span><FormattedNumber value={value} /> Ft</span>,
      width: '15%',
    },
    a0:
    {
      title: 'Lista ár',
      format: ({ value }) => <span><FormattedNumber value={value} /> Ft</span>,
      width: '15%',
    },
  },
  paginate:
  {
    page: 1,
    limit: 20,
  },
  // order:
  // {
  //   column: 'id',
  //   order: 'asc',
  // },
  filters:
  [
    {
      id: 'search',
      handler: (record, term) => Object.keys(record).some(index => record[index]
        .toString()
        .toLowerCase()
        .indexOf(term.toString().toLowerCase()) >= 0,
      ),
      arguments: [],
      status: false,
    },
    /**
     * K1 = RS2, K4 = Ordered products
     */
    {
      id: 'instock',
      handler: (record, term) => term === false || (record.k1 > 0 || record.k4 > 0),
      arguments: [true],
      status: false,
    },
    /**
     * It shows those products, which have been price change since the selected filter date
     */
    {
      id: 'arvalt',
      handler: (record, term) => !term || record.av * 1000 >= new Date(term).getTime(),
      arguments: ['2018-11-10T00:00'],
      status: false,
    },
  ],
};
