import React from 'react';
import { Meta, StoryObj } from '@storybook/react';


/* !- Compontents */

import ViewTabNavigation from '../../view/viewTabNavigation';


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
  title: 'View/TabNavigation',
  component: ViewTabNavigation,
  // argTypes: {
  // },
} satisfies Meta<typeof ViewTabNavigation>;

export default meta;


type Story = StoryObj<typeof meta>;


/* !- Basic */

// export const ViewTab1: Story = 
// {
//   args: {
//     className: "border p-1",
//     classNameButtons: "flex",
//     classNameButton: "w-auto yellow",
//     classNameButtonActive: "w-auto green",
//     items: TABS,
//   },
//   parameters: {
//     docs: {
//       source: { type: 'code' }, // forces the raw source code (rather than the rendered JSX).
//     },
//   },
// }


export const ViewTabNavigation1: Story = () =>
(
  <ViewTabNavigation
    id="tab"
    direction={-1}
    label={({ views, nextIndex }) => {
      return (
        <span>
          <IconPrev className="h-1 w-1" />
          <span>{`Go to ${views[nextIndex].title}`}</span>
        </span>
      );
    }}
  />
)


ViewTabNavigation1.storyName = 'Basic';
