import React from 'react';
import { useDispatch } from 'react-redux';


/* !- Redux Actions */

import Actions from '../../../src/view/actions';


/* !- React Elements */

import WrapperTester from '../wrapperTester';

import View from '../../../src/view/view';
// import Grid from '../../../src/grid/pure/grid';
// import Connect from '../../../src/form/connect';
// import { Collection } from '../../../src/form/intl';

// import { Example2 } from '../form/collection';

// import IconEdit from '../../../src/icon/mui/content/create';
// import IconClose from '../../../src/icon/mui/navigation/arrow_back';


import ViewButton from '@1studio/ui/view/viewButton';
// import ViewButtons from '@1studio/ui/view/viewButtons';
import ViewButtons from '../../view/viewButtons';
import ViewTab from '@1studio/ui/view/viewTab';
import ViewTabNavigation from '@1studio/ui/view/viewTabNavigation';
import IconPrev from '@1studio/ui/icon/mui/navigation/arrow_back';

const exampleGridData = 
  [{"id":"141171","invoiceNumber":"T007725\/21","invoicingDate":"2021-10-19","paymentDate":"2021-10-17","priceGross":"15000"},{"id":"141851","invoiceNumber":"T007956\/21","invoicingDate":"2021-10-27","paymentDate":"2021-10-26","priceGross":"18850"}];

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



export const ExampleActions = ({ className }) =>
{
  const dispatch = useDispatch();

  const onClickSetSettingsHandler = () =>
  {
    dispatch(Actions.setSettings({
      active: 'group1',
      groups: {
        group1: [
          {
            id: 'box_1_1',
            pos: 0,
            status: 1,
          }
        ],
        group2: [
          {
            id: 'box_2_1',
            pos: 0,
            status: 1,
          },
          {
            id: 'box_2_2',
            pos: 1,
            status: 1,
          }
        ]
      }
    }));
  }

  const onClickAddSettingsHandler = () =>
  {
    dispatch(Actions.addSettings({
      groups: {
        group1: [
          {
            id: 'box_1_2',
            pos: 1,
            status: 1,
          },
        ],
        group3: [
          {
            id: 'box_3_1',
            pos: 0,
            status: 1,
          },
        ],
      }
    }));
  }

  const onClickRemoveSettingsHandler = () =>
  {
    dispatch(Actions.removeSettings({
      groups: {
        group1: []
      }
    }));
  }

  const onClickSetViewsHandler = () =>
  {
    dispatch(Actions.setViews([{ id: 'box_1_3', pos: 0, status: 1 }], 'group1'))
  }

  const onClickSwitchGroupHandler = () =>
  {
    dispatch(Actions.switchGroup('group2'));
  }

  const onClickToggleViewHandler = () =>
  {
    dispatch(Actions.toggleView('box_1_1'));
  }

  const onClickSwitchViewHandler = () =>
  {
    dispatch(Actions.switchView('box_2_1', 'group2'));
  }

  const onClickSwapViewHandler = () =>
  {
    dispatch(Actions.swapView());
  }

  const buttonClassName = 'secondary w-content mb-1 mx-1'

  return (
    <div className={className}>
      <button className={buttonClassName} onClick={onClickSetSettingsHandler}>setSettings</button>

      <button className={buttonClassName} onClick={onClickAddSettingsHandler}>addSettings</button>

      <button className={buttonClassName} onClick={onClickRemoveSettingsHandler}>RemoveSettings</button>

      <button className={buttonClassName} onClick={onClickSetViewsHandler}>setViews</button>

      <button className={buttonClassName} onClick={onClickSwitchGroupHandler}>switchGroup</button>

      <button className={buttonClassName} onClick={onClickToggleViewHandler}>toggleView</button>

      <button className={buttonClassName} onClick={onClickSwitchViewHandler}>switchView</button>

      <button className={buttonClassName} onClick={onClickSwapViewHandler}>swapViewHandler</button>
    </div>
  )
}


const ViewBasic = () =>
{
  const boxClassName = "m-2 p-2 uppercase border bg-gray-light";

  return (
    <div className='grid'>

      <div className="col-1-2">
        <div className="text-gray uppercase mb-2">
          actions
        </div>

        <ExampleActions className="grid" />
      </div>

      <View
        // defaultView="group1"
        settings={{
          active: 'group1', // like defaultView
          groups: {
            group1: [
              { id: 'box_1_1', pos: 0, status: 1 },
              { id: 'box_1_2', pos: 1, status: 1 },
            ],
            group2: [
              { id: 'box_2_1', pos: 0, status: 1 },
            ],
          }
        }}
        className="col-1-2"
      >
        <div data-view="box_1_1" className={boxClassName}>Box 1.1</div>
        <div data-view="box_1_2" className={boxClassName}>Box 1.2</div>
        <div data-view="box_1_3" className={boxClassName}>Box 1.3</div>
        <div data-view="box_2_1" className={boxClassName}>Box 2.1</div>
        <div data-view="box_2_2" className={boxClassName}>Box 2.2</div>
        <div data-view="box_3_1" className={boxClassName}>Box 3.1</div>
      </View>
    </div>
  )

  // tab
  return (
    <div>
      {/* <ActionsExample /> */}
      {/* <ViewButtons /> */}
      {/* <ViewButtons id="old" /> */}
      {/* <ViewButtons id="new2" /> */}
      {/* <WrapperTester>
        <ViewTab
          className="border p-1"
          classNameButtons="flex"
          classNameButton="w-auto yellow"
          classNameButtonActive="w-auto green"
          items={TABS}
        />
      </WrapperTester> */}

      {/* <ViewButton id="Grid">
        <span>Show/hide data/Grid component</span>
      </ViewButton> */}

      {/* <h2>Custom tab without lazyload</h2> */}

      {/* <ConnectedTabs /> */}
      
      {/* <View
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
      </View> */}

      {/* <h2>Tab show all</h2>

      <ViewTab
        // className="border p-1"
        classNameButtons="grid-2"
        classNameButton="button w-auto"
        classNameButtonActive="button w-auto green"
        items={TABS}
        showAllLabel="Show all"
      /> */}


      {/* <h2>Tab navigation</h2>


      <WrapperTester>
      <div className="flex col-1-2">
        <ViewTabNavigation
          // id="tab"
          direction={-1}
          label={({ views, nextIndex }) => (
            <span>
              <IconPrev className="h-1 w-1" />
              <span>{`Go to ${views[nextIndex]?.title || ''}`}</span>
            </span>
          )}
        />
        <ViewTabNavigation />

      </div>
      </WrapperTester> */}


    </div>
  )



  // return (
  //   <div>
  //     <View
  //       id='sample-view'
  //       defaultView='group1'
  //       settings={{
  //         groups: {
  //           group1: [
  //             { id: 'grid', pos: 0, status: 1 },
  //             { id: 'form', pos: 1, status: 0 },
  //           ],
  //           group2: [
  //             { id: 'hidden', pos: 0, status: 1 }
  //           ],
  //         }
  //       }}
  //       >
  //       <div
  //         data-view="form"
  //       >

  //         <div
  //           className="button outline w-auto shadow inline-block yellow"
  //           onClick={onClickSwitchViewHandler}
  //         >
  //           <IconClose />
  //           <span>Close</span>
  //         </div>

  //         <div className="mt-2 text-xs h-center w-full pb-1" style={{ paddingRight: '5rem' }}>
  //           <div className="col-1-6">Azonosító</div>
  //           <div className="col-1-6">Száma száma</div>
  //           <div className="col-1-6">Számla kelte</div>
  //           <div className="col-1-6">Fizetés ideje</div>
  //           <div className="col-1-6">Bruttó összeg</div>
  //           <div className="col-1-6 col-br">Fizetés módja</div>
  //         </div>

  //         <Collection
  //           form="exampleForm"
  //           id="grid"
  //           UI={Example2}
  //           value={exampleGridData}
  //         />

  //       </div>
  //       <div
  //         data-view="grid"
  //       >
  //         <div
  //           className="button outline w-auto shadow inline-block yellow"
  //           onClick={onClickSwitchViewHandler}
  //         >
  //           <IconEdit />
  //           <span>Edit</span>
  //         </div>

  //         <Connect 
  //           id="exampleForm"
  //           listen="grid"
  //           UI={({ grid }) => (
  //             <Grid
  //               data={grid || exampleGridData}
  //               className="text-s mb-6"
  //               hook={{
  //                 invoiceNumber: 'Invoice Number',
  //                 priceGross: {
  //                   title: 'Gross',
  //                   format: ({ value }) => `${value} HUF`, 
  //                 },
  //               }}
  //             />
  //           )}
  //         />
  //       </div>
  //       <div
  //         data-view="hidden"
  //       >
  //         c
  //       </div>
  //     </View>
  //   </div>
  // );
};

export default ViewBasic;
