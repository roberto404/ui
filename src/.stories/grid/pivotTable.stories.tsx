import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { useSelector } from 'react-redux';
import count from '@1studio/utils/array/count';
import countUnique from '@1studio/utils/array/countUnique';
import PivotTable, { collectionGroupBy } from '@1studio/utils/array/pivotTable';
import sum from 'lodash/sum';
import mean from 'lodash/mean';
import max from 'lodash/max';
import min from 'lodash/min';

require('../../../assets/style/index.scss');


/* !- Components */

import { Grid as GridView } from '../../view/grid';
import Grid from '../../grid/components/grid';
import { Input, Dropdown } from '../../form/intl';


/* !- Context */

import withGridContext from './withGridContext';


/* !- Constants */

import { DATA as VISITS } from '../../.examples/grid/constants';

const fakeApi = (records: any[]) => () => Promise.resolve({ status: 'SUCCESS', records });


/* !- Stories */

const meta = {
  title: 'Grid/PivotTable',
  component: GridView,
  decorators: [withGridContext],
} satisfies Meta<typeof GridView>;

export default meta;

type Story = StoryObj<typeof meta>;


/* !- Egyszerű: látogatások dátum × nem szerint (count) */

const GENDERS: Record<number, string> = { 1: 'male', 2: 'female' };

const SimplePivot = ({ id }: { id: string }) => {
  const data = useSelector(({ grid }: any) => grid[id]?.data || []);
  // szöveges oszlopkulcs: a numerikus kulcsokat (1, 2) a JS objektum előre sorolná a hook-ban
  const records = data.map((record: any) => ({ ...record, gender: GENDERS[record.gender] }));
  const gridData = records.length ? new PivotTable(records, 'id', count, ['visits', 'gender']).toArray() : [];

  return (
    <Grid
      data={gridData}
      hook={{
        id: 'Dátum',
        male: 'Férfi',
        female: 'Nő',
        summary: { title: 'Összesen' },
      }}
    />
  );
};

export const Simple: Story = {
  name: 'Egyszerű',
  render: () => (
    <GridView id="story-pivot-simple" api={fakeApi(VISITS)} settings={{ paginate: { limit: 0 } }} className="p-3" preloader={false}>
      <SimplePivot id="story-pivot-simple" />
    </GridView>
  ),
};


/* !- Összetett: sor / oszlop / mező / összesítő választható, szűrőkkel */

const SALES = [
  { id: 1, product: 'Kanapé', store: 'RS2', date: '2026-07-23', price: 200, quantity: 1 },
  { id: 2, product: 'Fotel', store: 'RS6', date: '2026-07-22', price: 200, quantity: 1 },
  { id: 3, product: 'Kanapé', store: 'RS2', date: '2026-07-22', price: 200, quantity: 3 },
  { id: 4, product: 'Kanapé', store: 'RS2', date: '2026-07-22', price: 100, quantity: 1 },
  { id: 5, product: 'Kanapé', store: 'RS2', date: '2026-07-22', price: 100, quantity: 5 },
  { id: 6, product: 'Fotel', store: 'RS6', date: '2026-07-23', price: 100, quantity: 2 },
  { id: 7, product: 'Fotel', store: 'RS2', date: '2026-07-23', price: 20, quantity: 1 },
  { id: 8, product: 'Fotel', store: 'RS2', date: '2026-08-23', price: 20, quantity: 1 },
  { id: 9, product: 'Asztal', store: 'RS6', date: '2026-08-23', price: 20, quantity: 1 },
  { id: 10, product: 'Asztal', store: 'RS2', date: '2026-08-23', price: 10, quantity: 1 },
  { id: 11, product: 'Asztal', store: 'RS2', date: '2026-08-23', price: 10, quantity: 2 },
  { id: 12, product: 'Asztal', store: 'RS2', date: '2026-08-23', price: 10, quantity: 1 },
];

const SUMMARIES: Record<string, (values: any[]) => number> = { count, countUnique, sum, max, min, mean };

const COMPLEX_SETTINGS = {
  paginate: { page: 1, limit: 0 },
  filters: [
    {
      id: 'pivotSearch',
      handler: (record: any, term: string) => term.split(/[ ,]+/g).every(word =>
        record.product.toString().toLowerCase().indexOf(word.toString().toLowerCase()) >= 0,
      ),
      arguments: [],
      status: false,
    },
    {
      id: 'pivotDate',
      handler: (record: any, term: string) => record.date.indexOf(term) === 0,
      arguments: [],
      status: false,
    },
  ],
};

const FIELDS = Object.keys(SALES[0]).map(key => ({ id: key, title: key }));

const ComplexPivot = ({ id }: { id: string }) => {
  const data = useSelector(({ grid }: any) => grid[id]?.data || []);
  const row = useSelector(({ form }: any) => form.pivotRow) || 'product';
  const column = useSelector(({ form }: any) => form.pivotColumn) || 'store';
  const field = useSelector(({ form }: any) => form.pivotField) || 'quantity';
  const summarize = useSelector(({ form }: any) => form.pivotSummarize) || 'sum';

  let gridData: any[] = [];
  const hook: Record<string, any> = { id: row };

  if (data.length) {
    gridData = new PivotTable(data, field, SUMMARIES[summarize], [row, column]).toArray();

    collectionGroupBy(data, column)
      .map(({ id: groupId }: any) => groupId)
      .sort()
      .forEach((groupId: string) => hook[groupId] = groupId);

    hook.summary = summarize;
  }

  return (
    <div className="card mb-0 p-0 shadow-outer border border-white">
      <Grid hook={hook} data={gridData} />
    </div>
  );
};

const PivotDropdown = ({ id, label, value, data }: any) => (
  <Dropdown
    id={id}
    className="inline-block"
    buttonClassName="gray outline shadow"
    label={label}
    value={value}
    data={data}
    placeholder={false}
  />
);

export const Complex: Story = {
  name: 'Összetett',
  render: () => (
    <GridView id="story-pivot-complex" className="column p-3" api={fakeApi(SALES)} settings={COMPLEX_SETTINGS} preloader={false}>
      <div className="grid mb-1">
        <div className="col-1-2">
          <div className="filters" style={{ justifyContent: 'flex-start' }}>
            <PivotDropdown id="pivotRow" label="Sor" value="product" data={FIELDS} />
            <PivotDropdown id="pivotColumn" label="Oszlop" value="store" data={FIELDS} />
            <PivotDropdown id="pivotField" label="Mező" value="quantity" data={FIELDS} />
            <PivotDropdown
              id="pivotSummarize"
              label="Összesítő"
              value="sum"
              data={Object.keys(SUMMARIES).map(key => ({ id: key, title: key }))}
            />
          </div>
        </div>
        <div className="col-1-2">
          <div className="filters">
            <Input
              id="pivotSearch"
              label={<div className="icon embed-search-gray-dark">Keresés</div>}
              placeholder="Termék..."
            />
            <Dropdown
              id="pivotDate"
              className="inline-block"
              buttonClassName="gray outline shadow"
              label="Időszak"
              placeholder="Minden"
              data={[
                { id: '2026-07', title: 'Július' },
                { id: '2026-08', title: 'Augusztus' },
              ]}
            />
          </div>
        </div>
      </div>

      <ComplexPivot id="story-pivot-complex" />
    </GridView>
  ),
};
