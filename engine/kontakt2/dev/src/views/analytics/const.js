
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
  hook:
  {
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
  },
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
    // {
    //   id: 'dateCompare',
    //   handler: (record, terms) => record.d.indexOf(terms) === 0,
    //   arguments: ['2019-04'],
    //   status: true,
    // },
    // {
    //   id: 'manufacturer',
    //   handler: (record, terms) => record.m === terms,
    //   arguments: ['K57'],
    //   status: true,
    // },
  ],
};
