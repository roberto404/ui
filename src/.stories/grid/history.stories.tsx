import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import moment from 'moment';

require('../../../assets/style/index.scss');


/* !- Components */

import { Grid as GridView } from '../../view/grid';
import Connect from '../../grid/connect';
import NestedList from '../../grid/components/nestedList';
import History from '../../grid/components/nestedItems/history';
import HistoryList from '../../grid/components/nestedItems/historyList';
import { setHistoryCategories } from '../../grid/components/nestedItems/historyCategories';

import IconComment from '../../icon/la/comment';
import IconCreditCard from '../../icon/mui/credit_card';
import IconInventory from '../../icon/mui/inventory_2';
import IconReceipt from '../../icon/mui/business/receipt_long';
import IconDescription from '../../icon/mui/action/description';
import IconMore from '../../icon/mui/navigation/more_horiz';
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


/* !- Categories (globálisan, egyszer az alkalmazásban) */

setHistoryCategories({
  message: { title: 'Üzenet', filterTitle: 'Üzenetek', icon: IconComment, color: '#3456d1' },
  payment: { title: 'Fizetés', icon: IconCreditCard, color: '#3d8b52' },
  stock: { title: 'Áruforgalom', icon: IconInventory, color: '#a8641a' },
  billing: { title: 'Számlázás', icon: IconReceipt, color: '#7b4fd6' },
  other: { title: 'Egyéb', icon: IconDescription, filterIcon: IconMore, color: '#4a5260' },
});


/* !- Demo data (rendelés napló) */

const YEAR = moment().year();

const CATEGORY_DATA = [
  { id: 1, category: 'billing', title: 'Előlegszámla kiállítva', userName: 'Mészáros Csaba', insertDateTime: `${YEAR}-11-16 10:24:00`, tag: [{ title: 'T-2026-10888', className: 'border bg-white-light border-yellow text-yellow' }] },
  { id: 2, category: 'payment', title: 'Előlegbekérő elküldve', userName: 'Mészáros Csaba', insertDateTime: `${YEAR}-11-16 10:20:00`, message: '38% előleg · átutalás' },
  { id: 3, category: 'message', title: 'Üzenet', userName: 'Gál Szabolcs', insertDateTime: `${YEAR}-11-15 17:54:00`, message: 'A vevő utalással fizette az előleget, de nem látjuk. Amennyiben megtörtént a fizetés engedélyezhető.' },
  { id: 4, category: 'stock', title: 'Gyártói rendelés előkészítés', userName: 'Mészáros Csaba', insertDateTime: `${YEAR}-11-15 17:00:00`, tag: [{ title: '110-8 -3975', className: 'border bg-white-light border-yellow text-yellow' }] },
  { id: 5, category: 'stock', title: 'Vásárlás', userName: 'Mészáros Csaba', insertDateTime: `${YEAR}-11-15 17:00:00` },
  { id: 6, category: 'other', title: 'Megrendelőlap', userName: 'Mészáros Csaba', insertDateTime: `${YEAR}-11-15 17:00:00` },
  { id: 7, title: 'Árajánlat', userName: 'Mészáros Csaba', insertDateTime: `${YEAR}-11-15 17:00:00`, message: 'Munkaszám: 264' },
  { id: 8, category: 'payment', title: 'Bankkártyás fizetés', insertDateTime: `${YEAR}-11-12 15:37:00`, tag: [{ title: 'Levont', className: 'green' }], message: 'Tranzakció azon.: 2.3.18285|f0ede42f8310 Összeg: 108890 Ft' },
  { id: 9, category: 'message', title: 'Üzenet', userName: 'Kovács Anna', insertDateTime: `${YEAR}-11-12 09:10:00`, message: 'A vevő telefonon kérte a szállítás egyeztetését.' },
  {
    id: 10,
    category: 'stock',
    crud: 'U',
    model: 'OrdersProducts',
    userName: 'Kovács Anna',
    insertDateTime: `${YEAR}-11-10 14:05:00`,
    changes: [{ field: 'quantity', title: 'Mennyiség', entries: [{ type: 'changed', from: '1', to: '2' }] }],
  },
  { id: 11, category: 'billing', title: 'Díjbekérő', userName: 'Mészáros Csaba', insertDateTime: `${YEAR}-11-10 11:30:00`, tag: [{ title: 'D-2026-0412', className: 'border bg-white-light border-yellow text-yellow' }] },
];

/**
 * Tavalyi és régebbi bejegyzések: a napcím YYYY-MM-DD
 */
const CATEGORY_DATA_YEARS = [
  { ...CATEGORY_DATA[1], id: 21, insertDateTime: `${YEAR}-02-03 10:20:00` },
  { ...CATEGORY_DATA[2], id: 22, insertDateTime: `${YEAR - 1}-12-18 17:54:00` },
  { ...CATEGORY_DATA[7], id: 23, insertDateTime: `${YEAR - 1}-06-02 15:37:00` },
  { ...CATEGORY_DATA[0], id: 24, insertDateTime: `${YEAR - 2}-11-16 10:24:00` },
];


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


/* !- Kategóriás változat (HistoryList: ugyanaz a History elem, kategória ikonnal/színnel) */

const withPanel = (Story: any) => (
  <div className="p-3">
    <div className="p-3 bg-white-dark rounded-l" style={{ maxWidth: 460 }}>
      <Story />
    </div>
  </div>
);

type ListStory = StoryObj<typeof HistoryList>;

const listStory = (name: string, args: Record<string, any>): ListStory => ({
  name,
  render: (storyArgs: any) => <HistoryList {...storyArgs} />,
  decorators: [withPanel],
  args: { data: CATEGORY_DATA, defaultCategory: 'other', ...args },
});

/* Kategóriák (ikon, szín, név · felhasználó, szürke idővonal) */
export const Categories = listStory('Kategóriák', { title: 'Napló' });

/* Szűrő (Szűrő gomb → kategória chipek, több is választható) */
export const CategoryFilter = listStory('Kategória szűrő', { title: 'Napló', filterable: true });

/* Cím nélkül */
export const CategoryWithoutTitle = listStory('Kategóriák cím nélkül', {});

/* Dátum: idei év „nov. 16.”, korábbi év „2025-12-18” */
export const CategoryYears = listStory('Dátum: korábbi évek', { title: 'Napló', data: CATEGORY_DATA_YEARS });

/* Egyedi dátumformátum (moment format vagy függvény) */
export const CategoryDateFormat = listStory('Egyedi dátumformátum', {
  title: 'Napló',
  data: CATEGORY_DATA_YEARS,
  dateFormat: (date: moment.Moment) => date.format('YYYY. MM. DD. (ddd)'),
});

/* Gridből (Connect) + kattintás */
export const CategoryFromGrid: ListStory = {
  name: 'Kategóriák gridből (Connect) + kattintás',
  decorators: [withPanel],
  render: (args: any) => (
    <GridView
      id="story-history-list-grid"
      api={() => Promise.resolve({ status: 'SUCCESS', records: CATEGORY_DATA })}
      settings={{ paginate: { limit: 0 } }}
      preloader={false}
      className=""
    >
      <Connect>
        <HistoryList
          {...args}
          onClick={(item: any) => reduxStore.dispatch(dialog(
            <div className="p-3">
              <h2>{item.title || `#${item.id}`}</h2>
              <pre className="text-xs">{JSON.stringify(item, null, 2)}</pre>
            </div>,
          ) as any)}
        />
      </Connect>
    </GridView>
  ),
  args: { title: 'Napló', filterable: true, defaultCategory: 'other' },
};
