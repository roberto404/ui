
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Hammer from 'hammerjs';
import isEqual from 'lodash/isEqual';
import { CAROUSSEL_SETTINGS } from './caroussel';

/* !- Redux Actions */

import * as GridActions from '../grid/actions';


/* !- React Components */

export const SlideHelperComponent = ({ id, url, href, active }) =>
{
  if (!href || active === true)
  {
    return <img src={url} width="100%" alt={id} />;
  }

  return (
    <a href={href}>
      <img src={url} width="100%" alt={id} />
    </a>
  );
};

/**
 * propTypes
 * @type {Object}
 */
SlideHelperComponent.propTypes =
{
  id: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  url: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired,
  active: PropTypes.bool.isRequired,
};


/**
 * Slides Component.
 * Part of Caroussel, not include pages and pager. User cannot controll without controller.
 * Data based on Redux grid, connect to rawData, page, goToPage action.
 *
 * @example
 * import { Slides } from '../src/caroussel/';
 * import { setData } from '../src/grid/actions';
 *
 * const items = [
 * {
 *  id: 1,
 *  slide: <img src='/sample.png' />, // {ReactElement}
 * }, ...
 * ];
 * setData(items, {}, 'sample');
 * <Slides id="sample" />
 *
 * @example
 * Slide helper: you can use simple data grid
 *
 * const items = [
 * {
 *  id: 1,
 *  href: '#'
 *  src: '/sample.png'
 * }, ...
 * ];
 * setData(items, {}, 'sample');
 *
 * => Data will injected this component or your private props.Slide:
 *
 * ({ url, href }) => (
 *  <a href={href}>
 *    <img src={url} width="100%" />
 *  </a>
 * );
 */
class Slides extends Component
{
  constructor(props)
  {
    super(props);

    this.state = {
      x: 0,
      y: 0,
      active: false,
    };
  }

  componentWillMount()
  {
    this.props.setSettings(CAROUSSEL_SETTINGS, this.props.id);
  }

  componentDidMount()
  {
    this.initHammerDrag();
    this.initPaginationListener();

    if (this.props.autoplay)
    {
      this.autoplay = setInterval(this.goToNextSlide, this.props.autoplay * 1000);
    }
  }


  componentWillReceiveProps(nextProps)
  {
    if (!isEqual(this.props.rawData, nextProps.rawData))
    {
      this.setState({ active: true });
    }
    else if (this.state.active === true)
    {
      this.setState({ active: false });
    }
  }

  // componentUnmount()
  // {
    // kell leszedni vagy a dom megsemmisül
    // this.slides Remountnal megmarad??? autoplaynel is kerdes
    //
    //
    //
    // if (!this.slidesManager)
    // {
    //   this.slides.removeEventListener('transitionend', this.props.onPaginate);
    // }
  // }

  /**
   * Listen to the end of transition, that is the end of pagination.
   * If the pagination is complete, then call onPaginate props.
   *
   * this.slidesManager will be the eventListener pointer.
   */
  initPaginationListener()
  {
    if (!this.slidesManager && typeof this.props.onPaginate === 'function')
    {
      this.slidesManager = this.slides.addEventListener('transitionend', this.props.onPaginate);
    }
  }

  initHammerDrag()
  {
    if (!this.hammerDragManager)
    {
      this.hammerDragManager = new Hammer.Manager(this.mask, { domEvents: true });
      this.hammerDragManager.add(new Hammer.Pan({ direction: Hammer.DIRECTION_HORIZONTAL }));
      this.hammerDragManager.on('panstart panmove pancancel panend', this.dragListener);
    }
  }

  dragListener = (event) =>
  {
    if (!this.StartCoord)
    {
      this.StartCoord = event.center;

      if (this.state.active === false)
      {
        this.setState({ active: true });
      }
      return;
    }

    const shift = {
      x: event.center.x - this.StartCoord.x,
      y: event.center.y - this.StartCoord.y,
    };


    switch (event.type)
    {
      case 'panmove':
        {
          if (this.state.x !== shift.x || this.state.y !== shift.y)
          {
            this.setState(shift);
          }
          break;
        }

      case 'panend':
        {
          this.StartCoord = null;

          if (Math.abs(this.state.x) / this.mask.offsetWidth > 0.1)
          {
            const direction = this.state.x < 0 ? 1 : -1;
            const steps = Math.ceil(
              Math.abs(this.state.x) / (this.mask.offsetWidth / this.props.visibleSlides),
            );

            this.props.goToPage(this.props.page + (steps * direction), this.props.id);
          }

          this.setState({
            x: 0,
            y: 0,
            active: false,
          });

          break;
        }

      default:
        if (this.state.active === true)
        {
          this.setState({ active: false });
        }
        break;
    }
  }

  goToNextSlide = () =>
  {
    const nextPage =
      (this.props.page === (this.props.totalPage - this.props.visibleSlides + 1)) ?
        1 : this.props.page + 1;

    this.props.goToPage(nextPage, this.props.id);
  }

  render()
  {
    const { rawData, page, transition, visibleSlides, Slide } = this.props;

    const width = `${100 / visibleSlides}%`;

    return (
      <div
        className="slide-mask"
        ref={(ref) =>
        {
          this.mask = ref;
        }}
      >
        <div
          className="slides"
          ref={(ref) =>
          {
            this.slides = ref;
          }}
          style={{
            left: `calc(${(100 / visibleSlides * -(page - 1))}% + ${this.state.x}px)`,
            transition: this.state.active || !transition ? 'none' : transition,
          }}
        >
          { rawData.map(i =>
          (
            <div
              key={i.id}
              style={{ width }}
            >
              {i.slide || <Slide {...i} active={this.state.active} />}
            </div>
          ))}
        </div>
      </div>
    );
  }
}

/**
 * propTypes
 * @type {Object}
 */
Slides.propTypes =
{
  /**
   * Key of Redux Grid. Slides use the selected grid records.
   */
  id: PropTypes.string.isRequired,
  /**
   * Css transition, use to when slide is paginating
   */
  transition: PropTypes.string,
  /**
   * Call this function, when pagination finished (end of css transition)
   */
  onPaginate: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.bool,
  ]),
  /**
   * Determine number of slides display at the same time.
   * Do not change grid limit props, use this.
   *
   * @example
   * <Slides id="sample" visibleSlides={2} />
   */
  visibleSlides: PropTypes.number,
  /**
   * If your grid record not containe slide field {ReactElement}
   * component will use this element and transfer record field to props.
   *
   * @example
   * // default Slide component
   * ({ url, href }) => (
   *  <a href={href}>
   *    <img src={url} width="100%" />
   *  </a>
   * );
   */
  Slide: PropTypes.func,
  /**
   * Auto paginate in second
   */
  autoplay: PropTypes.number,
  /**
   * Redux grid prop
   * @private
   */
  rawData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]).isRequired,
    }),
  ),
  /**
   * Redux grid prop
   * @private
   */
  page: PropTypes.number.isRequired,
  /**
   * Redux grid prop
   * @private
   */
  totalPage: PropTypes.number.isRequired,
  /**
   * Redux action
   * @private
   */
  goToPage: PropTypes.func.isRequired,
  /**
   * Redux action
   * @private
   */
  setSettings: PropTypes.func.isRequired,
};

/**
 * defaultProps
 * @type {Object}
 */
Slides.defaultProps =
{
  rawData: [],
  page: 0,
  totalPage: 0,
  transition: 'left 0.4s ease-out',
  onPaginate: false,
  visibleSlides: 1,
  Slide: SlideHelperComponent,
  autoplay: 0,
};


export default connect(
  (state, { id }) =>
  {
    const grid = state.grid[id] || {};

    return ({
      page: grid.page,
      rawData: grid.rawData,
      totalPage: grid.totalPage,
    });
  },
  {
    goToPage: GridActions.goToPage,
    setSettings: GridActions.setSettings,
  },
)(Slides);
