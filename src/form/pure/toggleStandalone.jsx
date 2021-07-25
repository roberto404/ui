import React, { Component } from 'react';
import classNames from 'classnames';


class Toggle extends Component
{
  constructor(props, context)
  {
    super(props);

    this.state = {
      status: props.status || 0,
    };
  }

  onClickToggleHandler = (event) =>
  {
    event.preventDefault();
    
    if (this.props.api)
    {
      this.setState({ status: -1 });
      this.props.api(this.props.id).then(({ status }) => this.setState({ status: parseInt(status) }))
    }
  }

  render()
  {
    const className = classNames({
      'text-xs' : true,
      'field toggle-field m-0': this.state.status !== -1,
      'active': this.state.status === 1,
    });

    return (
      <div className={className}>
        { this.state.status === -1 &&
        <div className="ml-1 preloader" />
        }
        { this.state.status !== -1 &&
        <button onClick={this.onClickToggleHandler} />
      }
      </div>

    )
  }
}

export default Toggle;