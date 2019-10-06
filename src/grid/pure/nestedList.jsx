
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import map from 'lodash/map';
import isEmpty from 'lodash/isEmpty';
import { FormattedMessage } from 'react-intl';

/* !- React Elements */

import IconArrow from '../../icon/mui/navigation/expand_more';

/**
 * [Parent description]
 */
class Parent extends Component
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
      <div style={{ padding: `0 0 1.5rem ${this.props.level * 2}rem` }}>
        <div className="h-center pointer" onClick={this.onClickButtonHandler}>
          <IconArrow
            className={`w-2 h-2 rotate-${rotate}`}
            style={{ transition: 'all 0.2s ease-out' }}/>
          <span className="pl-1 grow">{this.props.title}</span>
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
const NoResults = () => (
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
    UI,
    className,
  }
) =>
{
  /**
   * Redux Grid data by group
   * @type {Object} { groupIndex: [items] }
   */
  const data = nestedData || (model ? model.collectResultsByField(groupBy) : {});

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
          { key: `list-${level}-${index}`, items, index, level, groupBy },
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
  UI: Results,
  className: 'nested-list',
};

export default NestedList;
