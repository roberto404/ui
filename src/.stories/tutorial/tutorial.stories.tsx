import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Provider } from 'react-redux';
import Application from '@1studio/utils/models/application';

require('../../../assets/style/index.scss');


/* !- Components */

import Tutorial, { TutorialButton } from '../../tutorial';
import Notification from '../../notification';


/* !- Context (a lejátszó a redux store-hoz, a CTA az AppContext api-jához kötődik) */

import { AppContext } from '../../context';
import store from '../../store';
import { Status } from '../../apiType';

/* !- Types */

import { Tutorial as TutorialType } from '../../tutorial/types';


const TUTORIAL: TutorialType = {
  id: 1,
  status: 1,
  title: 'Rendelések',
  steps: [
    {
      title: 'Üdvözlünk!',
      description: 'Ez a rövid bemutató végigvezet a rendelések oldalán.\nCél elem nélkül középen jelenik meg.',
      dom: '',
      media: [],
      url: '',
      highlight: true,
    },
    {
      title: 'Keresés',
      description: 'Itt kereshetsz rendelésszámra vagy vevőnévre.',
      dom: 'order.search',
      media: [],
      url: '',
      highlight: true,
    },
    {
      title: 'Új rendelés',
      description: 'Kiemelés nélküli lépés: csak a buborék jelenik meg, a háttér nem sötétedik.',
      dom: 'order.add',
      media: [],
      url: '',
      highlight: false,
    },
    {
      title: 'Reszponzív cél',
      description: 'Ugyanaz a kulcs az asztali és a mobil menün is: mindig a látható kapja a buborékot (szűkítsd az ablakot).',
      dom: 'order.menu',
      media: [],
      url: '',
      highlight: true,
    },
    {
      title: 'Selector',
      description: 'A `dom` mező nyers CSS selector is lehet (itt: .story-footer button).',
      dom: '.story-footer button',
      media: [],
      url: '',
      highlight: true,
    },
  ],
};

const app = new Application();
const reduxStore = store();

// késleltetett válasz, hogy a TutorialButton `loading` állapota látsszon
const api = ({ url }: { url: string }) => new Promise(resolve => setTimeout(() => resolve(
  url === `tutorial/readOneToWebsite/${TUTORIAL.id}`
    ? { status: Status.SUCCESS, records: TUTORIAL }
    : { status: Status.ERROR, records: null },
), 800));

const withContexts = (Story: any) => (
  <Provider store={reduxStore}>
    <AppContext.Provider
      value={{
        store: reduxStore,
        api,
        addShortcuts: app.addShortcuts,
        removeShortcuts: app.removeShortcuts,
      }}
    >
      <Story />
      <Notification />
    </AppContext.Provider>
  </Provider>
);


/**
 * Minta oldal data-tutorial jelölésekkel
 */
const Page = ({ color, textColor }: { color?: string, textColor?: string }) => (
  <div className="p-2" style={{ minHeight: 900 }}>
    <Tutorial color={color} textColor={textColor} />

    <div className="flex h-center v-justify mb-2">
      <div className="h-center">
        <div className="bold text-l mr-1">Rendelések</div>
        <TutorialButton id={TUTORIAL.id} />
      </div>

      <div className="mobile:hidden" data-tutorial="order.menu">Asztali menü</div>
      <div className="desktop:hidden" data-tutorial="order.menu">☰</div>
    </div>

    <div className="flex h-center gap-1 mb-4">
      <input data-tutorial="order.search" className="border rounded p-1/2 grow" placeholder="Keresés..." />
      <button className="green" data-tutorial="order.add">Új rendelés</button>
    </div>

    <div className="border rounded p-2 mb-4 text-gray" style={{ height: 600 }}>
      Lista...
    </div>

    <div className="story-footer flex v-right">
      <button className="gray">Exportálás</button>
    </div>
  </div>
);


/* !- Stories */

const meta = {
  title: 'Tutorial/Tutorial',
  component: Page,
  decorators: [withContexts],
} satisfies Meta<typeof Page>;

export default meta;


type Story = StoryObj<typeof meta>;


/* !- CTA: az „Indítás” link betölti (mock api) és elindítja */

export const Default: Story = {};

Default.storyName = 'CTA (Indítás link)';


/* !- Egyedi szín: <Tutorial color textColor /> */

export const CustomColor: Story = {
  args: {
    color: '#1f2937',
    textColor: '#fde68a',
  },
};

CustomColor.storyName = 'Egyedi szín';
