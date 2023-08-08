
import React from 'react';
import { connect, useDispatch } from 'react-redux';


/* !- React Actions */

import {
  preload,
  dialog,
  modal,
  sidebar,
  fullscreen,
  popover,
  tooltip,
  menu,
  contextMenu,

  flush,
  close,
  hide,
} from '../../../src/layer/actions';


/* !- React Elements */

import CalendarMonthInterval from '../../../src/form/pure/calendarMonthInterval';
import IconLogout from '../../../src/icon/mui/action/lock';
import Tooltip from '../../../src/layer/tooltip';
import Info from '../../../src/layer/info';
import IconInfo from '../../../src/icon/mui/action/info';

const PopoverComponent = () =>
(
  <div style={{ width: '200px', height: '200px' }}>
    Hello world
  </div>
);

const DialogComponent = () =>
(
  <div>Hello Dialog!</div>
);


/**
 * Example Component
 */
const Example = () =>
{
  const dispatch = useDispatch();

  const onClickPreloadHandler = (element) =>
  {
    dispatch(preload(element));
    setTimeout(() => dispatch(hide()), 3 * 1000);
  }

  const onClickMenuHandler = ({ id, title }) =>
  {
    console.log(id, title);
    dispatch(flush());
  };

  const menuProps = {
    label: <div className="text-s text-center text-blue-dark p-2">Label of Menu</div>,
    items: [
      { id: 1, title: 'one', handler: onClickMenuHandler },
      { id: 2, title: 'two', icon: IconLogout, handler: onClickMenuHandler },
      { id: 3, title: 'three', handler: onClickMenuHandler },
      { id: 4, title: 'four', handler: onClickMenuHandler },
      { id: 5, title: 'five', handler: onClickMenuHandler },
    ],
  };

  const modalProps = {
    title: 'Title of Modal',
    content: 'Content of Modal',
    icon: IconLogout,
    className: 'green',
    button: {
      title: 'Primary',
      handler: () => dispatch(flush()),
    },
    buttonSecondary: {
      title: 'Secondary',
      handler: () => dispatch(modal(modalProps)),
    },
  };

  const sidebarProps = {
    position: 'right'
  };

  return (
    <div className="p-2">
      <h1>Layer actions</h1>

      <h2>Preload</h2>
      <button className="outline gray w-auto" onClick={() => onClickPreloadHandler()}>Preload</button>
      <br />
      <button className="outline gray w-auto" onClick={() => onClickPreloadHandler(<div className="preloader two-balls" />)}>Custom preload</button>
      <br />
      <button className="outline gray w-auto" onClick={event => onClickPreloadHandler(event)}>Positioning Preload</button>

      <h2>Dialog</h2>
      <button
        className="outline gray w-auto"
        onClick={() => {
          dispatch(dialog(DialogComponent, { onClose: () => true }));
        }}
      >
        Dialog
      </button>

      <h2>Modal</h2>
      <button className="outline gray w-auto" onClick={() => dispatch(modal(modalProps))}>Modal</button>
      <br />

      <h2>Sidebar</h2>
      <button
        className="outline gray w-auto"
        onClick={() => dispatch(sidebar(
          <div className="bg-red" style={{ width: '200px' }}>right</div>,
          sidebarProps,
        ))}
      >
        Sidebar
      </button>
      <br />

      <h2>Sidebar Left no curtain</h2>
      <button className="outline gray w-auto" onClick={() => dispatch(sidebar(<div className="bg-red" style={{ width: '200px' }}>right</div>, { position: 'left', bodyClass: 'hide:curtain' }))}>Sidebar</button>
      <br />

      <h2>Fullscreen</h2>
      <button className="outline gray w-auto" onClick={() => dispatch(fullscreen(DialogComponent))}>Fullscreen</button>

      

      <h2>Popover</h2>
      <button
        className="outline gray w-auto"
        onClick={event => dispatch(popover(<PopoverComponent />, event))}
      >
        Popover
      </button>

      <h2>Popover</h2>
      <button
        className="outline gray w-auto"
        onClick={event => dispatch(popover(<div>hello</div>, event))}
      >
        Popover
      </button>

      <h2>Popover</h2>
      <button
        className="outline gray w-auto"
        onClick={event => dispatch(popover('hello', event))}
      >
        Popover
      </button>

      

      <h2>Tooltip</h2>
      <button
        className="outline gray w-auto"
        onClick={event => dispatch(tooltip(PopoverComponent, event))}
      >
        Tooptip
      </button>

      <Tooltip title={<div>Hello tooltip</div>}>
        <div className="button outline gray w-auto inline-block">Tooltip component</div>
      </Tooltip>

      <Tooltip title={<div>Hello tooltip</div>}>
        <IconInfo className="w-2 h-2 bg-gray-dark circle fill-white no-events" />
      </Tooltip>

      <Info title={<div>Hello tooltip</div>} />

      <h2>Menu</h2>
      <button className="outline gray w-auto" onClick={event => dispatch(menu(menuProps, event))}>Menu</button>
      <div className="mt-2 inline-block text-gray no-select border-bottom border-dashed" onContextMenu={event => dispatch(contextMenu(menuProps, event))}>ContextMenu</div>


      <h2>Overwrite Popover</h2>

      <button
        className="outline gray w-auto"
        onClick={event => dispatch(popover(
          <div className="w-screen text-center bg-red text-white">hello</div>,
          {},
          {
            className: 'no-close no-padding',
            containerStyle: { borderRadius: '0px', top: '0px' },
          }
        ))}
      >
        Popover
      </button>


      <h2>Overwrite Dialog</h2>

      <button
        className="outline gray w-auto"
        onClick={event => dispatch(dialog(
          () =>
            <div className="w-screen text-center bg-red text-white">hello</div>,
          {
            className: 'no-close no-padding',
            containerStyle: { borderRadius: '0px', top: '0px' },
          }
        ))}
      >
        Dialog
      </button>



    </div>
  );
};


export default Example;

// export default connect(
//   null,
//   {
//     ...LayerActions,
//   },
// )(
//   Example,
// );