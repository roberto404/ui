
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import clamp from '@1studio/utils/math/clamp';


import { modifyLimit } from '../../grid/actions';

import IconMore from '../../icon/mui/navigation/expand_more';
import IconPreload from '../../../src/icon/preload';


const AUTO_PAGINATION_DELAY = 1000;

let scrollTop;

export class ShowMore extends Component
{
  constructor(props, context)
  {
    super(props);

    this.scroll = 0;
  }

  componentDidMount = () =>
  {
    if (this.props.autoPaginate === true)
    {
      this.context.addListener('scroll', this.onScrollListener);
    }
  }

  componentDidUpdate = () =>
  {
    if (this.props.autoPaginate === true)
    {
      const { data, model } = this.props;

      const current = data.length;
      const limit = model.results.length;

      if (current === limit)
      {
        this.flushDelayPagination();
        this.context.removeListener(this.onScrollListener);
      }
    }
  }

  componentWillUnmount = () =>
  {
    if (this.props.autoPaginate === true)
    {
      this.context.removeListener(this.onScrollListener);

      if (this.delayPagination)
      {
        this.flushDelayPagination();
      }
    }
  }


  /* !- Listeners */

  onScrollListener = (event) =>
  {
    const scrollTop = this.getScrollTop();

    const isScrollDown = scrollTop != 0 && scrollTop > this.scrollTop;
    this.scrollTop = scrollTop;

    if (!this.delayPagination && this.isOnScreen() && isScrollDown)
    {
      this.delayPagination = setTimeout(
        this.autoPaginateHandler,
        AUTO_PAGINATION_DELAY
      );

      this.forceUpdate();
    }
    else if (this.delayPagination && !this.isOnScreen())
    {
      this.flushDelayPagination();
      this.forceUpdate();
    }
  }

  onPaginateListener = () =>
  {
    const {
      model,
      disableLimitExponential,
      exponentialLimit,
      addLimit,
    } = this.props;

    const multiplier = disableLimitExponential ?
      1
      :
      Math.min(
        Math.ceil(model.paginate.limit / addLimit),
        exponentialLimit,
      );

    const limit = model.paginate.limit + (multiplier * addLimit);
    this.context.store.dispatch(modifyLimit(limit, this.context.grid));
  }


  /* !- Handlers */


  /**
   * kill setTimeOut?
   * call pagination
   * stop onScroll if is last page
   */
  autoPaginateHandler = () =>
  {
    if (this.delayPagination)
    {
      this.flushDelayPagination();
    }

    this.scrollTop = 0;
    this.onPaginateListener();
  }

  onClickButtonHandler = (event) =>
  {
    event.preventDefault();

    /**
     * Google Chrome 85 hack
     */
    this.scrollTop = this.getScrollTop();

    this.autoPaginateHandler();
  };


  /* !- Helpers */


  flushDelayPagination = () =>
  {
    clearTimeout(this.delayPagination);
    this.delayPagination = undefined;
  }

  /**
   * determine is absolute position of element on screen
   * @return boolean
   */
  isOnScreen = () =>
  {
    if (!this.element)
    {
      return false;
    }

    const rect = this.element.getBoundingClientRect();
    const scrollTop = this.getScrollTop();
    const screenHeight = document.documentElement.clientHeight;

    // return rect.top > scrollTop && rect.top < scrollTop + screenHeight;
    return rect.top > 0 && rect.top < screenHeight;
  }

  getScrollTop = () =>
    window.pageYOffset || document.documentElement.scrollTop

  render()
  {
    const {
      model,
      data,
      label,
      addLimit,
      format,
      className,
      buttonClassName,
      exponentialLimit,
      disableLimitExponential,
      autoPaginate,
    } = this.props;

    const {
      store,
      grid,
    } = this.context;

    if (!Array.isArray(data))
    {
      return <div />;
    }

    if (this.scrollTop)
    {
      window.scrollTo(0, this.scrollTop);
      this.scrollTop = 0;
    }

    const current = data.length;
    const limit = model.results.length;
    const percent = (current / limit) * 100;

    if (current === limit)
    {
      return <div />;
    }

    return (
      <div
        className={className}
      >
        <div className="grid" style={{ height: '4px' }}>
          <div className="bg-yellow rounded" style={{ width: `${percent}%` }} />
          <div className="bg-gray-light" style={{ width: `${100 - percent}%` }} />
        </div>
        <div className="text-center py-2">{format({ current, limit })}</div>
        <button
          className={classNames({ [buttonClassName]: true, 'outline': this.delayPagination !== undefined })}
          onClick={this.onClickButtonHandler}
          ref={(ref) =>
          {
            this.element = ref;
          }}
        >
          { this.delayPagination !== undefined &&
            <IconPreload className="spinning" />
          }
          { this.delayPagination === undefined &&
          <IconMore />
          }
          <span>{label}</span>
        </button>
      </div>
    );

  }
};


ShowMore.propTypes =
{
  label: PropTypes.string,
  className: PropTypes.string,
  buttonClassName: PropTypes.string,
  addLimit: PropTypes.number,
  /**
   * Maximum page limit
   */
  exponentialLimit: PropTypes.number,
  disableLimitExponential: PropTypes.bool,
  format: PropTypes.func,
  autoPaginate: PropTypes.bool,
};

ShowMore.defaultProps =
{
  label: 'Show More',
  addLimit: 24,
  exponentialLimit: 240,
  disableLimitExponential: false,
  className: 'desktop:col-1-4 mobile:px-4 m-auto mt-4',
  buttonClassName: 'primary w-auto m-auto',
  format: ({ current, limit }) => `${current} of ${limit} items`,
  autoPaginate: false,
};

ShowMore.contextTypes =
{
  store: PropTypes.object,
  grid: PropTypes.string,
  addListener: PropTypes.func,
  removeListener: PropTypes.func,
};

export default ShowMore;
