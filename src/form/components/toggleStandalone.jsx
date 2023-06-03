import React, { Component } from 'react';
import classNames from 'classnames';


class Toggle extends Component
{
  constructor(props, context)
  {
    super(props);

    this.state = {
      status: parseInt(props.status) || 0,
    };
  }

  componentWillReceiveProps(nextProps)
  {
    if (nextProps.status !== undefined)
    {
      this.setState({ status: parseInt(nextProps.status )});
    }
  }

  onClickToggleHandler = (event) =>
  {
    event.preventDefault();
    
    if (this.props.api)
    {
      const status = this.state.status;

      this.setState({ status: -1 });

      const api = this.props.api(this.props.id, event);
       
      if (api !== null && typeof api === 'object' && typeof api.then === 'function')
      {
        api.then((response) =>
        {
          if (response !== null && typeof response === 'object' && !isNaN(response.status))
          {
            this.setState({ status: parseInt(response.status) });
          }
          else
          {
            this.setState({ status });
          }
        })
      }
      else
      {
        this.setState({ status });
      }
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