
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import classNames from 'classnames';


/* !- Actions */

import { toggleView, switchView } from './actions';


/* !- Elements */

import IconView from '../icon/mui/av/web';


/* !- Constants */


/* !- Types */

const defaultProps = {
  children: <IconView className="w-1 h-1" />,
  className: "pointer inline-block button w-auto shadow",
  classNameActive: "bg-blue-dark border border-2 border-white fill-white",
  classNameInactive: "outline",
  recursive: false,
}

type PropTypes =
{
  id: string,
  group?: string,
} & typeof defaultProps;


const ViewButtonComponent = ({
  id,
  group,
  children,
  className,
  classNameActive,
  classNameInactive,
  recursive,
}: PropTypes) =>
{
  const status = useSelector((state) =>
  {
    const viewGroup = state.view.groups[group || state.view.active] || [];
    const view = viewGroup.find(view => view.id === id) || {};

    return !!view.status;
  });

  const dispatch = useDispatch();

  const buttonClassName = classNames({
    'pointer': true,
    [className]: true,
    [classNameInactive]: !status,
    [classNameActive]: status
  });

  const onClickHandler = () =>
    recursive ?
      dispatch(switchView(id, group)) : dispatch(toggleView(id, null, group));

  return (
    <div
      role="button"
      tabIndex={-1}
      onClick={onClickHandler}
      className={buttonClassName}
    >
      {children}
    </div>
  );
};

ViewButtonComponent.defaultProps = defaultProps;

export default ViewButtonComponent;