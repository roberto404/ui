import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import produceNumericArray from '@1studio/utils/array/produceNumericArray';

require('../../../assets/style/index.scss');


/* !- Compontents */

import Grid from '../../grid';
import GridRow from '../../.examples/grid/row';
import { useSummaryHandler } from '../../grid/components/handlers/summary';


/* !- Context (a Grid useAppContext-et hív: shortcutok, listenerek) */

import withGridContext from './withGridContext';


/* !- Constants */

import { DATA, SETTINGS } from '../../.examples/grid/constants';


/* !- Stories */

const meta = {
  title: 'Grid/Grid',
  component: Grid,
  decorators: [withGridContext],
} satisfies Meta<typeof Grid>;

export default meta;


type Story = StoryObj<typeof meta>;


/* !- Basic Grid */

export const Grid1: Story = {
  args: {
    data: DATA,
    hook: SETTINGS.hook,
    helper: SETTINGS.helper,
    className: "card grid column",
  },
}

Grid1.storyName = 'Basic';


/* !- Grid with custom Row compontent */

export const Grid2: Story = {
  args: {
    data: DATA,
    showHeader: false,
    rowElement: GridRow,
  },
}

Grid2.storyName = 'Custom Row';


/* !- Rendezés + kattintás (a fejléc / cella kattintás a konzolra ír) */

export const Order: Story = {
  args: {
    className: 'card grid column',
    data: DATA.slice(0, 5),
    hook: SETTINGS.hook,
    helper: SETTINGS.helper,
    orderColumn: 'gender',
    orderDirection: 'desc',
    onClickCell: (record: any, index: any) => console.log('onClickCell', record, index),
    onChangeOrder: (columnId: string) => console.log('onChangeOrder', columnId),
  },
};

Order.storyName = 'Rendezés + kattintás';


/* !- Fix fejléc (height kötelező) */

export const FreezeHeader: Story = {
  args: {
    data: DATA,
    hook: SETTINGS.hook,
    helper: SETTINGS.helper,
    height: '300px',
    freezeHeader: true,
  },
};

FreezeHeader.storyName = 'Fix fejléc';


/* !- Infinity (ReactList, 1000 sor) */

export const InfinityScroll: Story = {
  args: {
    data: produceNumericArray(0, 1000, (i: number) => ({ id: i, name: `${i}. sor` })),
    height: '300px',
    freezeHeader: true,
    infinity: true,
  },
};

InfinityScroll.storyName = 'Infinity (1000 sor)';


/* !- Kijelölhető (többes kijelölés, nyilak, shift) */

export const Selectable: Story = {
  args: {
    id: 'story-grid-selectable',
    className: 'grid column no-select',
    data: DATA.slice(0, 5),
    selectable: true,
  },
};

Selectable.storyName = 'Kijelölhető';


/* !- ExpandSelect: a kattintás kijelöl (nem kell ctrl/shift) */

export const ExpandSelect: Story = {
  args: {
    id: 'story-grid-expand-select',
    className: 'grid column no-select',
    data: DATA.slice(0, 5),
    selectable: true,
    expandSelect: true,
  },
};

ExpandSelect.storyName = 'Kijelölés kattintással';


/* !- Checkbox kijelölés */

export const CheckboxSelect: Story = {
  args: {
    id: 'story-grid-checkbox-select',
    className: 'grid column no-select',
    data: DATA.slice(0, 5),
    selectable: true,
    expandSelect: true,
    checkboxSelect: true,
  },
};

CheckboxSelect.storyName = 'Checkbox kijelölés';


/* !- Shortcut (Shift+Enter: oszlop összesítő) */

const SummaryShortcutGrid = (props: any) => {
  const { SummaryHandler } = useSummaryHandler();

  return (
    <div>
      <p className="text-s text-gray mb-2">Jelölj ki sorokat, majd Shift+Enter: összesítő a kijelölt oszlopról.</p>
      <Grid
        {...props}
        shortcuts={[
          {
            keyCode: 'SHIFT+ENTER',
            handler: SummaryHandler,
            description: 'Összesítő',
          },
        ]}
      />
    </div>
  );
};

export const Shortcuts: Story = {
  render: (args) => <SummaryShortcutGrid {...args} />,
  args: {
    id: 'story-grid-shortcuts',
    className: 'grid column no-select',
    data: DATA.slice(0, 5),
    hook: { name: 'Name', visits: 'Visits', time: 'Time' },
    selectable: true,
  },
};

Shortcuts.storyName = 'Shortcut (összesítő)';


/* !- Freeze panes (CSS: rögzített első sor és oszlop) */

export const FreezePanes: StoryObj = {
  render: () => (
    <div className="relative border freezePanes" style={{ width: 320, height: 240 }}>
      <div>
        <div>
          <div className="bg-gray-dark bold">#</div>
          <div className="bg-gray">RS2 Áruház</div>
          <div className="bg-gray">RS6 Áruház</div>
          <div className="bg-gray">RS8 Áruház</div>
          <div className="bg-gray">Web</div>
          <div className="bg-gray">RS</div>
        </div>
        {produceNumericArray(0, 24).map((row: number) => (
          <div key={row}>
            <div>{row}. sor</div>
            <div>{row * 1}</div>
            <div>{row * 2}</div>
            <div>{row * 3}</div>
            <div>{row * 4}</div>
            <div>{row * 5}</div>
          </div>
        ))}
      </div>
    </div>
  ),
};

FreezePanes.storyName = 'Freeze panes';
