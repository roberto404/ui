
import React from 'react';
import { connect } from 'react-redux';

/* !- React Elements */

import LayerActions from '@1studio/ui/layer/actions';

import IconLogout from '@1studio/ui/icon/mui/action/lock';


/**
 * Example Component
 */
const Example = ({
  dialog,
  fullscreen,
  sidebar,
  popover,
  show,
  hide,
  toggle,
  flush,
  modal,
  preload,
  menu,
}) =>
{
  const onClickMenuHandler = ({ id, title }, event) =>
  {
    console.log(id, title, event);
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

  return (
    <div className="p-2">
      <h1>Layer actions</h1>
      <h2>Menu</h2>
      <button className="outline gray w-auto" onClick={event => menu(menuProps, event)}>Menu</button>
    </div>
  );
}


export default connect(
  null,
  {
    ...LayerActions,
  },
)(
  Example,
);
