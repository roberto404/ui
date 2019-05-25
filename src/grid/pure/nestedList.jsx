
import React from 'react';
import PropTypes from 'prop-types';
import map from 'lodash/map';
import isEmpty from 'lodash/isEmpty';
import { FormattedMessage } from 'react-intl';

/* !- React Elements */

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
  const data = model ? model.collectResultsByField(groupBy) : {};

  /**
   * If Use different UI components by level,
   * You have to be enough components
   * @type {Boolean}
   */
  const isEqualUiAndGroupLength = !Array.isArray(UI) || groupBy.length === UI.length - 1;

  /**
   * NoResults view component
   */
  if (!data || isEmpty(data) /*|| !isEqualUiAndGroupLength*/)
  {
    // if (!isEqualUiAndGroupLength)
    // {
    //   console.warn('Not enough UI component: ' + groupBy.length);
    // }

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
          (level < groupBy.length && UI[level + 1]) ? renderItems(items, level + 1) : null,
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
  UI: Results,
  className: 'nested-list',
};

export default NestedList;
