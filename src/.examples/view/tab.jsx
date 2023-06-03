import React from 'react';
// import { connect } from 'react-redux';


/* !- Actions */

// import { switchView } from '../../../src/view/actions';


/* !- Elements */

// import ViewTabNavigation from '../../../src/view/viewTabNavigation';
import ViewTab from '../../../src/view/viewTab';
// import View from '../../../src/view';

// import Stepper from '../../../src/stepper/stepper';
// import Resize from '../../../src/resize';
// import StepTimeline from '../../../src/stepper/stepTimeline';
// import IconPrev from '../../../src/icon/mui/navigation/arrow_back';


/* !- Constants */

export const TABS = [
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



/**
 * [Tabs description]
 */
// const Tabs = ({ index, switchView }) =>
// (
//   <Stepper
//     data={[
//       {
//         label: 'foo',
//         status: index === 0 ? 'complete' : undefined,
//         onClick: () => switchView('tab-0'),
//       },
//       {
//         label: 'bar',
//         status: index === 1 ? 'complete' : undefined,
//         onClick: () => switchView('tab-1'),
//       },
//       {
//         label: 'baz',
//         status: index === 2 ? 'complete' : undefined,
//         onClick: () => switchView('tab-2'),
//       },
//       {
//         label: 'qux',
//         status: index === 3 ? 'complete' : undefined,
//         onClick: () => switchView('tab-3'),
//       },
//     ]}
//     type="numeric"
//   />
// );

// const ConnectedTabs = connect(
//   ({ view }) =>
//   {
//     const index = (view.groups[view.active] || []).findIndex(({ status }) => status);

//     return {
//       index,
//     };
//   },
//   {
//     switchView,
//   }
// )(Tabs);


const Example = () =>
(
  <div>
    <ViewTab
      className="border p-1"
      classNameButtons="flex"
      classNameButton="w-auto yellow"
      classNameButtonActive="w-auto green"
      items={TABS}
    />

    {/* <h2>Custom tab without lazyload</h2>

    <ConnectedTabs />
    <View
      id="tab"
      defaultView="tab"
      settings={{
        groups: {
          tab: TABS.map((item, n) => ({ id: `tab-${n}`, pos: n, ...item }))
        }
      }}
      lazyload={false}
    >
      { TABS.map((item, n) => <div key={n} data-view={`tab-${n}`}>{item.children}</div>) }
    </View>

    <h2>Tab show all</h2>

    <ViewTab
      // className="border p-1"
      classNameButtons="grid-2"
      classNameButton="button w-auto"
      classNameButtonActive="button w-auto green"
      items={TABS}
      showAllLabel="Show all"
    />


    <h2>Tab navigation</h2>

    <div className="flex col-1-2">
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
      <ViewTabNavigation />

    </div> */}

  </div>
);

export default Example;
