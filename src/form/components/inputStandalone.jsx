import React, { Component } from 'react';
import PropTypes from 'prop-types';


/* !- React Elements */

import Input from './input';


/**
 * StandaloneInput
 */
class StandaloneInput extends Component
{
  constructor(props)
  {
    super(props);

    this.state = {
      active: false,
      value: '',
      error: '',
    };
  }

  onChangeInputHandler = ({ value }) =>
  {
    this.setState({ value, error: '' });
  }

  onClickSubmitHandler = () =>
  {
    if (!this.state.value)
    {
      this.setState({ error: 'Wrong Input' });
      return;
    }
    else if (this.state.error)
    {
      this.setState({ error: '' })
    }

    this.props.onSubmit({
      value: this.state.value
    })
      .then((response) =>
      {
        if (response.modal)
        {
          this.setState({ error: response.modal.title, active: false });
        }
        else
        {
          this.setState({ active: false });
          this.props.onSuccess(response, (error) => { this.setState({ error })});
        }
      });

    this.setState({ active: true });
  }

  render()
  {
    return (
      <div className="form h-top active">
        <Input
          {...this.props}
          className="m-0 mr-2"
          onChange={this.onChangeInputHandler}
          error={this.state.error}
          value={this.state.value}
          disabled={this.state.active}
          />
        <div
          className="button w-auto outline shadow"
          onClick={this.onClickSubmitHandler}
          disabled={this.state.active}
        >
          {this.state.active ? <div className="preloader text-xs" /> : <span>{this.props.buttonLabel}</span>}
        </div>
      </div>
    )
  }
}

StandaloneInput.defaultProps =
{
  buttonLabel: 'Submit',
}


export default StandaloneInput;