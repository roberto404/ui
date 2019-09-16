
import React from 'react';


/* !- React Elements */

import { GridColumnStore, GridColumnStar } from './gridRow';


/* !- Constants */

export const UNIT = {
  q: 'db',
  p: 'Ft',
};

export const SIMPLIFY_ROOT = 1000;
export const SIMPLIFY_UNITS = ['', 'e', 'm', 'mrd'];
export const SIMPLIFY_FORMAT = ({ value, unit }) => Math.round(value) + unit;

export const SETTINGS = {
  paginate:
  {
    page: 1,
    limit: 0,
  },
  filters:
  [
    {
      id: 'search',
      handler: (record, term) => term.split(/[ ,]+/g).every(word =>
        record.pi.toString().toLowerCase().indexOf(word.toString().toLowerCase()) >= 0
        || record.b.toString().toLowerCase().indexOf(word.toString().toLowerCase()) >= 0
        || record.t.toString().toLowerCase().indexOf(word.toString().toLowerCase()) >= 0
      ),
      arguments: ['Marcus íróa.'],
      status: true,
    },
    {
      id: 'date',
      handler: (record, terms) => record.d.indexOf(terms) === 0,
      // arguments: [],
      // status: false,
      arguments: ['2019-05'],
      status: true,
    },
    {
      id: 'method',
      handler: (record, terms) => record.sm === terms,
      arguments: [],
      status: false,
    },
  ],
};


export const GRID_HOOK = {
  title:
  {
    title: 'Megnevezés',
    format: ({ record }) =>
    (
      <div>
        <div>{record.title}</div>
        <div className="text-s text-gray light">{record.subtitle}</div>
      </div>
    ),
    align: 'left',
    width: 'calc(100% - 80rem)',
  },
  traffic:
  {
    title: 'Forgalom',
    format: ({ record }) => <GridColumnStore {...record} observe="traffic" />,
    align: 'left',
    width: '15rem',
  },
  rs2:
  {
    title: 'RS2',
    format: ({ record }) => <GridColumnStore {...record} observe="rs2" />,
    align: 'left',
    width: '15rem',
  },
  rs6:
  {
    title: 'RS6',
    format: ({ record }) => <GridColumnStore {...record} observe="rs6" />,
    align: 'left',
    width: '15rem',
  },
  rs8:
  {
    title: 'RS8',
    format: ({ record }) => <GridColumnStore {...record} observe="rs8" />,
    align: 'left',
    width: '15rem',
  },
  rate:
  {
    title: 'Elemzés',
    format: ({ record }) => <GridColumnStar {...record} />,
    width: '20rem',
  },
};


export const GRID_LAYER_HOOK = {
  id: 'ID',
  b:
  {
    id: 'b',
    title: 'megnevezés',
    format: ({ record }) => (
      <div>
        <div>{`${record.b} ${record.t}`}</div>
        <div className="text-s text-gray">{record.pi}</div>
      </div>
    ),
    align: 'left',
    width: '40%',
  },
  q: 'db',
  p: 'össz.nettó',
  // pi: 'SKU',
  d:
  {
    title: 'dátum',
    width: '10em',
  },
  s: 'RS',
  // m: 'manufacturer',
  // l: 'location'
  // sm: 'method'
  // sp: 'salesperson'
}
