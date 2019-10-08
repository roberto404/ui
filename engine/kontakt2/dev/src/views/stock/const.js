import React from 'react';
import { FormattedNumber } from 'react-intl';

import * as Filters from '@1studio/ui/grid/filters';
import formatThousand from '@1studio/utils/string/formatThousand';

/* !- Constants */

export const SETTINGS = {
  hook: {
    t: {
      title: 'Termék',
      width: '30%',
      align: 'left',
      format: ({ record }) => (
        <div>
          <div>{record.t}</div>
          <div className="text-s text-gray light">{record.id}</div>
        </div>
      ),
    },
    rs: {
      title: <div className="text-left pl-4">Összesen</div>,
      format: ({ record }) => (
        <div className="pl-3 relative">
          {parseInt(
            record.rs2 +
              record.rs21 +
              record.rs22 +
              record.rs6 +
              record.rs61 +
              record.rs62 +
              record.rs8 +
              record.rs81 +
              record.rs82,
          ) > 0 && <div className="circle bg-green w-1 h-1 absolute pin-l m-1/2 ml-1" />}
          <div className="heavy">{record.rs} db</div>
        </div>
      ),
      align: 'left',
    },
    rs2: {
      title: <div className="text-left pl-4">RS2</div>,
      format: ({ record }) => (
        <div className="pl-3 relative">
          {parseInt(record.rs2 + record.rs21 + record.rs22) > 0 && (
            <div className="circle bg-green w-1 h-1 absolute pin-l m-1/2 ml-1" />
          )}
          <div>{record.rs2} db</div>
        </div>
      ),
      align: 'left',
    },
    rs6: {
      title: <div className="text-left pl-4">RS6</div>,
      format: ({ record }) => (
        <div className="pl-3 relative">
          {parseInt(record.rs6 + record.rs61 + record.rs62) > 0 && (
            <div className="circle bg-green w-1 h-1 absolute pin-l m-1/2 ml-1" />
          )}
          <div>{record.rs6} db</div>
        </div>
      ),
      align: 'left',
    },
    rs8: {
      title: <div className="text-left pl-4">RS8</div>,
      format: ({ record }) => (
        <div className="pl-3 relative">
          {parseInt(record.rs8 + record.rs81 + record.rs82) > 0 && (
            <div className="circle bg-green w-1 h-1 absolute pin-l m-1/2 ml-1" />
          )}
          <div>{record.rs8} db</div>
        </div>
      ),
      align: 'left',
    },
    r: {
      title: 'Rendelés',
      format: ({ value }) => <div className="italic">{value} db</div>,
      align: 'left',
    },
    p1: {
      title: 'Eladási ár',
      format: ({ record }) => (
        <div>
          <div>{`${formatThousand(record.p1)} Ft`}</div>
          {record.p1 !== record.p0 && (
            <div className="text-s text-gray light">{`${formatThousand(record.p0)} Ft`}</div>
          )}
        </div>
      ),
      width: '15%',
    },
    d: {
      title: 'Méret',
      format: ({ value }) => (value ? `${value} cm` : ''),
    },
  },
  paginate: {
    page: 1,
    limit: 50,
  },
  // order:
  // {
  //   column: 'm',
  //   order: 'asc',
  // },
  filters: [
    {
      id: 'search',
      handler: (record, term) =>
        term.split(/[ ,]+/g).every(
          word =>
            !record.t ||
            record.id
              .toString()
              .toLowerCase()
              .indexOf(word.toString().toLowerCase()) >= 0 ||
            record.t
              .toString()
              .toLowerCase()
              .indexOf(word.toString().toLowerCase()) >= 0,
        ),
      arguments: [],
      status: false,
    },
  ],
};