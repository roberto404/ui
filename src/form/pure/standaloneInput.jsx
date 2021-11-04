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
          this.props.onSuccess(response);
          this.setState({ value: '', active: false });
        }
        
      });

    this.setState({ active: true });
  }

  render()
  {
    return (
      <div className="form h-top active">
        <Input
          id='input'
          className="m-0 mr-2"
          onChange={this.onChangeInputHandler}
          error={this.state.error}
          value={this.state.value}  
          prefix="Input"
          disabled={this.state.active}
          />
        <div
          className="button w-auto outline shadow"
          onClick={this.onClickSubmitHandler}
          disabled={this.state.active}
        >
          {this.state.active ? <div className="preloader text-xs" /> : <span>Submit</span>}
        </div>
      </div>
    )
  }
}

export default StandaloneInput;