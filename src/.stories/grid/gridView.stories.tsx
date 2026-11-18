import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { useDispatch, useStore } from 'react-redux';

require('../../../assets/style/index.scss');


/* !- Components */

import { Grid as GridView } from '../../view/grid';
import Connect from '../../grid/connect';
import Grid from '../../grid/components/grid';
import GridFilters from '../../grid/components/gridFilters';
import GridSelectGroupBy from '../../grid/components/gridSelectGroupBy';
import GridFieldGroupBy from '../../grid/components/gridFieldGroupBy';
import GridOrder from '../../grid/components/gridOrder';
import GridDownload from '../../grid/components/gridDownload';
import GridSearch, { GridSearchDialog } from '../../grid/components/gridSearch';
import { useSummaryHandler } from '../../grid/components/handlers/summary';
import Pagination from '../../pagination/pure/pagination';
import ShowMore from '../../pagination/pure/showmore';
import Form, { Input, Button, Dropdown, Plain } from '../../form/intl';
import IconMore from '../../icon/mui/navigation/expand_more';
import IconAdd from '../../icon/mui/content/add_circle_outline';


/* !- Actions */

import { dialog } from '../../layer/actions';
import { setValues, unsetValues } from '../../form/actions';
import { search } from '../../grid/filters';


/* !- Context */

import withGridContext from './withGridContext';


/* !- Constants */

import { DATA, SETTINGS, HOOK_LIST } from '../../.examples/grid/constants';

const fakeApi = (records: any[] = DATA, delay = 0) => () =>
  new Promise(resolve => setTimeout(() => resolve({ status: 'SUCCESS', records }), delay));

const SearchInput = ({ placeholder = 'Név...' }: { placeholder?: string }) => (
  <Input
    id="search"
    label={<div className="icon embed-search-gray-dark">Keresés</div>}
    placeholder={placeholder}
  />
);


/* !- Stories */

const meta = {
  title: 'Grid/GridView',
  component: GridView,
  decorators: [withGridContext],
} satisfies Meta<typeof GridView>;

export default meta;

type Story = StoryObj<typeof meta>;


/* !- Connect (props, children, listen + onChange, lapozó) */

export const ConnectStory: Story = {
  name: 'Connect',
  render: () => (
    <GridView id="story-gridview-connect" api={fakeApi()} settings={SETTINGS} className="p-3" preloader={false}>
      <h2>Connect UI prop-pal</h2>
      <Connect UI={Grid} />

      <h2 className="mt-3">Connect children-nel</h2>
      <Connect>
        <Grid />
      </Connect>

      <h2 className="mt-3">listen: page, orderColumn, totalPage + onChange (konzol)</h2>
      <Connect
        UI={Grid}
        listen={['page', 'orderColumn', 'totalPage']}
        onChange={(state: any, prevState: any) => console.log('onChange', state, prevState)}
      />

      <h2 className="mt-3">Lapozó</h2>
      <Connect UI={Pagination} limit={3} />
    </GridView>
  ),
};


/* !- Kereső mező (szűrő a form store-ból) */

export const Search: Story = {
  name: 'Kereső mező',
  render: () => (
    <GridView id="story-gridview-search" api={fakeApi()} settings={{ ...SETTINGS, paginate: { limit: 0 } }} className="p-3" preloader={false}>
      <div className="filters mb-2">
        <SearchInput />
      </div>
      <Connect UI={Grid} />
    </GridView>
  ),
};


/* !- Szűrők (tag-ek, gomb, group-by select/dropdown, külső beállítás) */

const OutsideFilterButton = () => {
  const dispatch = useDispatch();

  return (
    <button
      className="outline shadow w-auto mb-2"
      onClick={(event) => {
        event.preventDefault();
        dispatch(unsetValues({ search: undefined }));
        dispatch(setValues({ search: 's. taylor' }));
      }}
    >
      Szűrés kívülről („s. taylor”)
    </button>
  );
};

export const Filters: Story = {
  name: 'Szűrők',
  render: () => (
    <GridView id="story-gridview-filters" api={fakeApi()} settings={{ ...SETTINGS, paginate: { limit: 0 } }} className="p-3" preloader={false}>
      <OutsideFilterButton />

      <GridFilters
        className="mb-2"
        tagClassName="tag button outline small shadow w-auto blue mr-1/2"
      />

      <div className="filters mb-2">
        <SearchInput />
        <Button id="isMale" placeholder="Férfi" />
        <GridSelectGroupBy
          id="gender"
          placeholder="Nem (select)"
          helper={[{ id: 1, title: 'Férfi' }, { id: 2, title: 'Nő' }]}
        />
        <GridFieldGroupBy
          id="gender"
          placeholder="Nem (group-by)"
          helper={[{ id: 1, title: 'Férfi' }, { id: '2', title: 'Nő' }]}
        />
        <Dropdown
          id="gender"
          label="Nem"
          placeholder="Mind"
          data={[
            { id: '1', title: 'Férfi' },
            { id: '2', title: 'Nő' },
          ]}
        />
      </div>

      <Connect UI={Grid} />
    </GridView>
  ),
};


/* !- GridSearch (lekérdező kereső: `?name=Megan&gender==1`) + önálló dialog */

const SEARCH_DATA = [
  { id: 1, name: 'Megan J. Cushman', gender: '1', visits: '2' },
  { id: 2, name: 'Taylor R. Fallin', gender: '2', visits: '22' },
  { id: 3, name: 'Jose C. Rosado', gender: '1', visits: '7' },
];

const SEARCH_SETTINGS = {
  hook: {
    id: 'id',
    name: 'Name',
    gender: {
      title: 'Gender',
      format: ({ value, helper }: any) => (helper.gender ? helper.gender[value] || value : value),
    },
    visits: 'Visits',
  },
  helper: { gender: { 1: 'male', 2: 'female' } },
  paginate: { limit: 0 },
  filters: [
    {
      id: 'search',
      handler: (record: any, value: string, filters: any, model: any, index: number) => (
        value[0] === '?' ?
          search({ record, value: value.substring(1), helpers: {}, hooks: {}, index }) :
          Object.values(record).join('').indexOf(value) !== -1
      ),
      arguments: [],
      status: false,
    },
  ],
};

const SEARCH_FIELDS = [
  { id: 'name', title: 'Name' },
  { id: 'id', title: 'Id' },
  { id: 'gender', title: 'Gender' },
  { id: 'visits', title: 'Visits' },
];

const StandaloneSearchButton = () => {
  const dispatch = useDispatch();

  return (
    <div
      className="button outline inline-block w-auto mt-3"
      onClick={() => dispatch(dialog(<GridSearchDialog id="story-standalone-search" fields={SEARCH_FIELDS} />))}
    >
      Önálló kereső dialog
    </div>
  );
};

export const QuerySearch: Story = {
  name: 'GridSearch',
  render: () => (
    <div className="p-3">
      <GridView id="story-gridview-query" api={fakeApi(SEARCH_DATA)} settings={SEARCH_SETTINGS} preloader={false}>
        <p className="text-s text-gray mb-2">Sima szöveg: bármely mezőben; „?” előtaggal lekérdezés, pl. <code>?name=Megan</code></p>
        <div className="filters mb-2">
          <GridSearch fields={SEARCH_FIELDS} prefix="?" nested={false} />
        </div>
        <Connect UI={Grid} />
      </GridView>
      <StandaloneSearchButton />
    </div>
  ),
};


/* !- Extrák: darabszám, rendezés menü, CSV letöltés */

export const Extra: Story = {
  name: 'Rendezés + letöltés',
  render: () => (
    <GridView id="story-gridview-extra" api={fakeApi()} settings={{ ...SETTINGS, paginate: { limit: 0 } }} className="p-3" preloader={false}>
      <div className="h-center mb-2">
        <Connect UI={({ rawData = [] }: any) => <div className="tag bg-gray-light mr-1">Összesen: {rawData.length}</div>} />
        <GridOrder
          className="button outline w-auto mr-1"
          data={[
            { id: 'name', title: 'Name' },
            { id: 'visits', title: 'Visits' },
            { id: 'gender', title: 'Gender' },
          ]}
        />
        <GridDownload className="button outline w-auto" />
      </div>
      <Connect UI={Grid} selectable />
    </GridView>
  ),
};


/* !- Egyedi sor (gomb dialoggal) + checkbox kijelölés */

const ComplexRow = ({ data, className, onClick }: any) => {
  const dispatch = useDispatch();

  return (
    <div className={className} onClick={onClick}>
      <div className="checkbox" />
      <div>{data.name}</div>
      <div>{data.visits}</div>
      <div>
        <button
          className="gray w-auto"
          onClick={(event) => {
            event.stopPropagation();
            dispatch(dialog(<div className="p-3">Gender: {data.gender}</div>));
          }}
        >
          <IconMore /><span>gender</span>
        </button>
      </div>
    </div>
  );
};

export const CustomRow: Story = {
  name: 'Egyedi sor + checkbox',
  render: () => (
    <GridView id="story-gridview-complex" api={fakeApi()} settings={{ ...SETTINGS, paginate: { limit: 0 } }} className="p-3" preloader={false}>
      <div className="filters mb-2">
        <SearchInput />
      </div>
      <Connect
        UI={Grid}
        rowElement={ComplexRow}
        selectable
        expandSelect
        checkboxSelect
      />
    </GridView>
  ),
};


/* !- Kártya sorok (flex, avatar) */

const CasualRow = ({ data, className }: any) => (
  <div className={`mx-2 p-2 rounded ${className}`}>
    <div className="avatar h-4 w-4 border-double-gray">
      <span>{data.name[0]}</span>
    </div>
    <div className="pt-2">{data.name}</div>
  </div>
);

export const Casual: Story = {
  name: 'Kártya sorok',
  render: () => (
    <GridView id="story-gridview-casual" api={fakeApi()} settings={{ ...SETTINGS, paginate: { limit: 0 } }} className="p-3" onLoad="selectFirst" preloader={false}>
      <Connect
        UI={Grid}
        rowElement={CasualRow}
        selectable
        showHeader={false}
        bodyClassName="tbody infinity flex"
      />
    </GridView>
  ),
};


/* !- Továbbiak gomb (ShowMore, görgetésre is) */

const PAGINATE_DATA = DATA.reduce(
  (results: any[], i: any, n: number) => [...results, ...DATA.map(record => ({ ...record, id: `${n}-${record.id}` }))],
  [],
);

export const ShowMoreStory: Story = {
  name: 'Továbbiak (ShowMore)',
  render: () => (
    <GridView id="story-gridview-showmore" api={fakeApi(PAGINATE_DATA)} settings={{ ...SETTINGS, paginate: { limit: 5 } }} className="p-3" preloader={false}>
      <div className="filters mb-2">
        <SearchInput />
      </div>
      <Connect UI={Grid} />
      <Connect
        UI={ShowMore}
        label="Továbbiak"
        format={({ current, limit }: any) => `${current} / ${limit} elem`}
        autoPaginate
      />
    </GridView>
  ),
};


/* !- Skeleton betöltés közben (2 mp késleltetés) */

export const Skeleton: Story = {
  name: 'Skeleton',
  render: () => (
    <GridView id="story-gridview-skeleton" api={fakeApi(DATA, 2000)} settings={SETTINGS} className="p-3" onLayer>
      <Connect
        skeleton={(
          <div className="grid-1-1">
            <div className="col-3-12"><div className="skeleton-line-s h-4" /></div>
            <div className="col-3-12"><div className="skeleton-line h-4" /></div>
            <div className="col-3-12"><div className="skeleton-line-s h-4" /></div>
            <div className="col-3-12 col-br"><div className="skeleton-line-s h-4" /></div>
          </div>
        )}
        skeletonRepeat={10}
      >
        <Grid />
      </Connect>
    </GridView>
  ),
  parameters: { chromatic: { delay: 2500 } },
};


/* !- Oszlop összesítő (SummaryHandler) */

const SummaryButton = ({ id, column }: { id: string, column: string }) => {
  const { SummaryHandler } = useSummaryHandler();
  const store = useStore<any>();

  return (
    <div
      className="button blue w-content large mb-2"
      onClick={(event) => {
        const { rawData, helper = {} } = store.getState().grid[id];

        SummaryHandler({ records: rawData, column, data: rawData, helper: helper[column], event });
      }}
    >
      „{column}” összesítő
    </div>
  );
};

export const Summary: Story = {
  name: 'Összesítő',
  render: () => (
    <GridView id="story-gridview-summary" api={fakeApi()} settings={{ ...SETTINGS, paginate: { limit: 0 } }} className="p-3" preloader={false}>
      <SummaryButton id="story-gridview-summary" column="time" />
      <Connect UI={Grid} />
    </GridView>
  ),
};


/* !- Lista + űrlap (kijelölt sor a form store-ba, onLoad: selectFirst) */

export const ListForm: Story = {
  name: 'Lista + űrlap',
  render: () => (
    <GridView
      id="story-gridview-list"
      api={fakeApi()}
      className="column p-3"
      style={{ height: 480 }}
      settings={{ ...SETTINGS, hook: HOOK_LIST, paginate: { limit: 0 } }}
      onLoad="selectFirst"
      preloader={false}
    >
      <div className="grid mb-1">
        <div className="col-1-3">
          <button className="green outline shadow w-auto mr-2 inline-block">
            <IconAdd />
            <span>Új</span>
          </button>
        </div>
        <div className="col-2-3">
          <div className="filters">
            <SearchInput />
          </div>
        </div>
      </div>

      <div className="card mb-0 p-0 shadow-outer border border-white grid grow scroll-y">
        <div className="grid grow">
          <div className="col-1-3 bg-white-semi-light">
            <Connect
              UI={Grid}
              uiProps={{
                className: 'w-full scroll-y',
                selectable: true,
                expandSelect: false,
                showHeader: false,
                infinity: true,
              }}
            />
          </div>
          <div className="col-2-3 border-left border-gray-light p-3 scroll-y">
            <Form id="story-gridview-list">
              <Plain id="name" label="Név" />
              <Input id="name" label="Név szerkesztése" />
              <Input id="visits" label="Látogatás" />
            </Form>
          </div>
        </div>
      </div>
    </GridView>
  ),
};
