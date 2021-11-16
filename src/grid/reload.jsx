
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';


/* !- Actions */

import { setData } from './actions';


const ModifiedDateTime = ({ modifiedDateTime, className, format }) =>
(
  <div className={className}>
  {
    !modifiedDateTime ||
    moment(modifiedDateTime * 1000).format(format)
  }
  </div>
);



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
    // this.reload();
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
          this.setState({ modified: response.modified }, () => this.props.onChange(response.modified));
        }
      });
  }

  render()
  {
    return React.createElement(
      this.props.UI,
      {
        modifiedDateTime: this.state.modified,
        className: this.props.className,
        format: this.props.format,
      },
    );
  }
}

GridReload.propTypes =
{
  min: PropTypes.number,
  sec: PropTypes.number,
  format: PropTypes.string,
  className: PropTypes.string,
  onChange: PropTypes.func,
  UI: PropTypes.func,
};

GridReload.defaultProps =
{
  min: 0,
  sec: 60,
  format: 'YYYY. MMMM Do, k:mm',
  className: '',
  onChange: () => {},
  UI: ModifiedDateTime,
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
