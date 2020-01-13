
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';


/* !- Actions */

import { SwitchView } from './actions';


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
  SwitchView,
  className,
  classNameButton,
  classNameButtonActive,
}) =>
{
  const onClickTabHandler = (event, id) =>
  {
    event.preventDefault();
    SwitchView(id);
  }

  const items = views.map(({ id, status, title }) => (
    <button
      key={id}
      data-id={id}
      onClick={event => onClickTabHandler(event, id)}
      className={status ? classNameButtonActive : classNameButton}
    >
      {title || id}
    </button>
  ));

  return (
    <div
      className={className}
    >
      {items}
    </div>
  );
};

ViewTabButtonsComponent.defaultProps =
{
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
    SwitchView,
  },
)(ViewTabButtonsComponent);



const ViewTab = ({
  items,
  className,
  classNameButtons,
  classNameButton,
  classNameButtonActive,
  classNameChildren,
}) =>
(
    <div className={className}>

      <ViewTabButtons
        className={classNameButtons}
        classNameButton={classNameButton}
        classNameButtonActive={classNameButtonActive}
      />

      <View
        className={classNameChildren}
        id='tab'
        defaultView='tab'
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
