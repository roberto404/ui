
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import omit from 'lodash/omit';
import clone from 'lodash/clone';


/* !- Actions */


/**
 * Provider Component
 * Connect static component to Redux.
 * Update every affected changes.
 *
 * @example
 *  <Connect
 *    id="user"
 *    UI={Grid}
 *    listen="rawData"
 *   />
 *
 * // => <Grid { ...store.grid.user + gridActions } />
 *
 * @example children
 *  <Connect
 *    listen="rawData"
 *  >
 *    <Grid />
 *  <Connect />
 *
 * @example OnChange
 *  <Connect
 *    listen="rawData"
 *    onChange={(state, prevState) => console.log(state.totalPage)}
 *   />
 */
class Connect extends Component
{
  constructor(props, context)
  {
    super(props);

    // redux store key (grid, form, layer, calendar ...)
    this.store = props.store || (context.form ? 'form' : 'grid');

    // state = redux store
    this.data = this.getState(props, context);
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
   * Reload if listens state props changed
   * @private
   */
  onChangeListener()
  {
    const state = this.getState();
    const listen = this.props.listen || Object.keys(state);
    const listens = Array.isArray(listen) ? listen : [listen];

    if (state && listens.some(listen => !isEqual(state[listen], this.data[listen])))
    {
      this.data = state;
      this.forceUpdate();

      if (typeof this.props.onChange === 'function')
      {
        this.props.onChange(state, this.data);
      }
    }
  }

  /* !- Getters */

  getState(props = this.props, context = this.context)
  {
    return clone(context.store.getState()[this.store][props.id || context[this.store]]) || {};
  }

  render()
  {
    const { UI, uiProps, children } = this.props;

    const props = {
      // ...childProps,
      ...omit(this.props, 'UI'),
      ...this.data,
      ...uiProps,
    };

    return children ? React.cloneElement(children, props) : React.createElement(UI, props);
  }
}

Connect.propTypes =
{
  /**
   * Id of Redux Grid
   * Not required if use context Ex: <GridView />
   */
  id: PropTypes.string,
  /**
   * Redux store id (grid, form, calendar ...)
   * Not required if use context
   */
  store: PropTypes.string, // eslint-disable-line
  /**
   * Observed Redux Grid key
   * [data], page, totalPage, orderColumn, filter ...
   * @example
   * //=> user more listener
   * linsten={[page, filter]}
   */
  listen: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  /**
  * Invoke if listens state props changed
  * (state, prevState) => console.log(state.totalPage)
  *
  * @param  {object} state grid object
  * @param  {object} prevState previous grid object
  */
  onChange: PropTypes.func,
  /**
   * Static Component which will update.
   * You can use children or props
   */
  UI: PropTypes.func,
  /**
   * Props of UI Element
   */
  uiProps: PropTypes.shape(),

  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.element,
  ]),
};

Connect.defaultProps =
{
  id: '',
  onChange: () =>
  {},
  UI: () =>
  {},
  uiProps: {},
  // listen: 'data',
  children: undefined,
};

/**
 * contextTypes
 * @type {Object}
 */
Connect.contextTypes =
{
  store: PropTypes.object,
  grid: PropTypes.string,
  form: PropTypes.string,
  // layer: PropTypes.string,
  // calendar: PropTypes.string,
};


export default Connect;
