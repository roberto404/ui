
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';


/* !- Actions */

import { setData } from './actions';


/**
 * Connect static component to Grid Redux.
 * Update every affected changes.
 *
 * @example
 *  <GridReload
 *    min={1}
 *    sec={4}
 *  />
 *
 */
class GridReload extends Component
{
  constructor(props, context)
  {
    super(props);
    this.state = { modified: context.modifiedDateTime };
  }

  componentDidMount = () =>
  {
    this.reloadInterval = setInterval(this.reload, ((this.props.min * 60) + this.props.sec) * 1000);
    this.reload();
  }

  componentWillUnmount()
  {
    clearInterval(this.reloadInterval);
  }


  reload = () =>
  {
    this.context.api({
      method: this.context.grid,
    })
      .then((response) =>
      {
        if (this.state.modified !== response.modified)
        {
          this.context.store.dispatch(setData(response.records, {}, this.context.id));
          this.setState({ modified: response.modified });
        }
      });
  }

  render()
  {
    return (
      <div className={this.props.className}>
        {
          !this.state.modified ||
          moment(this.state.modified * 1000).format(this.props.format)
        }
      </div>
    );
  }
}

GridReload.propTypes =
{
  min: PropTypes.number,
  sec: PropTypes.number,
  format: PropTypes.string,
  className: PropTypes.string,
};

GridReload.defaultProps =
{
  min: 0,
  sec: 60,
  format: 'YYYY. MMMM Do, k:mm',
  className: '',
};

/**
 * contextTypes
 * @type {Object}
 */
GridReload.contextTypes =
{
  store: PropTypes.object,
  grid: PropTypes.string,
  api: PropTypes.func,
};


export default GridReload;
