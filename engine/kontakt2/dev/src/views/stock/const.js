
import React from 'react';
import { FormattedNumber } from 'react-intl';

import * as Filters from '@1studio/ui/grid/filters';


/* !- Constants */

export const SETTINGS = {
  hook:
  {
    m:
    {
      title: 'Termék',
      width: '30%',
      align: 'left',
      format: ({ record }) =>
      (
        <div>
          <div>{record.m}</div>
          <div className="text-s text-gray light">{record.id}</div>
        </div>
      ),
    },
    k1:
    {
      title: <div className="text-left pl-4">RS2</div>,
      format: ({ record }) =>
      (
        <div className="pl-3 relative">
          {
            record.k2 > 0 && record.k1 < record.k2 &&
            <div className="circle bg-red w-1 h-1 absolute pin-l m-1/2 ml-1" />
          }
          <div>{record.k1} db</div>
          <div className="text-s text-gray light">{record.k2} db</div>
        </div>
      ),
      align: 'left',
    },
    k29:
    {
      title: <div className="text-left pl-4">RS6</div>,
      format: ({ record }) =>
      (
        <div className="pl-3 relative">
          {
            record.k29 > 0 && record.k29 < record.k6 &&
            <div className="circle bg-red w-1 h-1 absolute pin-l m-1/2 ml-1" />
          }
          <div>{record.k29} db</div>
          <div className="text-s text-gray light">{record.k6} db</div>
        </div>
      ),
      align: 'left',
    },
    k9:
    {
      title: <div className="text-left pl-4">RS8</div>,
      format: ({ record }) =>
      (
        <div className="pl-3 relative">
          {
            record.k9 > 0 && record.k9 < record.k7 &&
            <div className="circle bg-red w-1 h-1 absolute pin-l m-1/2 ml-1" />
          }
          <div>{record.k9} db</div>
          <div className="text-s text-gray light">{record.k8} db</div>
        </div>
      ),
      align: 'left',
    },
    k4:
    {
      title: 'Rendelés',
      format: ({ value }) => `${value} db`,
    },
    a1:
    {
      title: 'Eladási ár',
      format: ({ record }) =>
      (
        <div>
          <div><FormattedNumber value={record.a1} /> Ft</div>
          {
            record.a1 !== record.a0 &&
            <div className="text-s text-gray light"><FormattedNumber value={record.a0} /> Ft</div>
          }
        </div>
      ),
      width: '15%',
    },
    d:
    {
      title: 'Méret',
      width: '20%',
      format: ({ value }) => <span className="text-gray light">{value}</span>,
    },
  },
  paginate:
  {
    page: 1,
    limit: 50,
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
      handler: (record, term) => term.split(/[ ,]+/g).every(word =>
        !record.m
        || record.id.toString().toLowerCase().indexOf(word.toString().toLowerCase()) >= 0
        || record.m.toString().toLowerCase().indexOf(word.toString().toLowerCase()) >= 0,
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
      arguments: [],
      status: false,
    },
    /**
     * It shows those products, which have been price change since the selected filter date
     */
    {
      id: 'arvalt',
      handler: (record, term) => !term || record.av * 1000 > new Date(term).getTime(),
      arguments: [],
      status: false,
    },
    {
      id: 'minkesz',
      handler: ({ k1, k2, k29, k6, k9, k7 }, term) =>
        term === false || (k1 < k2 && k2 > 0) || (k29 < k6 && k6 > 0) || (k9 < k7 && k7 > 0),
      arguments: [],
      status: false,
    },
  ],
};
