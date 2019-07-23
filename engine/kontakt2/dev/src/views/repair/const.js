
import React from 'react';
import { FormattedNumber } from 'react-intl';
import levenshtein from 'fast-levenshtein';

/* !- Constants */

import { getFields, getScheme, DEFAULT_FIELDS, DEFAULT_SCHEME } from '@1studio/ui/form/constants';
import { SEARCH_MULTIPLE_HANDLER } from '../../constants/filters';


/* !- GRID */

export const SETTINGS = {
  hook:
  {
    id:
    {
      title: 'Cikkszám',
      width: '20%',
      align: 'left',
    },
    megnevezes:
    {
      title: 'Termék neve',
      width: '50%',
      align: 'left',
    },
    akcar_float:
    {
      title: 'Eladási ár',
      format: ({ value }) => <span><FormattedNumber value={Math.round(parseFloat(value) * 1.27)} /> Ft</span>,
      width: '15%',
    },
    // eladar:
    // {
    //   title: 'Lista ár',
    //   format: ({ value }) => <span><FormattedNumber value={value} /> Ft</span>,
    //   width: '15%',
    // },
  },
  paginate:
  {
    page: 1,
    limit: 0,
  },
  order:
  {
    column: 'megnevezes',
    order: 'asc',
  },
  filters:
  [
    // TODO: feldolgozásig ezt ki kell venni
    // {
    //   id: 'search',
    //   handler: SEARCH_MULTIPLE_HANDLER(['id', 'megnevezes']),
    //   arguments: [],
    //   status: false,
    // },
    {
      id: 'search',
      handler: (record, terms) =>
        terms
          .split(/[,]+/g)
          .some(term =>
            ['id', 'megnevezes'].some(field =>
              typeof record[field] !== undefined
              && (
                record[field].toString().toLowerCase().indexOf(term.toString().toLowerCase()) >= 0
                || levenshtein.get(record[field].toString().toLowerCase(), term.toString().toLowerCase()) < 2
              ),
            ),
          ),
      arguments: [],
      status: false,
    },
    /**
     * K1 = RS2, K4 = Ordered products
     */
    // {
    //   id: 'instock',
    //   handler: (record, term) => term === false || (record.k1 > 0 || record.k4 > 0),
    //   arguments: [true],
    //   status: false,
    // },
    /**
     * It shows those products, which have been price change since the selected filter date
     */
    // {
    //   id: 'arvalt',
    //   handler: (record, term) => !term || record.av * 1000 >= new Date(term).getTime(),
    //   arguments: ['2018-11-10T00:00'],
    //   status: false,
    // },
  ],
};


/* !- FORM */

export const FIELDS = {
  categories: {
    id: 'categories',
    label: 'field.category',
    placeholder: 'placeholder.select',
    dataTranslate: false,
  },
};

export const SCHEME = {
  categories: DEFAULT_SCHEME.pid,
};
