
import React from 'react';
import { connect } from 'react-redux';


/* !- React Actions */

import * as LayerActions from '../../../src/layer/actions';


/* !- React Elements */

import CalendarMonthInterval from '../../../src/form/pure/calendarMonthInterval';
import IconLogout from '../../../src/icon/mui/action/lock';
import Tooltip from '../../../src/layer/tooltip';


const PopoverComponent = () =>
(
  <div style={{ width: '200px', height: '200px' }}><CalendarMonthInterval /></div>
);

const DialogComponent = () =>
(
  <div>Hello Dialog!</div>
);


/**
 * Example Component
 */
const Example = ({
  dialog,
  fullscreen,
  sidebar,
  popover,
  tooltip,
  show,
  hide,
  toggle,
  flush,
  modal,
  preload,
  menu,
}) =>
{
  const onClickPreloadHandler = (element) =>
  {
    preload(element);
    setTimeout(() => hide(), 3 * 1000);
  }

  const onClickMenuHandler = ({ id, title }) =>
  {
    console.log(id, title);
    flush();
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
      handler: () => flush(),
    },
    buttonSecondary: {
      title: 'Secondary',
      handler: () => modal(modalProps),
    },
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
      <button className="outline gray w-auto" onClick={() => dialog(DialogComponent)}>Dialog</button>

      <h2>Modal</h2>
      <button className="outline gray w-auto" onClick={() => modal(modalProps)}>Modal</button>
      <br />

      <h2>Fullscreen</h2>
      <button className="outline gray w-auto" onClick={() => fullscreen(DialogComponent)}>Fullscreen</button>

      <h2>Popover</h2>
      <button
        className="outline gray w-auto"
        onClick={event => popover(PopoverComponent, event)}
      >
        Popover
      </button>

      <h2>Tooltip</h2>
      <button
        className="outline gray w-auto"
        onClick={event => tooltip(PopoverComponent, event)}
      >
        Tooptip
      </button>

      <Tooltip title={<div>Hello tooltip</div>}>
        <div className="button outline gray w-auto inline-block">Tooltip component</div>
      </Tooltip>

      <h2>Menu</h2>
      <button className="outline gray w-auto" onClick={event => menu(menuProps, event)}>Menu</button>


      <h2>Overwrite Popover</h2>

      <button
        className="outline gray w-auto"
        onClick={event => popover(
          () =>
            <div className="w-screen text-center bg-red text-white">hello</div>,
          {},
          {
            className: 'no-close no-padding',
            containerStyle: { borderRadius: '0px', top: '0px' },
          }
        )}
      >
        Popover
      </button>


    </div>
  );
};


export default connect(
  null,
  {
    ...LayerActions,
  },
)(
  Example,
);
