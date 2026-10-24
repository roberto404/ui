import React, { useCallback } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { useSelector } from 'react-redux';

require('../../../assets/style/index.scss');


/* !- Components */

import Grid from '../../grid/components/grid';
import Input from '../../form/components/input';


/* !- Context (a kijelölés + nyitott ágak a redux formban, a nyilak az App shortcutjain) */

import withGridContext from './withGridContext';
import { FORM_PREFIX, EXPANDED_POSTFIX } from '../../grid/constants';

/**
 * A grid store-beli állapota a grid alatt
 */
const StoreValue = ({ id }: { id: string }) => {
  const selected = useSelector(({ form }: any) => form[FORM_PREFIX + id]);
  const expanded = useSelector(({ form }: any) => form[FORM_PREFIX + id + EXPANDED_POSTFIX]);

  return (
    <pre className="mt-2 p-1 text-xs bg-white-dark rounded">
      {`form['${FORM_PREFIX}${id}'] = ${JSON.stringify(selected)}\n`}
      {`form['${FORM_PREFIX}${id}${EXPANDED_POSTFIX}'] = ${JSON.stringify(expanded)}`}
    </pre>
  );
};

const withLayout = (Story: any, { args }: any) => (
  <div className="p-3" style={{ maxWidth: 720 }}>
    <p className="text-s text-gray mb-2">
      Kattints a gridbe, majd ↑ ↓ lépked, → kinyit / első gyerekre lép, ← becsuk / szülőre lép.
    </p>
    <Story />
    <StoreValue id={args.id} />
  </div>
);


/* !- Demo data (id / pid, a testvérek sorrendje = a tömb sorrendje) */

const DATA = [
  { id: 1, title: 'Nappali', products: 412, status: 'aktív' },
  { id: 2, pid: 1, title: 'Kanapék', products: 186, status: 'aktív' },
  { id: 3, pid: 2, title: 'Sarokkanapék', products: 94, status: 'aktív' },
  { id: 4, pid: 2, title: 'Kinyitható kanapék', products: 61, status: 'aktív' },
  { id: 5, pid: 2, title: 'Kétszemélyes kanapék', products: 31, status: 'rejtett' },
  { id: 6, pid: 1, title: 'Fotelek', products: 88, status: 'aktív' },
  { id: 7, pid: 6, title: 'Relax fotelek', products: 23, status: 'aktív' },
  { id: 8, pid: 1, title: 'Dohányzóasztalok', products: 138, status: 'aktív' },
  { id: 9, title: 'Hálószoba', products: 265, status: 'aktív' },
  { id: 10, pid: 9, title: 'Ágyak', products: 121, status: 'aktív' },
  { id: 11, pid: 10, title: 'Boxspring ágyak', products: 47, status: 'aktív' },
  { id: 12, pid: 11, title: 'Elektromos boxspring', products: 9, status: 'rejtett' },
  { id: 13, pid: 9, title: 'Gardróbszekrények', products: 144, status: 'aktív' },
  { id: 14, title: 'Étkező', products: 98, status: 'aktív' },
  { id: 15, pid: 14, title: 'Étkezőasztalok', products: 52, status: 'aktív' },
  { id: 16, pid: 14, title: 'Székek', products: 46, status: 'aktív' },
  { id: 17, title: 'Kiegészítők', products: 0, status: 'rejtett' },
];

const HOOK = {
  title: { title: 'Kategória', width: '50%' },
  products: { title: 'Termékek', align: 'right' },
  status: 'Státusz',
};


/* !- Stories */

const meta = {
  title: 'Grid/Tree',
  component: Grid,
  decorators: [withLayout, withGridContext],
  args: {
    data: DATA,
    hook: HOOK,
    selectable: true,
    multipleSelect: false,
    className: 'card grid column',
  },
} satisfies Meta<typeof Grid>;

export default meta;

type Story = StoryObj<typeof meta>;


/* !- Csukott fa: csak a gyökerek */

export const Basic: Story = {
  args: {
    id: 'story-tree',
    tree: true,
  },
};

Basic.storyName = 'Basic';


/* !- Kezdetben nyitott ágak (az első kattintásig, utána a redux form a forrás) */

export const Expanded: Story = {
  args: {
    id: 'story-tree-expanded',
    tree: { expanded: [1, 2, 9] },
  },
};

Expanded.storyName = 'Initially expanded';


/* !- Minden ág nyitva, infinity scroll (ReactList), fix magasság */

export const ExpandedAll: Story = {
  args: {
    id: 'story-tree-all',
    tree: { expanded: true },
    infinity: true,
    freezeHeader: true,
    height: '40rem',
  },
};

ExpandedAll.storyName = 'All expanded + infinity';


/* !- Többes kijelölés (shift / ctrl + kattintás, ctrl+A a látható sorokra) */

export const Multiple: Story = {
  args: {
    id: 'story-tree-multiple',
    tree: { expanded: [1] },
    multipleSelect: true,
  },
};

Multiple.storyName = 'Multiple select';


/* !- Kereső: a találatok + őseik látszanak, az ősök maguktól kinyílnak és halványak */

const SEARCH_ID = 'story-tree-search-query';

const normalize = (text: string) =>
  String(text || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

const SearchGrid = (args: any) => {
  const query = useSelector(({ form }: any) => normalize(form[SEARCH_ID]).trim());

  const filter = useCallback(
    ({ title }: { title: string }) => normalize(title).includes(query),
    [query],
  );

  return (
    <>
      <Input id={SEARCH_ID} placeholder="Keresés kategóriára (pl. kanapé, ágy)…" />
      <Grid {...args} tree={{ ...args.tree, filter: query ? filter : undefined }} />
    </>
  );
};

export const Search: Story = {
  args: {
    id: 'story-tree-search',
    tree: true,
    noResults: <div className="v-center py-1/2 text-gray">Nincs találat.</div>,
  },
  render: (args) => <SearchGrid {...args} />,
};

Search.storyName = 'Search';
