
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';


/**
 * Connect static component to Form Redux.
 * Update every affected changes.
 *
 * @example
 *  <Connect
 *    id="user"
 *    ui={({ state }) => <div>{state}</div>}
 *   />
 */
class FormConnect extends Component
{
  constructor(props, context)
  {
    super(props);

    this.state = context.store.getState().form[props.id || context.id] || {};
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
   * Ivoke applyFilter when the form state change
   * @private
   */
  onChangeListener()
  {
    const state = this.context.store.getState().form[this.id] || {};
    // const listen = this.props.listen;

    if (!isEqual(state, this.state))
    {
      this.state = {};
      this.setState(state);
      this.props.onChange(state, this.extendProps);
    }
  }

  /* !- Getters */

  get id()
  {
    return this.props.id || this.context.form;
  }

  render()
  {
    const { UI, uiProps } = this.props;

    return (
      <UI
        {...this.state}
        {...uiProps}
      />
    );
  }
}

FormConnect.propTypes =
{
  id: PropTypes.string,
  UI: PropTypes.func.isRequired,
  uiProps: PropTypes.shape(),
  onChange: PropTypes.func,
  // listen: PropTypes.string,
};

FormConnect.defaultProps =
{
  id: '',
  uiProps: {},
  onChange: () =>
  {},
  // listen: 'data',
};

/**
 * contextTypes
 * @type {Object}
 */
FormConnect.contextTypes =
{
  store: PropTypes.object,
  form: PropTypes.string,
};


export default FormConnect;
