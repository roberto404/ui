import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage, formatMessage, injectIntl } from 'react-intl';
import {
  withRouter,
  Link,
} from 'react-router-dom';

import capitalizeFirstLetter from '@1studio/utils/string/capitalizeFirstLetter';
import Application from '@1studio/utils/models/application';

/* !- Redux Actions */

import {
  flush,
  fullscreen,
  preload,
  dialog,
  menu,
} from '@1studio/ui/layer/actions';

import {
  setUser,
  logout,
} from '@1studio/ui/authentication/actions';


/* !- React Elements */

import IconHamburger from '@1studio/ui/icon/la/bars';
import IconLock from '@1studio/ui/icon/mui/action/lock';
import IconSwitch from '@1studio/ui/icon/mui/action/swap_horiz';
import IconNotification from '@1studio/ui/icon/la/bell';
import IconEmail from '@1studio/ui/icon/la/envelope';
import Grid from '@1studio/ui/grid/pure/grid';


/* !- Constants */

import { getRoutes } from '../routes';

const Header = ({
  menu,
  preload,
  dialog,
  flush,
  fullscreen,
  isLogged,
  permission,
  logout,
  setUser,
  intl,
  userName,
  account,
  accounts,
  history,
  projectTitle,
},
{
  api,
}) =>
{
  const title = (getRoutes().find(({ path }) => path === location.pathname) || {}).title;
  // const title = location.pathname.replace(/^\/([^/]*).*/, '$1');

  const onClickHamburgerHandler = () =>
  {
    history.push('/');
  };

  const onClickLogoutHandler = () =>
  {
    flush();
    logout();
  };


  const onClickAccountHandler = (username) =>
  {
    preload();
    api({
      method: 'switchAccount',
      payload: { username },
    })
      .then(({ records }) =>
      {
        setUser(records);
        history.push('/');
        flush();
      });
  };

  const onClickSwitchAccountHandler = () =>
  {
    const data = accounts.map((username, id) => ({ id, username }));

    const GridRow = ({ data, className }) =>
    (
      <div className={`mx-2 p-2 rounded ${className}`} onClick={() => onClickAccountHandler(data.username)}>
        <div className="avatar border-double-gray zoom-2.5">
          <span>{data.username.charAt(0)}</span>
        </div>
        <div className="pt-2 text-center">{data.username}</div>
      </div>
    );

    dialog(
      <Grid
        rowElement={GridRow}
        selectable
        showHeader={false}
        data={data}
        bodyClassName="tbody infinity flex"
      />,
    );
  };

  let formattedTitle = '';

  if (title)
  {
    formattedTitle = capitalizeFirstLetter(intl.formatMessage({ id: title }));
    Application.setPageTitle(`${formattedTitle} | ${projectTitle}`);
  }

  const badge = {
    position: 'absolute',
    width: '1rem',
    height: '1rem',
    border: '2px solid white',
    top: '-0.3rem',
    right: '-0.35rem',
    // background: '#ff00ab',
    borderRadius: '100%',
  };


  /* !- React Elements */

  /**
   * Avatar Menu Heading
   */
  const profile =
  (
    <div className="p-2 text-center">
      <div className="mb-2 avatar border-double-gray zoom-2">
        <span>{userName.charAt(0)}</span>
      </div>
      <div className="text-s">{userName}</div>
      <div className="pt-1/2 text-xs text-gray">{account}</div>
    </div>
  );

  /**
   * Avatar Menu Props
   */
  const avatarMenu = {
    label: profile,
    items: [
      { id: 1, title: 'Kilépés', icon: IconLock, handler: onClickLogoutHandler },
    ],
  };

  if (accounts.length > 1)
  {
    avatarMenu.items.unshift(
      { id: 2, title: 'Felhasználó váltás', icon: IconSwitch, handler: onClickSwitchAccountHandler },
    );
  }

  return (
    <div
      className="grid grid-center bg-white-light py-1 border-bottom border-2"
      style={{ borderColor: 'rgba(232, 236, 239, 0.5)' }}
    >

      {/* LEFT */}

      { title &&
      <div className="w-4 text-center">
        <IconHamburger className="fill-gray" style={{ width: '1.5rem' }} onClick={onClickHamburgerHandler} />
      </div>
      }

      <div className="w-auto grow px-1 text-black text-m">
        {formattedTitle}
      </div>

      {/* RIGHT */}

      <div className="w-auto mx-1 relative">
        <IconEmail className="h-2 fill-gray" />
        <div style={badge} className="bg-red" />
      </div>

      <div className="w-auto mx-2 relative">
        <IconNotification className="h-2 fill-gray" />
        <div style={badge} className="bg-green" />
      </div>

      <div className="w-4 mx-2 text-center">
        <div className="avatar border-double-gray" onClick={e => menu(avatarMenu, e)}>
          <span>{userName.charAt(0)}</span>
        </div>
      </div>
    </div>
  );
};

Header.contextTypes =
{
  api: PropTypes.func,
};


export default injectIntl(withRouter(connect(
  ({ user }) => ({
    userName: user.name,
    account: user.username,
    accounts: user.accounts,
  }),
  {
    preload,
    dialog,
    fullscreen,
    flush,
    menu,
    logout,
    setUser,
  },
)(Header)));
