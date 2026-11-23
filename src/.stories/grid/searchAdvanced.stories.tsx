import React, { useEffect } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { useDispatch, useSelector } from 'react-redux';

require('../../../assets/style/index.scss');


/* !- Components */

import Grid from '../../grid/components/grid';
import GridSearch from '../../grid/components/gridSearch';
import GridSearchAdvanced, {
  Group,
  fieldsFromGridFilters,
  matchQuery,
} from '../../grid/components/gridSearchAdvanced';
import { search } from '../../grid/filters';
import { dialog } from '../../layer/actions';
import { setValues, unsetValues } from '../../form/actions';

import IconOrder from '../../icon/mui/action/description';
import IconCustomer from '../../icon/mui/social/person';
import IconProduct from '../../icon/mui/inventory_2';


/* !- Context (redux form + AppContext + intl + Layer) */

import withGridContext from './withGridContext';


/* !- Demo data: vásárlások tételekkel */

const RECORDS = [
  {
    id: 1, orderId: '2.0.10234', status: 'production', deposit: 50000, orderedDateTime: '2026-11-03 10:12:00',
    invoicing: { name: 'Kovács Anna', city: 'Budaörs' },
    attachment: [{ origin: 'piper' }],
    products: [
      { productId: 'K3601400', brand: 'Sun', title: 'kanapéágy', status: 3 },
      { productId: 'RSENG000KUPA', brand: 'Egyéb', title: 'Engedmény Kupon alap', status: 8 },
    ],
  },
  {
    id: 2, orderId: '6.0.4410', status: 'invoice', deposit: 0, orderedDateTime: '2026-10-21 15:40:00',
    invoicing: { name: 'Nagy Péter', city: 'Érd' },
    attachment: [{ ext: 'png' }],
    products: [{ productId: 'F26241141', brand: 'Oslo', title: 'fotel', status: 6 }],
  },
  {
    id: 3, orderId: '8.0.7781', status: 'quote', deposit: 20000, orderedDateTime: '2026-11-18 09:05:00',
    invoicing: { name: 'Szabó Éva', city: 'Budapest' },
    attachment: [],
    products: [
      { productId: 'K3601404', brand: 'Sun', title: 'kanapéágy', status: 0 },
      { productId: 'NK30120', brand: 'Bella', title: 'étkezőasztal', status: 0 },
    ],
  },
  {
    id: 4, orderId: '2.3.18101', status: 'complete', deposit: 120000, orderedDateTime: '2026-09-30 18:22:00',
    invoicing: { name: 'Tóth Gábor', city: 'Budaörs' },
    attachment: [{ origin: 'card' }],
    products: [{ productId: 'K2810010', brand: 'Avignon', title: 'sarokkanapé', status: 8 }],
  },
];

const STATUS_TITLE = {
  quote: 'Árajánlat',
  production: 'Gyártás alatt',
  invoice: 'Számlázásra vár',
  complete: 'Lezárt',
};

/**
 * A grid toolbar-szűrője (mint egy GridMultiSelect): a dialógus olvassa / írja
 * (`bind`), a saját szűrője illeszt
 */
const GRID_FILTERS = [
  {
    id: 'status',
    label: 'Státusz',
    data: [{ title: 'Státusz', items: Object.keys(STATUS_TITLE).map(id => ({ id, title: STATUS_TITLE[id] })) }],
  },
];

const BOUND = fieldsFromGridFilters(GRID_FILTERS, { status: { full: true } });

const products = (record: any) => record.products || [];

const GROUPS: Group[] = [
  {
    id: 'order',
    title: 'Vásárlás',
    subtitle: 'A vásárlás fejadatai',
    icon: IconOrder,
    fields: [
      {
        id: 'orderId',
        type: 'text',
        title: 'Sorszám',
        hint: 'részletre is keres',
        placeholder: 'pl. 2.3.18101',
        get: record => record.orderId,
      },
      BOUND.status,
      {
        id: 'date',
        type: 'date',
        title: 'Dátum',
        full: true,
        types: [{ id: 'orderedDateTime', title: 'Megrendelés' }],
        presets: ['thisWeek', 'last7', 'thisMonth', 'prevMonth'],
        get: (record, type) => record[type],
      },
      {
        id: 'deposit',
        type: 'amount',
        title: 'Letét / előleg összege',
        operators: ['exists', 'missing', 'eq', 'range'],
        operator: 'range',
        unit: 'Ft',
        get: record => record.deposit || 0,
      },
      {
        id: 'attachment',
        type: 'checkbox',
        title: 'Tervek',
        path: 'attachment',
        columns: 2,
        options: [
          { id: 'piper', title: 'Piper-terv', query: 'attachment.origin==piper' },
          { id: '3d', title: '3D-terv', query: 'attachment.ext==png' },
        ],
        match: (record, { ids }) => ids.some(id => (record.attachment || []).some(file =>
          (id === 'piper' ? file.origin === 'piper' : !file.origin && file.ext === 'png'))),
      },
    ],
  },
  {
    id: 'customer',
    title: 'Vásárló',
    icon: IconCustomer,
    fields: [
      {
        id: 'customerName',
        type: 'text',
        title: 'Vásárló neve',
        path: 'invoicing.name',
        placeholder: 'Név vagy cégnév…',
        get: record => record.invoicing?.name,
      },
      {
        id: 'customerCity',
        type: 'text',
        title: 'Település',
        path: 'invoicing.city',
        placeholder: 'pl. Budaörs',
        get: record => record.invoicing?.city,
      },
    ],
  },
  {
    id: 'product',
    title: 'Termékek',
    subtitle: 'A vásárlás tételei',
    icon: IconProduct,
    items: products,
    fields: [
      {
        id: 'productName',
        type: 'text',
        title: 'Termék neve',
        hint: 'bútorcsalád vagy megnevezés',
        full: true,
        placeholder: 'pl. Sun',
        paths: ['products.brand', 'products.title'],
        get: product => [product.brand, product.title],
      },
      {
        id: 'productSku',
        type: 'text',
        title: 'Cikkszám',
        path: 'products.productId',
        placeholder: 'pl. F26241141',
        get: product => product.productId,
      },
      {
        id: 'coupon',
        type: 'choice',
        title: 'Kuponnal',
        options: [
          { id: 'any', title: 'Mindegy' },
          { id: 'yes', title: 'Igen', query: 'products.productId==RSENG000KUPA.*' },
          { id: 'no', title: 'Nem', query: 'products.productId!==RSENG000KUPA.*' },
        ],
        match: (record, { id }) => {
          const has = products(record).some(({ productId }) => productId.indexOf('RSENG000KUPA') === 0);
          return id === 'yes' ? has : !has;
        },
      },
    ],
  },
];

const HOOK = {
  orderId: { title: 'Sorszám', width: '15%' },
  status: { title: 'Státusz', format: ({ value }) => STATUS_TITLE[value] || value },
  invoicing: { title: 'Vásárló', format: ({ value }) => value?.name },
  products: { title: 'Tételek', format: ({ value }) => (value || []).map(({ productId }) => productId).join(', ') },
  deposit: { title: 'Letét', align: 'right', format: ({ value }) => (value ? `${value.toLocaleString('hu-HU')} Ft` : '–') },
};

/**
 * A `search` szűrő: `?`-es kifejezés = a szempontok + a saját kifejezések
 * (ui Filters.search, `cnf`), sima szöveg = sorszám / név
 */
const filterRecords = (records: any[], value?: string, statuses?: string[]) =>
  records
    .filter(record => !statuses || !statuses.length || statuses.includes(record.status))
    .filter((record, index) => {
      if (!value) {
        return true;
      }

      if (value[0] === '?') {
        return matchQuery(GROUPS, record, value.substring(1), (item, query) =>
          search({ record: item, value: query, helpers: {}, hooks: {}, index, cnf: true }));
      }

      return `${record.orderId} ${record.invoicing.name}`.toLowerCase().includes(value.toLowerCase());
    });

const LAYER_OPTIONS = { className: 'no-padding no-close' };


/* !- Story components */

const FormValues = () => {
  const searchValue = useSelector(({ form }: any) => form.search);
  const status = useSelector(({ form }: any) => form.status);

  return (
    <pre className="mt-2 p-1 text-xs bg-white-dark rounded">
      {`form.search = ${JSON.stringify(searchValue)}\n`}
      {`form.status = ${JSON.stringify(status)}`}
    </pre>
  );
};

/**
 * Toolbar kereső + grid: a „…” gomb nyitja a Haladó keresést
 */
const GridWithAdvancedSearch = ({ preset }: { preset?: Record<string, any> }) => {
  const dispatch = useDispatch();
  const searchValue = useSelector(({ form }: any) => form.search);
  const status = useSelector(({ form }: any) => form.status);

  useEffect(() => {
    dispatch(unsetValues({ search: undefined, status: undefined }));

    if (preset) {
      dispatch(setValues(preset));
    }
  }, []);

  const onAdvance = () => dispatch(dialog(<GridSearchAdvanced formId="storySearch" groups={GROUPS} />, LAYER_OPTIONS));

  return (
    <div className="p-3" style={{ maxWidth: 960 }}>
      <p className="text-s text-gray mb-2">
        A kereső „…” gombja nyitja a Haladó keresést. A feltételek `?mező=érték` kifejezésként a
        kereső mezőbe kerülnek, a Státusz a grid saját szűrőjébe (form.status). A kézzel írt,
        ismeretlen tagok „Saját kifejezés” chipként megmaradnak.
      </p>

      <div className="mb-2" style={{ maxWidth: 520 }}>
        <GridSearch id="search" placeholder="Szűrés a vásárlásokban" fields={[]} onAdvance={onAdvance} autoFocus={false} />
      </div>

      <Grid
        id="storySearchGrid"
        data={filterRecords(RECORDS, searchValue, status)}
        hook={HOOK}
        className="grid column"
        noResults={<div className="p-2 text-gray">Nincs találat.</div>}
      />

      <FormValues />
    </div>
  );
};

/**
 * Csak a dialógus (layer nélkül, a kereső mező kifejezéséből tölt)
 */
const DialogOnly = ({ preset }: { preset?: Record<string, any> }) => {
  const dispatch = useDispatch();
  const [isReady, setReady] = React.useState(false);

  useEffect(() => {
    dispatch(unsetValues({ search: undefined, status: undefined }));
    dispatch(setValues(preset || {}));
    setReady(true);
  }, []);

  return (
    <div className="p-3">
      <div className="inline-block shadow-outer-3 rounded-l overflow">
        {isReady && <GridSearchAdvanced formId="storyDialog" groups={GROUPS} onClose={() => {}} />}
      </div>
      <FormValues />
    </div>
  );
};


/* !- Stories */

const meta = {
  title: 'Grid/Advanced search',
  decorators: [withGridContext],
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Üres kereső: a „…” gomb nyitja a dialógust
 */
export const InGrid: Story = {
  name: 'A gridben',
  render: () => <GridWithAdvancedSearch />,
};

/**
 * Előre kitöltve: szempontok + kötött Státusz + saját kifejezés (`deposit!==20000`)
 */
export const InGridWithQuery: Story = {
  name: 'A gridben, kitöltött kereséssel',
  render: () => (
    <GridWithAdvancedSearch
      preset={{ search: '?invoicing.city=Budaörs&deposit!==20000', status: ['production', 'complete'] }}
    />
  ),
};

/**
 * A dialógus magában: aktív chipek, saját kifejezés, VAGY-csoport
 */
export const Dialog: Story = {
  name: 'Dialógus',
  render: () => (
    <DialogOnly
      preset={{
        search: '?products.brand=Sun|products.title=Sun&attachment.origin==piper&orderId=2.0|orderId=6.0',
        status: ['production'],
      }}
    />
  ),
};
