import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import moment from 'moment';

require('../../../assets/style/index.scss');


/* !- Components */

import { Grid as GridView } from '../../view/grid';
import Connect from '../../grid/connect';
import NestedList from '../../grid/components/nestedList';
import History from '../../grid/components/nestedItems/history';
import { dialog } from '../../layer/actions';


/* !- Context */

import withGridContext, { reduxStore } from './withGridContext';


/* !- Constants */

import { DATETIME_FORMAT } from '../../calendar/constants';
import { DATA_LOG } from '../../.examples/grid/constants';

/**
 * Napló: a nap a csoport (level 0), azon belül a bejegyzések időrendben
 */
const SETTINGS = {
  paginate: { limit: 0 },
  order: { column: 'insertDateTime', direction: 'desc' },
};

const responseParser = ({ records }: any) => records.map((record: any) => ({
  ...record,
  insertDay: moment(record.insertDateTime, DATETIME_FORMAT).format('YYYY. MM. DD.'),
}));

const fakeApi = (records: any[]) => () => Promise.resolve({ status: 'SUCCESS', records });

/**
 * Kiszámolt változások (`changes`): a hívó az előző pillanatképből állítja elő,
 * cím nélkül automatikus („Létrehozás”, „<Mező> módosítás”, „Módosítás”, „Törlés”)
 */
const DATA_CHANGES = [
  {
    id: 1,
    crud: 'C',
    model: 'Products',
    userId: 1,
    userName: 'Kovács Anna',
    insertDateTime: '2026-11-16 09:12:00',
    message: 'Új termék: Sonoma étkezőasztal',
  },
  {
    id: 2,
    crud: 'U',
    model: 'Products',
    userId: 1,
    userName: 'Kovács Anna',
    insertDateTime: '2026-11-16 10:40:00',
    changes: [
      { field: 'priceSaleGross', title: 'Bruttó ár', entries: [{ type: 'changed', from: '126 990 Ft', to: '119 990 Ft' }] },
    ],
  },
  {
    id: 3,
    crud: 'U',
    model: 'Products',
    userId: 2,
    userName: 'Nagy Péter',
    insertDateTime: '2026-11-17 14:05:00',
    changes: [
      {
        field: 'dimension',
        title: 'Méret',
        entries: [
          { type: 'changed', label: 'Szélesség', from: '160', to: '180' },
          { type: 'changed', label: 'Mélység', from: '90', to: '100' },
        ],
      },
      {
        field: 'flag',
        title: 'Jelölők',
        entries: [
          { type: 'added', label: 'Akció' },
          { type: 'removed', label: 'Újdonság' },
        ],
      },
      {
        field: 'color',
        title: 'Szín',
        entries: [{ type: 'set', label: 'Sonoma tölgy' }],
      },
    ],
  },
  {
    id: 4,
    crud: 'U',
    model: 'Products',
    userId: 2,
    userName: 'Nagy Péter',
    insertDateTime: '2026-11-17 14:06:00',
    recordFields: ['status'],
    changes: [],
    message: 'Újramentve, érdemi változás nélkül',
  },
  {
    id: 5,
    crud: 'U',
    model: 'Products',
    userId: 1,
    userName: 'Kovács Anna',
    insertDateTime: '2026-11-18 08:30:00',
    title: 'Készletre vétel',
    tag: [{ title: 'RS6', className: 'green' }],
    message: '3 db beérkezett',
  },
  {
    id: 6,
    crud: 'D',
    model: 'Products',
    userId: 1,
    userName: 'Kovács Anna',
    insertDateTime: '2026-11-18 11:15:00',
    message: 'Kifutott termék',
  },
];

/**
 * Napló nézet (a K2 rendelés / termék napló mintája)
 */
const HistoryView = ({ id, records, onClick }: { id: string, records: any[], onClick?: (item: any) => void }) => (
  <GridView
    id={id}
    api={fakeApi(records)}
    settings={SETTINGS}
    responseParser={responseParser}
    preloader={false}
    className="p-3"
    style={{ maxWidth: 560 }}
  >
    <Connect>
      <NestedList
        groupBy={['insertDay']}
        UI={History}
        UiProps={{ onClick }}
      />
    </Connect>
  </GridView>
);


/* !- Stories */

const meta = {
  title: 'Grid/History',
  component: HistoryView,
  decorators: [withGridContext],
  parameters: {
    messages: {
      'order.product.status.6': 'Megrendelve',
      'order.product.status.0': 'Új',
      'order.product.status.-1': 'Törölve',
      'products.field.priceSaleGross': 'Bruttó ár',
    },
  },
} satisfies Meta<typeof HistoryView>;

export default meta;

type Story = StoryObj<typeof meta>;


/* !- Rendelés napló (logolt mezők, tagek, intl címek) */

export const Log: Story = {
  args: {
    id: 'story-history-log',
    records: DATA_LOG,
  },
};

Log.storyName = 'Napló (log)';


/* !- Kiszámolt változások (HistoryChanges) */

export const Changes: Story = {
  args: {
    id: 'story-history-changes',
    records: DATA_CHANGES,
  },
};

Changes.storyName = 'Változások (changes)';


/* !- Kattintható bejegyzés */

export const Clickable: Story = {
  args: {
    id: 'story-history-click',
    records: DATA_CHANGES,
    onClick: (item: any) => reduxStore.dispatch(dialog(
      <div className="p-3">
        <h2>{item.title || `#${item.id}`}</h2>
        <pre className="text-xs">{JSON.stringify(item, null, 2)}</pre>
      </div>,
    ) as any),
  },
};

Clickable.storyName = 'Kattintható';
