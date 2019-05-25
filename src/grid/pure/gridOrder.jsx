import React, { Component } from 'react';
import PropTypes from 'prop-types';


/* !- Actions */

import { changeOrder } from '../actions';
import { menu, close } from '../../layer/actions';


/* !- Elements */

import IconOrder from '../../icon/mui/action/text_rotate_vertical';
import IconDown from '../../icon/mui/navigation/expand_more';
import IconUp from '../../icon/mui/navigation/expand_less';


/**
 * [OrderMenu description]
 */
class OrderMenu extends Component
{
  constructor(props, context)
  {
    super(props);

    this.state = this.getGridOrder(context);
  }

  componentDidMount()
  {
    // Subscribe Redux
    if (this.context.store)
    {
      this.unsubscribe = this.context.store.subscribe(this.onChangeListener);
    }
  }

  componentWillUnmount()
  {
    if (this.unsubscribe)
    {
      this.unsubscribe();
    }
  }

  /**
   * Invoke every Redux changes
   */
  onChangeListener = () =>
  {
    const nextOrder = this.getGridOrder();

    if (
      this.state.orderColumn !== nextOrder.orderColumn
      || this.state.orderDirection !== nextOrder.orderDirection
    )
    {
      this.setState(nextOrder);
    }
  }

  getGridOrder = (context = this.context) =>
  {
    const order = {
      orderColumn: '',
      orderDirection: '',
    };

    if (context.grid)
    {
      const grid = context.store.getState().grid[context.grid] || {};

      order.orderColumn = grid.orderColumn;
      order.orderDirection = grid.orderDirection;
    }

    return order;
  }

  render()
  {
    const icon = this.state.orderDirection === 'desc' ? IconDown : IconUp;

    const items = this.props.data.map(({ id, status, title }) => ({
      id,
      title: title || id,
      // className: parseInt(status) === 1 ? 'active' : '',
      icon: id === this.state.orderColumn ? icon : undefined,
      handler: (item) =>
      {
        this.context.store.dispatch(changeOrder(item.id, this.context.grid));
        this.context.store.dispatch(close());
      },
    }));

    return (
      <div
        role="button"
        tabIndex="-1"
        onClick={event => this.context.store.dispatch(menu({ items }, event))}
        className={this.props.className}
      >
        {this.props.children}
      </div>
    );
  }
}

OrderMenu.defaultProps =
{
  children: (
    <div
      className="button w-auto outline shadow embed-angle-down-gray"
    >
      <IconOrder />
      Rendezés
    </div>
  ),
};

OrderMenu.contextTypes =
{
  store: PropTypes.object,
  grid: PropTypes.string,
};


export default OrderMenu;
