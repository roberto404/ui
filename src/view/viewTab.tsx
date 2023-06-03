import React from 'react';


/* !- Actions */

// ..


/* !- Elements */

import View from './view';
import ViewTabButtons from './viewButtons';


/* !- Constants */

// ...


/* !- Types */

import { PropTypes as ViewTabButtonsTypes } from './viewButtons';

type ItemType =
{
  title: string,
  children: JSX.Element,
  status: 0 | 1,
}

const defaultProps = 
{
  id: 'tab',
  items: [
    {
      title: 'tab 1.',
      status: 0,
    }
  ]
};

type PropTypes =
{
  /**
   * Tab items
   */
  items: ItemType[],
  className?: string,
  classNameButtons?: string,
  classNameButton?: ViewTabButtonsTypes['classNameButton'],
  classNameButtonActive?: ViewTabButtonsTypes['classNameButton'],
  classNameChildren?: string,
  showAllLabel?: ViewTabButtonsTypes['showAllLabel'],
  /**
   * Invoke view changed
   */
  onChange?: () => void,

} & typeof defaultProps;

/**
 * Contains: TabButtons and View by items
 */
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
}: PropTypes) =>
(
  <div className={className}>

    {/* <div>{JSON.stringify(items)}</div> */}

    <ViewTabButtons
      id={id}
      className={classNameButtons}
      classNameButton={classNameButton}
      classNameButtonActive={classNameButtonActive}
      showAllLabel={showAllLabel}
    />

    <View
      settings={{
        active: id,
        groups: {
          [id]: items.map((item, n) => ({ id: `${id}-${n}`, pos: n, status: item.status, title: item.title }))
        }
      }}
      className={classNameChildren}
      nested
      onChange={onChange}
    >
      { items.map((item, n) => (
        <div key={n} data-view={`${id}-${n}`}>
          {item.children}
        </div>
      )) }
    </View>
  </div>
);

ViewTab.defaultProps = defaultProps;

export default ViewTab;
