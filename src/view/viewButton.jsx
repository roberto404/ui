
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';


/* !- Actions */

import { toggleView, switchView } from './actions';
import { menu, close } from '../layer/actions';


/* !- Elements */

import IconView from '../icon/mui/av/web';

/* !- Constants */

// ...


const ViewButtonComponent = ({
  id,
  group,
  status,
  children,
  className,
  classNameActive,
  classNameInactive,
  recursive,
  toggleView,
  switchView,
}) =>
{
  const buttonClassName = classNames({
    'pointer': true,
    [className]: true,
    [classNameInactive]: !status,
    [classNameActive]: status
  });

  const onClickHandler = () =>
    recursive ? switchView(id, group) : toggleView(id, null, group)

  return (
    <div
      role="button"
      tabIndex="-1"
      onClick={onClickHandler}
      className={buttonClassName}
    >
      {children}
    </div>
  );
};

ViewButtonComponent.defaultProps =
{
  className: "pointer inline-block button w-auto shadow",
  classNameInactive: "outline",
  classNameActive: "bg-blue-dark border border-2 border-white fill-white",
  children: <IconView className="w-1 h-1" />,
  recursive: false,
};


export default connect(
  (state, { id, group }) =>
  {
    const viewGroup = state.view.groups[group || state.view.active] || [];
    const view = viewGroup.find(view => view.id === id) || {};

    return {
      status: !!view.status,
    };
  },
  {
    toggleView,
    switchView,
  },
)(ViewButtonComponent);
