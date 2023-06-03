
import React from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import isEqual from 'lodash/isEqual';


/* !- Actions */

import { switchView, toggleView } from './actions';


/* !- Selectors */

import { getViewGroup } from './reducers';


/* !- React Components */

// ...


/* !- Constants */

// ...

/* !- Types */

const defaultProps =
{
  classNameButton: 'w-auto',
  classNameButtonActive: 'w-auto active',
};


export type PropTypes = 
{
  id?: string,
  className?: string,
  showAllLabel?: string | JSX.Element,
} & typeof defaultProps;

/**
 * Create buttons selected or active view groups
 */
const ViewTabButtons = ({
  id,
  className,
  classNameButton,
  classNameButtonActive,
  showAllLabel,
}: PropTypes) =>
{
  const views = useSelector(
    getViewGroup(id),
    isEqual,
  );

  const dispatch = useDispatch();

  const onClickTabHandler = (event: React.MouseEvent<HTMLButtonElement>, buttonId: string) =>
  {
    event.preventDefault();
    dispatch(switchView(buttonId, id));
  }

  const onClickShowAllHandler = (event: React.MouseEvent<HTMLButtonElement>) =>
  {
    event.preventDefault();

    views.forEach(({ id }) => {
      dispatch(toggleView(id, 1));
    });
  }

  const isOnlyOneActive = views.filter(({ status }) => !!status).length === 1;

  const items = views.map(({ id, status, title }) => (
    <button
      key={id}
      data-id={id}
      onClick={event => onClickTabHandler(event, id)}
      className={status && isOnlyOneActive ? classNameButtonActive : classNameButton}
    >
      {title || id}
    </button>
  ));

  const isAllActive = views.every(({ status }) => !!status);

  return (
    <div
      className={className}
    >
      { showAllLabel &&
      <button className={isAllActive ? classNameButtonActive : classNameButton} onClick={onClickShowAllHandler}>{showAllLabel}</button>
      }
      {items}
    </div>
  );
};

ViewTabButtons.defaultProps = defaultProps;



export default ViewTabButtons;
