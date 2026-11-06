import React, { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';

require('../../../assets/style/index.scss');


/* !- Components */

import Toolbar from '../../toolbar/toolbar';
import Layer from '../../layer/layer';
import { AppContext } from '../../context';

import IconCart from '../../icon/mui/action/shopping_cart';
import IconDelete from '../../icon/mui/action/delete';
import IconDownload from '../../icon/mui/file/download';
import IconCard from '../../icon/mui/credit_card';
import IconSearch from '../../icon/mui/action/search';


/* !- Demo */

const layerContext = {
  addShortcuts: () => {},
  removeShortcuts: () => {},
};

type ButtonPropTypes = {
  title: string,
  icon: React.ElementType,
  onClick: (title: string) => void,
};

/**
 * A kontakt2 toolbar gomb szokásos markupja: ikon + kis felirat
 */
const Button = ({ title, icon, onClick }: ButtonPropTypes) => (
  <div className="text-center ml-2 border-left border-gray-light pl-2">
    <div
      className="pointer hover:bg-gray-light rounded p-1/4 text-line-0 inline-block fill-gray-dark"
      onClick={() => onClick(title)}
    >
      {React.createElement(icon, { className: 'w-2 h-2' })}
    </div>
    <div className="pt-2/3 text-xs light text-gray">{title}</div>
  </div>
);

/**
 * Nézetváltó csoport egy komponensben: a Több menüben gombonként külön sor,
 * az aktív pipát kap
 */
const ViewGroup = ({ onClick }: { onClick: (title: string) => void }) => {
  const [active, setActive] = useState('Lista');

  return (
    <div className="v-center ml-2 border-left border-gray-light pl-2">
      {[{ title: 'Lista', icon: IconCart }, { title: 'Csempe', icon: IconCard }].map(({ title, icon }) => (
        <div key={title} className="text-center">
          <div
            className={`pointer p-1/4 text-line-0 inline-block px-2 rounded ${active === title ? 'bg-blue-dark fill-white' : 'fill-gray'}`}
            onClick={() => { setActive(title); onClick(title); }}
          >
            {React.createElement(icon, { className: 'w-2 h-2' })}
          </div>
          <div className="pt-2/3 text-xs light text-gray">{title}</div>
        </div>
      ))}
    </div>
  );
};

const BUTTONS = [
  { title: 'Megrendelés', icon: IconCart },
  { title: 'Vásárlás', icon: IconCart },
  { title: 'Tervek', icon: IconDownload },
  { title: 'Kártya', icon: IconCard },
  { title: 'Letöltés', icon: IconDownload },
  { title: 'Ürítés', icon: IconDelete },
];

type DemoPropTypes = {
  width: number,
  searchWidth: number,
};

/**
 * Header sáv: bal oldalt a Toolbar, jobb oldalt a `.filters` (kereső).
 * A sáv jobb alsó sarka húzható.
 */
const Demo = ({ width, searchWidth }: DemoPropTypes) => {
  const [clicked, setClicked] = useState('');

  return (
    <div className="column gap-1">
      <div
        className="relative bg-white-dark border border-gray-light"
        style={{ width, height: '6rem', resize: 'horizontal', overflow: 'hidden', minWidth: 200 }}
      >
        <Toolbar
          className="bg-white absolute pin-l pin-t h-center no-select"
          style={{ height: '6rem', left: '1rem', position: 'absolute' }}
        >
          <div className="mr-2 border-right border-gray-light pr-2 ml-2 text-s nowrap">34 145 termék</div>

          {BUTTONS.map(button => (
            <Button key={button.title} {...button} onClick={setClicked} />
          ))}

          <ViewGroup onClick={setClicked} />
        </Toolbar>

        <div
          className="filters absolute pin-t h-center"
          style={{ height: '6rem', right: '1rem', position: 'absolute' }}
        >
          <div className="h-center gap-1 bg-white border border-gray-light rounded px-1" style={{ width: searchWidth, height: '4rem' }}>
            <IconSearch className="w-2 h-2 fill-gray" />
            <span className="text-s text-gray nowrap">Cikkszám vagy terméknév...</span>
          </div>
        </div>
      </div>

      <div className="text-s text-gray">
        Kattintás: <span className="bold text-black">{clicked || '–'}</span>
      </div>
    </div>
  );
};


/* !- Stories */

const meta = {
  title: 'Toolbar/Toolbar',
  component: Demo,
  decorators: [
    Story => (
      <AppContext.Provider value={layerContext as any}>
        <div className="p-4">
          <Story />
        </div>
        <Layer />
      </AppContext.Provider>
    ),
  ],
  argTypes: {
    width: { control: { type: 'range', min: 300, max: 1400, step: 10 } },
    searchWidth: { control: { type: 'range', min: 100, max: 600, step: 10 } },
  },
} satisfies Meta<typeof Demo>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Minden gomb kifér
 */
export const Default: Story = {
  args: {
    width: 1200,
    searchWidth: 300,
  },
};

/**
 * Szűk sáv: a kilógó gombok a Több menüben
 */
export const Overflow: Story = {
  args: {
    width: 760,
    searchWidth: 300,
  },
};
