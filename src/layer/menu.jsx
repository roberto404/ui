
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';


/* !- Constants */

const renderItems = (items) =>
{
  if (!Array.isArray(items) || !items.length)
  {
    return undefined;
  }

  return items.map((item, index) =>
  (
    <Item
      {...item}
      key={item.index || index}
    />
  ));
};


/* !- React Elements */

export const Item = (props) =>
{
  const {
    id,
    title,
    handler,
    className,
    icon,
    childs,
  } = props;

  const itemClasses = classNames({
    item: true,
    [className]: true,
    clickable: typeof handler === 'function',
  });

  const Title = typeof title === 'function' ? React.createElement(title) : title;

  return (
    <div
      className={itemClasses}
      onClick={(event) => handler(props, event)}
      data-index={id}
    >
      { icon &&
        React.createElement(icon)
      }

      <span className="title">{Title}</span>

      { renderItems(childs) }

    </div>
  );
};

/**
 * propTypes
 * @type {Object}
 */
Item.propTypes =
{
  id: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  title: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string,
  ]).isRequired,
  handler: PropTypes.func.isRequired,
  icon: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.bool,
  ]),
  className: PropTypes.string,
  childs: PropTypes.arrayOf(PropTypes.object),
};

/**
 * defaultProps
 * @type {Object}
 */
Item.defaultProps =
{
  icon: false,
  className: '',
  childs: [],
};


/**
 * Menu
 * @example
 * <Menu
 *  label='menu header'
 *  items=[{
 *    id: 1,
 *    title: 'one',
 *    handler: ({ id, title }, event) => id,
 *    icon: IconLogout,
 *    className: 'first',
 *    childs: {}
 *  }]
 * />
 */
class Menu extends Component
{
  constructor(props)
  {
    super(props);

    this.state = {
      label: props.label,
      items: props.items,
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps)
  {
    this.setState({
      label: nextProps.label,
      items: nextProps.items,
    });
  }

  render()
  {
    const { label, items } = this.state;

    return (
      <div className="menu">
        { label &&
          <div
            className="label"
          >
            {label}
          </div>
        }
        { renderItems(items) }
      </div>
    );
  }
}

/**
 * propTypes
 * @type {Object}
 */
Menu.propTypes =
{
  label: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.string,
  ]),
  /**
   * Menu items
   * @example
   * [
   *  { id: 1, title: 'one', handler: () => 1 },
   *  {
   *    id: 2,
   *    title: 'two',
   *    handler: () => 1,
   *    icon: '<svg />'
   *    className: 'i',
   *    childs: {},
   *   },
   * ]
   */
  items: PropTypes.arrayOf(
    PropTypes.shape(Item.propTypes),
  ).isRequired,
};

Menu.defaultProps =
{
  label: '',
};

export default Menu;
