
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
  const onClickTabHandler = (event, id) =>
  {
    event.preventDefault();
    switchView(id);
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
  (state) =>
  {
    if (state.view.active !== undefined)
    {
      return {
        views: state.view.groups[state.view.active],
      };
    }
    return {
      views: [],
    };
  },
  {
    switchView,
    toggleView,
  },
)(ViewTabButtonsComponent);



const ViewTab = ({
  items,
  className,
  classNameButtons,
  classNameButton,
  classNameButtonActive,
  classNameChildren,
  showAllLabel,
}) =>
(
    <div className={className}>

      <ViewTabButtons
        className={classNameButtons}
        classNameButton={classNameButton}
        classNameButtonActive={classNameButtonActive}
        showAllLabel={showAllLabel}
      />

      <View
        className={classNameChildren}
        id="tab"
        defaultView="tab"
        settings={{
          groups: {
            tab: items.map((item, n) => ({ id: `tab-${n}`, pos: n, ...item }))
          }
        }}
      >
        { items.map((item, n) => <div key={n} data-view={`tab-${n}`}>{item.children}</div>) }
      </View>
    </div>
);

export default ViewTab;
