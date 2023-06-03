
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';


/* !- Actions */

import { toggleView } from './actions';
import { menu, close } from '../layer/actions';


/* !- Elements */

import IconView from '../icon/mui/av/web';

/* !- Constants */

// ...


const defaultProps =
{
  children: (
    <div
      className="button w-auto outline shadow embed-angle-down-gray"
    >
      <IconView />
      <span>Nézet</span>
    </div>
  ),
  className: '',
};

type PropTypes =
{
  group?: string,
} & typeof defaultProps;


const ViewMenuComponent = ({
  group,
  className,
  children,
}: PropTypes) =>
{
  const views = useSelector(({ view }) =>
    view.active !== undefined ?
      view.groups[group || state.view.active] : []
  )

  const dispatch = useDispatch();


  const items = views.map(({ id, status, title, icon }) => ({
    id,
    title: title || id,
    className: parseInt(status) === 1 ? 'active' : '',
    icon,
    handler: (item) =>
    {
      dispatch(toggleView(item.id, undefined, group));
      dispatch(close());
    },
  }));

  const onClickButtonHandler = (event) =>
  {
    dispatch(menu({ items }, event));
  }

  return (
    <div
      role="button"
      tabIndex={-1}
      onClick={onClickButtonHandler}
      className={className}
    >
      {children}
    </div>
  );
};

ViewMenuComponent.defaultProps = defaultProps;


export default ViewMenuComponent;