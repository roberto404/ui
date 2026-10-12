import React, { useEffect, useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Provider, useSelector } from 'react-redux';
import Application from '@1studio/utils/models/application';

require('../../../assets/style/index.scss');


/* !- Components */

import Autocomplete from '../../form/components/autocomplete';
import {
  AutocompleteMenuHeader,
  AutocompleteMenuFooter,
  AutocompleteMenuRow,
} from '../../form/components/autocompleteMenu';
import Layer from '../../layer/layer';
import IconSearch from '../../icon/mui/action/search';


/* !- Context (a mező a redux store-hoz, a menü a layerhez, a billentyűk az App shortcutjaihoz kötődnek) */

import { AppContext } from '../../context';
import store from '../../store';

const reduxStore = store();
const App = new Application();

const appContext = {
  store: reduxStore,
  register: App.register,
  addListener: App.addListener,
  removeListener: App.removeListener,
  addShortcuts: App.addShortcuts,
  removeShortcuts: App.removeShortcuts,
};

const FORM = 'story-autocomplete-menu';

/**
 * A mező store-beli értéke a mező alatt
 */
const StoreValue = ({ id }: { id: string }) => {
  const value = useSelector(({ form }: any) => (form[FORM] || {})[id]);

  return (
    <pre className="mt-2 p-1 text-xs bg-white-dark rounded">
      {`form.${FORM}.${id} = ${JSON.stringify(value, null, 2)}`}
    </pre>
  );
};

const withContexts = (Story: any, { args }: any) => (
  <Provider store={reduxStore}>
    <AppContext.Provider value={appContext as any}>
      <div className="p-3" style={{ maxWidth: 760 }}>
        <Story />
        <StoreValue id={args.id} />
      </div>
      <Layer />
    </AppContext.Provider>
  </Provider>
);


/* !- Demo data */

type DemoProduct = {
  id: string,
  title: string,
  subtitle?: string,
  dimension?: string,
  badge?: string,
  badgeClassName?: string,
  priceOrig?: number,
  price?: number,
};

const PRODUCTS: DemoProduct[] = [
  { id: 'K25930012100', title: 'Riva sarokgarnitúra', subtitle: 'rugós ágyneműtartós, nyitható, lábtartóval', dimension: '287 × 171 cm', badge: 'XXL akció', badgeClassName: 'red', priceOrig: 681980, price: 581980 },
  { id: 'K25930012102', title: 'Riva sarok-2/NY-LV 3.', subtitle: 'rugós ágyneműtartós, nyitható, lábtartóval', dimension: '287 × 171 cm', badge: 'Leértékelt termék', price: 581980 },
  { id: 'K25930012101', title: 'Riva sarokgarnitúra, jobbos', subtitle: 'rugós ágyneműtartós, nyitható, lábtartóval', dimension: '287 × 171 cm', price: 579980 },
  { id: 'K25930012110', title: 'Riva 2-es ülőelem', subtitle: 'karfa nélküli, rugós ülés', dimension: '142 × 98 cm', price: 189980 },
  { id: 'K25930012120', title: 'Riva 3-as kanapé', subtitle: 'nyitható, ágyneműtartós', dimension: '226 × 98 cm', price: 349980 },
  { id: 'K25930012130', title: 'Riva fotel', subtitle: 'rugós ülés, fa lábakkal', dimension: '98 × 92 cm', price: 159980 },
  { id: 'K25930012140', title: 'Riva puff', subtitle: 'ágyneműtartós', dimension: '70 × 70 cm', price: 59980 },
  { id: 'K25930012150', title: 'Riva fejtámla', subtitle: 'állítható', dimension: '60 × 20 cm', price: 19980 },
  { id: 'K31000045100', title: 'Rivoli étkezőasztal', subtitle: 'bővíthető, tölgy', dimension: '160 × 90 cm', price: 219980 },
  { id: 'K31000045200', title: 'Arrivo komód', subtitle: '4 fiókos', dimension: '120 × 45 cm', price: 99980 },
  { id: 'K42000012300', title: 'Lima kanapé', subtitle: 'nyitható', dimension: '214 × 95 cm', price: 299980 },
];

const formatPrice = (price?: number) =>
  (price ? `${price.toLocaleString('hu-HU')} Ft` : undefined);

/**
 * Termék-szerű sor a közös AutocompleteMenuRow-val
 */
const ProductRow = ({ item, focus }: { item: DemoProduct, focus: boolean }) => (
  <AutocompleteMenuRow
    title={item.title}
    subtitle={item.subtitle}
    code={item.id}
    meta={[item.dimension]}
    badge={item.badge}
    badgeClassName={item.badgeClassName}
    priceOrig={formatPrice(item.priceOrig)}
    price={formatPrice(item.price)}
    focus={focus}
  />
);

const Header = ({ records }: { records: DemoProduct[] }) => (
  <AutocompleteMenuHeader title="Termékek" count={records.length} />
);

/**
 * Keresés a névben és a cikkszámban
 */
const filterProduct = (record: DemoProduct, term: string) =>
  `${record.title} ${record.id}`.toLowerCase().indexOf(term) !== -1;


/* !- Stories */

const meta = {
  title: 'Form/Autocomplete menu',
  component: Autocomplete,
  decorators: [withContexts],
  args: {
    form: FORM,
    label: 'Termék',
    placeholder: 'Név vagy cikkszám…',
    className: 'prefix-inside',
    prefix: <IconSearch className="fill-gray" />,
    data: PRODUCTS,
    filter: filterProduct,
    limit: 5,
    rowElement: ProductRow,
    headerElement: Header,
    footerElement: AutocompleteMenuFooter,
    menuFullWidth: true,
  },
} satisfies Meta<typeof Autocomplete>;

export default meta;


type Story = StoryObj<typeof meta>;


/* !- Egyedi sor + fejléc (találatok száma) + lábléc (billentyűk, összes találat) */

export const Default: Story = {
  args: {
    id: 'product',
  },
};

Default.storyName = 'Termékkereső (sor, fejléc, lábléc)';


/* !- Csak egyedi sor, fejléc/lábléc nélkül */

export const RowOnly: Story = {
  args: {
    id: 'product-row',
    headerElement: undefined,
    footerElement: undefined,
  },
};

RowOnly.storyName = 'Csak egyedi sor';


/* !- Aszinkron adat: a „szerver” 400 ms múlva válaszol, a nyitott menü frissül, töltés alatt preloader a mezőben */

const AsyncAutocomplete = (props: any) => {
  const search: string = useSelector(({ form }: any) => (form[FORM] || {})[props.id]) || '';
  const [data, setData] = useState<DemoProduct[]>([]);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    const term = search.toLowerCase();

    setLoading(!!term);

    const timer = setTimeout(
      () => {
        setData(term ? PRODUCTS.filter(record => filterProduct(record, term)) : []);
        setLoading(false);
      },
      400,
    );

    return () => clearTimeout(timer);
  }, [search]);

  // preload (FormField): spinner instead of the postfix (arrow) while loading
  return <Autocomplete {...props} data={data} filter={false} preload={isLoading} />;
};

export const Async: Story = {
  args: {
    id: 'product-async',
  },
  render: args => <AsyncAutocomplete {...args} />,
};

Async.storyName = 'Aszinkron adat (API szimuláció)';
