
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';


/* !- Actions */

import { toggleView } from './actions';
import { menu, close } from '../layer/actions';


/* !- Elements */

import IconView from '../icon/mui/av/web';

/* !- Constants */

// ...


const ViewMenuComponent = ({ children, views, toggleView, menu, close, className, group }) =>
{
  const items = views.map(({ id, status, title, icon }) => ({
    id,
    title: title || id,
    className: parseInt(status) === 1 ? 'active' : '',
    icon,
    handler: (item) =>
    {
      toggleView(item.id, undefined, group);
      close();
    },
  }));

  return (
    <div
      role="button"
      tabIndex="-1"
      onClick={event => menu({ items }, event)}
      className={className}
    >
      {children}
    </div>
  );
};

ViewMenuComponent.defaultProps =
{
  views: [],
  children: (
    <div
      className="button w-auto outline shadow embed-angle-down-gray"
    >
      <IconView />
      <span>Nézet</span>
    </div>
  ),
};

export default connect(
  (state, { group }) =>
  {
    if (state.view.active !== undefined)
    {
      return {
        views: state.view.groups[group || state.view.active],
      };
    }
    return {
      views: [],
    };
  },
  {
    close,
    menu,
    toggleView,
  },
)(ViewMenuComponent);
