import React from 'react';

import ViewTab from '../../../src/view/viewTab';


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
];


const Example = () =>
(
  <ViewTab
    className="border p-1"
    classNameButtons="flex"
    classNameButton="w-auto yellow"
    classNameButtonActive="w-auto green"
    items={TABS}
  />
);

export default Example;
