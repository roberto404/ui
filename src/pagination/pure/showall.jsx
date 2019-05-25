
import React, { Component } from 'react';
import PropTypes from 'prop-types';


/* !- Actions */

import { modifyLimit } from '../../grid/actions';


class ShowAll extends Component
{
  constructor(props, context)
  {
    super(props);

    const grid = context.store.getState().grid[props.id || context.id] || {};

    this.state = {
      active: grid.totalPage !== 1,
    };
  }


  componentDidMount = () =>
  {
    if (this.context.store)
    {
      this.unsubscribe = this.context.store.subscribe(() => this.onChangeListener());
    }
  }

  componentWillUnmount()
  {
    if (this.unsubscribe)
    {
      this.unsubscribe();
    }
  }

  /* !- Listeners */

  /**
   * Ivoke applyFilter when the grid state change
   * @private
   */
  onChangeListener()
  {
    const state = this.context.store.getState().grid[this.id] || {};
    const active = state.totalPage !== 1;

    if (this.state.active !== active)
    {
      this.setState({ active });
    }
  }


  /* !- Handlers */

  onClickButtonHandler = () =>
  {
    this.context.store.dispatch(modifyLimit(0, this.id));
  }

  /* !- Getters */

  get id()
  {
    return this.props.id || this.context.id;
  }

  render()
  {
    if (!this.state.active)
    {
      return <span />;
    }

    return (
      <button
        className={this.props.className}
        onClick={this.onClickButtonHandler}
      >
        {this.props.label}
      </button>
    );
  }
}


ShowAll.propTypes =
{
  id: PropTypes.string,
  className: PropTypes.string,
  label: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
  ]),
};

ShowAll.defaultProps =
{
  id: '',
  className: '',
  label: 'Show All',
};


/**
 * contextTypes
 * @type {Object}
 */
ShowAll.contextTypes =
{
  store: PropTypes.object,
  id: PropTypes.string,
};


export default ShowAll;
