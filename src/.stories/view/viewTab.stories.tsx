import React from 'react';
import { Meta, StoryObj } from '@storybook/react';


/* !- Compontents */

import ViewTab from '../../view/viewTab';


/* !- Constants */

const TABS = [
  {
    title: 'foo',
    children: <div>foo</div>,
    status: 1,
  },
  {
    title: 'bar',
    children: <div>bar</div>,
    status: 0,
  },
  {
    title: 'baz',
    children: <div>baz</div>,
    status: 0,
  },
  {
    title: 'qux',
    children: <div>qux</div>,
    status: 0,
  },
];


/* !- Stories */

const meta = {
  title: 'View/Tab',
  component: ViewTab,
  // argTypes: {
  // },
} satisfies Meta<typeof ViewTab>;

export default meta;


type Story = StoryObj<typeof meta>;


/* !- Basic */

export const ViewTab1: Story = 
{
  args: {
    className: "border p-1",
    classNameButtons: "flex",
    classNameButton: "w-auto yellow",
    classNameButtonActive: "w-auto green",
    items: TABS,
  },
  parameters: {
    docs: {
      source: { type: 'code' }, // forces the raw source code (rather than the rendered JSX).
    },
  },
}

// export const ViewTab1: Story = () =>
// (
//   <ViewTab
//     className="border p-1"
//     classNameButtons="flex"
//     classNameButton="w-auto yellow"
//     classNameButtonActive="w-auto green"
//     items={TABS}
//   />
// )

ViewTab1.storyName = 'Basic';

