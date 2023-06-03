import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';

import { setValues } from '../../form/actions';

/* !- Constans */

import { FORM_PREFIX } from '../constants';

/**
 * Grid (selectable) Button Component
 */
class SelectableGridButton extends Component
{
  constructor(props)
  {
    super(props);

    this.state = {
      active: false,
    };
  }

  /* !- React Lifecycle */

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

  /* !- Listeners */

  /**
   * Invoke every Redux changes
   */
  onChangeListener = () =>
  {
    if (this.state.active !== !!this.getSelectedItems().length)
    {
      this.setState({
        active: !this.state.active,
      });
    }
  }

  /* !- Handlers */

  /**
   * Value change handler.
   *
   * @private
   * @param  {string} value Current value of the field
   * @return {void}
   */
  onClickButtonHandler = () =>
  {
    const items = this.getSelectedItems();

    const records = this.context.store.getState().grid[this.context.grid].data
      .filter(({ id }) => items.indexOf(id) !== -1);

    if (this.props.onClick(records) !== false)
    {
      this.context.store.dispatch(setValues({ id: this.context.grid }));
    }
  }

  /* !- Privates */

  getSelectedItems = () =>
    (this.context.store.getState().form || {})[FORM_PREFIX + this.context.grid] || [];

  /**
   * This method is called when render the Component instance.
   * @return {ReactElement}
   */
  render()
  {
    const buttonClasses = classNames({
      [this.props.className]: true,
      disabled: !this.state.active,
    });

    return (
      <button
        onClick={this.onClickButtonHandler}
        className={buttonClasses}
      >
        <FormattedMessage id={this.props.label} />
      </button>
    );
  }
}

/**
 * propTypes
 * @type {Object}
 */
SelectableGridButton.propTypes =
{
  /**
   * field custom classes
   */
  className: PropTypes.string,
  label: PropTypes.string,
  onClick: PropTypes.func.required,
};

/**
 * defaultProps
 * @type {Object}
 */
SelectableGridButton.defaultProps =
{
  className: 'primary',
  label: 'global.submit',
  onClick: () =>
  {},
};

SelectableGridButton.contextTypes =
{
  grid: PropTypes.string,
  store: PropTypes.object,
};

export default SelectableGridButton;
