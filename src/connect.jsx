
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';


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
    this.state = this.getState(props, context);
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
    const listens = Array.isArray(this.props.listen) ? this.props.listen : [this.props.listen];

    if (state && listens.some(listen => !isEqual(state[listen], this.state[listen])))
    {
      this.setState(state);

      if (typeof this.props.onChange === 'function')
      {
        this.props.onChange(state, this.state);
      }
    }
  }

  /* !- Getters */

  getState(props = this.props, context = this.context)
  {
    return context.store.getState()[this.store][props.id || context[this.store]];
  }

  render()
  {
    const { UI, uiProps, children } = this.props;

    const props = {
      // ...childProps,
      ...this.props,
      ...this.state,
      ...uiProps,
    };

    return children ? React.cloneElement(children, props) : <UI {...props} />;
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
  listen: 'data',
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
