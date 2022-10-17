
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';


/* !- Actions */

import { switchView, toggleView } from './actions';


/* !- Elements */

import View from './view';


/* !- Constants */

// ...



/**
 * Tabs of View
 */
const ViewTabButtonsComponent = ({
  id,
  active,
  views,
  switchView,
  toggleView,
  className,
  classNameButton,
  classNameButtonActive,
  showAllLabel,
}) =>
{
  const onClickTabHandler = (event, buttonId) =>
  {
    event.preventDefault();
    switchView(buttonId, id);
  }

  const onClickShowAllHandler = (event) =>
  {
    event.preventDefault();
    views.forEach(({ id }) => {
      toggleView(id, 1);
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

ViewTabButtonsComponent.defaultProps =
{
  views: [],
  classNameButton: 'w-auto',
  classNameButtonActive: 'w-auto active',
};

const ViewTabButtons = connect(
  ({ view }, { id }) =>
  {
    return {
      views: view.groups[id] || [],
    };
  },
  {
    switchView,
    toggleView,
  },
)(ViewTabButtonsComponent);



const ViewTab = ({
  id,
  items,
  className,
  classNameButtons,
  classNameButton,
  classNameButtonActive,
  classNameChildren,
  showAllLabel,
  onChange,
}) =>
(
    <div className={className}>

      <ViewTabButtons
        className={classNameButtons}
        classNameButton={classNameButton}
        classNameButtonActive={classNameButtonActive}
        showAllLabel={showAllLabel}
        id={id}
      />

      <View
        className={classNameChildren}
        id={id}
        defaultView={id}
        settings={{
          groups: {
            [id]: items.map((item, n) => ({ id: `${id}-${n}`, pos: n, ...item }))
          }
        }}
        nested
        onChange={onChange}
      >
        { items.map((item, n) => <div key={n} data-view={`${id}-${n}`}>{item.children}</div>) }
      </View>
    </div>
);

ViewTab.defaultProps = 
{
  id: 'tab',
};

export default ViewTab;
