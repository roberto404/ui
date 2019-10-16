import React from 'react';
import moment from 'moment';

/* !- React Elements */

import { GridColumnStore, GridColumnStar } from './gridRow';
import * as Filters from '@1studio/ui/grid/filters';

/* !- Constants */

import { DATE_FORMAT_HTML5 } from '@1studio/ui/calendar/constants';
import { SEARCH_MULTIPLE_HANDLER } from '../../constants/filters';

export const UNIT = {
  q: 'db',
  p: 'Ft',
  p2: 'Ft',
};

export const SIMPLIFY_ROOT = 1000;
export const SIMPLIFY_UNITS = ['', 'e', 'm', 'mrd'];
export const SIMPLIFY_FORMAT = ({ value, unit }) => Math.round(value * 100) / 100 + unit;

export const DATE_FORMAT = 'YYYY-MM';

export const HISTORY_MONTHS = 24;

export const SETTINGS = {
  paginate: {
    page: 1,
    limit: 0,
  },
  filters: [
    {
      id: 'search',
      handler: (record, value, filters, model, index) =>
        value[0] === '?'
          ? Filters.search({
            record,
            value: value.substring(1),
            helpers: {},
            hooks: {},
              // hooks: HOOK_TABLE,
            index,
          })
          : SEARCH_MULTIPLE_HANDLER(['pi', 'b', 't'])(record, value),
      arguments: [],
      status: false,
    },
    {
      id: 'date',
      handler: (record, terms) => record.d.indexOf(terms) === 0,
      arguments: [],
      status: false,
      // arguments: [moment().format(DATE_FORMAT)],
      // status: true,
    },
    {
      id: 'start',
      handler: (record, terms) => moment(record.d) >= moment(terms),
      arguments: [moment().startOf('month').format(DATE_FORMAT_HTML5)],
      status: true,
    },
    {
      id: 'end',
      handler: (record, terms) => moment(record.d) <= moment(terms),
      arguments: [],
      status: false,
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
  title: {
    title: 'Megnevezés',
    format: ({ record }) => (
      <div>
        <div>{record.title}</div>
        <div className="text-s text-gray light">{record.subtitle}</div>
      </div>
    ),
    align: 'left',
    width: 'calc(100% - 80rem)',
  },
  traffic: {
    title: 'Forgalom',
    format: ({ record }) => <GridColumnStore {...record} observe="traffic" />,
    align: 'right',
    width: '15rem',
  },
  rs2: {
    title: 'RS2',
    format: ({ record }) => <GridColumnStore {...record} observe="rs2" />,
    align: 'right',
    width: '15rem',
  },
  rs6: {
    title: 'RS6',
    format: ({ record }) => <GridColumnStore {...record} observe="rs6" />,
    align: 'right',
    width: '15rem',
  },
  rs8: {
    title: 'RS8',
    format: ({ record }) => <GridColumnStore {...record} observe="rs8" />,
    align: 'right',
    width: '15rem',
  },
  rate: {
    title: 'Elemzés',
    format: ({ record }) => <GridColumnStar {...record} />,
    width: '20rem',
  },
};

export const GRID_LAYER_HOOK = {
  a: {
    id: 'a',
    title: 'számla',
    align: 'left',
    width: '40%',
  },
  b: {
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
  d: {
    title: 'dátum',
    width: '10em',
  },
  s: 'RS',
  // m: 'manufacturer',
  // l: 'location'
  // sm: 'method'
  // sp: 'salesperson'
};
