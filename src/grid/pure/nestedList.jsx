
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import map from 'lodash/map';
import isEmpty from 'lodash/isEmpty';
import { FormattedMessage, injectIntl } from 'react-intl';


/* !- React Elements */

import IconArrow from '../../icon/mui/navigation/expand_more';

/**
 * Create nested data structure from array
 * 
 * @param {array} data [{ id: 1 }, { id: 2, pid: 1 }, { id: 3 }, { id: 4, pid: 1 }]
 * @param {string} propValue observed propKey value. Usually {}.id === pid
 * @param {string} propKey 
 * @param {string} propParentKey 
 * @returns {object} { #1: {#2: {}, #4: {}}, #3: {}}
 */
export const getNestedData = (data = [], propValue, propKey = 'id', propParentKey = 'pid') =>
    data
      .filter(record => record[propParentKey] === propValue)
      .reduce(
        (result, record) => ({
          ...result,
          [`#${record[propKey]}`]: getNestedData(data, record[propKey], propKey, propParentKey),
        }),
        {},
      );




/**
 * [Parent description]
 */
export class Parent extends Component
{
  constructor(props)
  {
    super(props);

    this.state = { active: false };
  }

  onClickButtonHandler = (event) =>
  {
    event.preventDefault();
    this.setState({ active: !this.state.active });
  }

  render()
  {
    const rotate = 270 * (+!this.state.active);

    return (
      <div style={{ padding: `0 0 1.5rem ${this.props.level * 2}rem` }} className={this.props.className}>
        <div className="h-center v-justify pointer" onClick={this.onClickButtonHandler}>
          <IconArrow
            className={`w-2 h-2 rotate-${rotate}`}
            style={{ transition: 'all 0.2s ease-out' }}/>
          <div className="pl-1">{this.props.title}</div>
        </div>
        { this.state.active === true &&
        <div className="pt-1">
          {this.props.children}
        </div>
        }
      </div>
    );
  }
}

export const Accordion = (props) =>
{
  if (props.children)
  {
    return (
      <Parent
        { ...props}
        title={props.index}
      >
        {props.children}
      </Parent>
    );
  }

  return props.items;
};

export const Menu = (Tree, onClick) => ({ index, children, level, items }) =>
{
  if (children && children.length)
  {
    return (
      <Parent
        level={level}
        title={Tree.getItem(index.substring(1)).title}
      >
        {children}
      </Parent>
    );
  }

  const item = Tree.getItem(index.substring(1));

  return (
    <div onClick={() => onClick(item)} className="" style={{ padding: `0 0 1rem ${Math.max(level + 3, 5)}rem` }}>
      {item.title}
    </div>
  );
};

/**
 * Results Component
 * display every record width children
 */
const Results = ({ index, children, level }) =>
(
  <div className={`group level${level}`}>
    <h1>{index}</h1>
    <div className="items">{children}</div>
  </div>
);

/**
 * No Results Component
 * it will be display if length of grid.model zero
 */
const NoResultsComponent = () => (
  <div>
    <FormattedMessage id="global.noResults" />.
  </div>
);

/**
 * NestedList Component
 *
 * @example
 * // Use classic UI level component
 *
 * import NestedList from '/grid/pure/nestedList';
 * import Connect from '/grid/connect';
 *
 * const groupBy: ['category', 'date']
 *
 * <Connect
 *   id="products"
 *   UI={NestedList}
 *   uiProps={{
 *     groupBy,
 *   }}
 * />
 *
 * // ->
 * <div class="nested-list">
 *  <div class="group level-0">
 *   <h1>category#1</h1>
 *   <div class="items">...</div>
 *  </div>
 *  <div class="group level-0">
 *   <h1>category#1</h1>
 *   <div class="items">...</div>
 *  </div>
 * </div>
 *
 * @example
 * // Use private different UI level component
 *
 * const foo = 'bar';
 *
 * const Level1 = ({ index, level, items, children }) => <div className={`level-${level}`}>{children}</div>
 * const Level2 = ({ index, level, items, children }) => <div>{index}: {foo}</div>
 *
 * <Connect
 *   id="products"
 *   UI={NestedList}
 *   uiProps={{
 *     groupBy,
 *     UI: [Level1, Level2]
 *   }}
 * />
 * // ->
 * <div class="level-0">
 *  <div>category#1: bar</div>
 *  <div>category#1: bar</div>
 * </div>
 *
 */
const NestedList = (
  {
    nestedData,
    model,
    groupBy,
    nestedDataKey,
    nestedDataParentKey,
    UI,
    UiProps,
    className,
    NoResults,
    intl,
  }
) =>
{
  /**
   * Redux Grid data by group
   * @type {Object} { groupIndex: [items] }
   */
  const data = nestedData || (groupBy ? 
    (model?.collectResultsByField(groupBy) || {}) : getNestedData(model?.data, undefined, nestedDataKey, nestedDataParentKey));


  /**
   * NoResults view component
   */
  if (!data || isEmpty(data))
  {
    return <NoResults />;
  }

  /**
   * Rendering helper method. Iterate itself.
   * @param  {array} nestedItems observe data group
   * @param  {integer} level current nested depth
   * @return {ReactElement} inside children
   */
  const renderItems = (nestedItems, level) =>
    map(
      nestedItems,
      (items, index) =>
        React.createElement(
          Array.isArray(UI) ? UI[level] : UI,
          {
            key: `list-${level}-${index}`,
            items,
            index,
            level,
            groupBy,
            nestedDataKey,
            nestedDataParentKey,
            isFirst: Object.keys(nestedItems).indexOf(index.toString()) === 0,
            isLast:  Object.keys(nestedItems).indexOf(index.toString()) === Object.keys(nestedItems).length - 1,
            model,
            ...UiProps,
            intl,
          },
          (
            ((groupBy === undefined || level < groupBy.length))
            && (!Array.isArray(UI) || UI[level + 1])
          )
            ? renderItems(items, level + 1) : null,
        ),
     );

  return (
    <div className={className}>
      {renderItems(data, 0)}
    </div>
  );
};


NestedList.propTypes =
{
  // data: PropTypes.object(),
  /**
   * instead of groupBy or nestedData
   * use getNestedData method.
   */
  nestedDataKey: PropTypes.string,
  nestedDataParentKey: PropTypes.string,
  UI: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.arrayOf(PropTypes.func),
  ]),
  className: PropTypes.string,
};

/**
 * @type {Object}
 */
NestedList.defaultProps =
{
  data: {},
  nestedDataKey: 'id',
  nestedDataParentKey: 'pid',
  UI: Results,
  UiProps: {},
  className: 'nested-list',
  NoResults: NoResultsComponent,
};

export default injectIntl(NestedList);
