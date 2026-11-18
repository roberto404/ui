import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import simplify from '@1studio/utils/math/simplify';

require('../../../assets/style/index.scss');


/* !- Components */

import { Grid as GridView } from '../../view/grid';
import Connect from '../../grid/connect';
import Grid from '../../grid/components/grid';
import FileListGridRow from '../../grid/components/gridRows/filelist';
import FileIconListGridRow from '../../grid/components/gridRows/fileIconList';
import { Input } from '../../form/intl';


/* !- Context */

import withGridContext from './withGridContext';


/* !- Constants */

const EXTS = ['pdf', 'docx', 'xlsx', 'zip', 'glb'];

const DATA = [
  'Megrendelőlap 2.3.18101', 'Szállítólevél', 'Díjbekérő', 'Árlista 2026', 'Garancia jegy',
  'Összeszerelési útmutató', 'Kanapé modell', 'Fotó csomag', 'Szerződés', 'Számla 2026-0012',
  'Raktári átkérés', 'Ajánlat',
].map((title, index) => ({
  id: index + 1,
  title,
  ext: EXTS[index % EXTS.length],
  size: String(18000 + index * 731117),
}));

const SETTINGS = {
  hook: {
    title: { title: 'Név', width: '70%', align: 'left' },
    size: {
      title: 'Méret',
      format: ({ record }: any) => (
        <span className="text-gray-dark">{simplify(parseInt(record.size), 1024, [' B', ' KB', ' MB', ' GB'])}</span>
      ),
      align: 'right',
      width: '15%',
    },
    ext: { title: 'Típus', align: 'left', width: '15%' },
  },
  paginate: { limit: 0, page: 1 },
  filters: [
    {
      id: 'search',
      handler: (record: any, value: string) =>
        record.title.toString().toLowerCase().indexOf(value.toString().toLowerCase()) >= 0,
      arguments: [],
      status: false,
    },
  ],
};

const fakeApi = (records: any[]) => () => Promise.resolve({ status: 'SUCCESS', records });


/* !- Stories */

const meta = {
  title: 'Grid/FileList',
  component: GridView,
  decorators: [withGridContext],
} satisfies Meta<typeof GridView>;

export default meta;

type Story = StoryObj<typeof meta>;


/* !- Táblázatos lista (small, zebra) + csempe nézet (FileListGridRow) */

export const FileList: Story = {
  name: 'Fájllista',
  render: () => (
    <GridView id="story-filelist" api={fakeApi(DATA)} settings={SETTINGS} onLoad="selectFirst" className="p-3" preloader={false}>
      <div className="filters mb-2">
        <Input
          id="search"
          label={<div className="icon embed-search-gray-dark">Keresés</div>}
          placeholder="Fájlnév..."
        />
      </div>

      <h2>Lista (small, zebra; dupla / jobb klikk a konzolra)</h2>
      <Connect>
        <Grid
          className="grid column no-select"
          headClassName="thead small"
          bodyClassName="tbody small no-hover bg-nth-even"
          infinity
          selectable
          onDoubleClickCell={(record: any, column: any) => console.log('dblclick', record, column)}
          onContextClickCell={(record: any, column: any) => console.log('contextmenu', record, column)}
        />
      </Connect>

      <h2 className="mt-3">Csempék</h2>
      <Connect>
        <Grid
          className="card p-2 shadow-outer border border-white scroll-y no-select"
          style={{ height: '400px' }}
          bodyClassName="grid-2-2"
          rowElement={FileListGridRow}
          showHeader={false}
          selectable
          expandSelect
        />
      </Connect>
    </GridView>
  ),
};


/* !- Ikon lista (feltöltés közbeni % és üres hely) */

const ICON_DATA = [
  { id: 1, title: 'Megrendelőlap', ext: 'pdf', size: '1203898' },
  { id: 2 },
  { id: 3, title: 'Fotó feltöltés alatt', ext: 'jpg', size: '1203898', percent: 29 },
  { id: 4, title: 'Árlista', ext: 'xlsx', size: '1203898' },
  { id: 5, title: 'Modell', ext: 'glb', size: '1203898' },
];

export const FileIconList: Story = {
  name: 'Ikon lista',
  render: () => (
    <GridView id="story-fileiconlist" api={fakeApi(ICON_DATA)} className="p-3" preloader={false}>
      <Connect>
        <Grid
          className="card p-2 shadow-outer border border-white scroll-y no-select"
          style={{ height: '400px' }}
          bodyClassName="grid-2-2"
          rowElement={FileIconListGridRow}
          showHeader={false}
        />
      </Connect>
    </GridView>
  ),
};
