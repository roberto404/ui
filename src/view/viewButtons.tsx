
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
  icons: {},
  classNameButton: 'w-auto',
  classNameButtonActive: 'w-auto active',
  classNameIcon: 'w-2 h-2 mr-1',
  classNameIconActive: '',
  classNameTitle: '',
  classNameTitleActive: '',
  filter: () => true,
};


export type PropTypes = 
{
  id?: string,
  /**
   * Base (container) class definition
   */
  className?: string,
  showAllLabel?: string | JSX.Element,
  /**
   * adding icons to buttons
   */
  icons?: {[key: string]: React.FC},
  /**
   * filtering to restrict which views are displayed
   */
  filter?: (view: { id: string, status: string, title: string }) => boolean,
} & typeof defaultProps;

/**
 * Create buttons selected or active view groups
 */
const ViewTabButtons = ({
  id,
  className,
  classNameButton,
  classNameButtonActive,
  classNameIcon,
  classNameIconActive,
  classNameTitle,
  classNameTitleActive,
  icons,
  filter,
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

  const items =
    views
      .filter(view => filter(view))
      .map(({ id, status, title }) => (
        <button
          key={id}
          data-id={id}
          onClick={event => onClickTabHandler(event, id)}
          className={status && isOnlyOneActive ? classNameButtonActive : classNameButton}
        >
          { typeof icons[id] !== 'undefined' && React.createElement(icons[id], { className: status ? (classNameIconActive || classNameIcon) : classNameIcon } )}
          <span className={classNameTitle}>{title || id}</span>
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
