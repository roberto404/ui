import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Hammer from 'hammerjs';
import isEqual from 'lodash/isEqual';
import clamp from '@1studio/utils/math/clamp';

/* !- Redux Actions */

import * as GridActions from '../grid/actions';


/* !- Constants */

import { CAROUSSEL_SETTINGS } from './caroussel';


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

    this.forceStart = !!props.forceStart;
  }

  componentWillMount()
  {
    this.props.setSettings(CAROUSSEL_SETTINGS, this.props.id);
  }

  componentDidMount()
  {
    this.initHammerDrag();
    this.initPaginationListener();
    this.startAutoPlay();
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

    if (!this.autoplay && nextProps.page !== this.props.page)
    {
      this.forceStart = false;
    }

    if (this.autoplay && !nextProps.autoplay)
    {
      this.flushAutoplay();
    }
  }

  componentDidUpdate(prevProps)
  {
    if (!this.autoplay && this.props.autoplay && !prevProps.autoplay)
    {
      this.forceStart = !!this.props.forceStart;
      this.startAutoPlay();
    }
  }

  componentWillUnmount()
  {
    this.flushAutoplay();
  }

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
      this.hammerDragManager = new Hammer.Manager(this.mask, { domEvents: true, touchAction: "pan-y" });
      this.hammerDragManager.add(new Hammer.Pan({ direction: Hammer.DIRECTION_HORIZONTAL }));
      this.hammerDragManager.on('panstart panmove pancancel panend', this.dragListener);
    }
  }

  dragListener = (event) =>
  {
    console.log(event.type);
    if (!this.slides || !this.mask || !this.slides.offsetWidth || !this.mask.offsetWidth)
    {
      return;
    }

    const angle = Math.abs(event.angle);

    if (!this.startCoord)
    {
      this.startCoord = event.center;
      this.startCoord.left = this.slides.offsetLeft;

      if (this.state.active === false)
      {
        this.setState({ active: true });
      }
      return;
    }

    const shift = {
      x: event.center.x - this.startCoord.x,
      y: event.center.y - this.startCoord.y,
    };


    switch (event.type)
    {
      case 'panmove':
        {
          if (
            this.startCoord.left + shift.x < this.slides.offsetWidth * 0.3
            && this.startCoord.left + shift.x >
              (this.slides.scrollWidth * -1) + (this.slides.offsetWidth * 0.7)
            && (this.state.x !== shift.x || this.state.y !== shift.y)
            && event.isFinal !== true
            && !(
              (angle >= 90 && angle < 150)
              || (angle > 30 && angle < 90)
            )
          )
          {
            this.setState(shift);
          }
          break;
        }

      case 'pancancel':
      case 'panend':
        {
          this.startCoord = null;

          if (Math.abs(this.state.x) / this.mask.offsetWidth > 0.1)
          {
            const direction = this.state.x < 0 ? 1 : -1;
            const steps = Math.ceil(
              Math.abs(this.state.x) / (this.mask.offsetWidth / this.props.visibleSlides),
            );

            this.goToSlide(this.props.page + (steps * direction), this.props.id);
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

  onMouseOverHandler = () =>
  {
    this.flushAutoplay();
  }

  onMouseOutHandler = (event) =>
  {
    if (!event.currentTarget.parentElement.contains(event.relatedTarget))
    {
      this.startAutoPlay();
    }
  }

  goToSlide = (page) =>
  {
    const nextPage = clamp(page, 1, this.props.totalPage - this.props.visibleSlides + 1);

    if (nextPage !== this.props.page)
    {
      this.props.goToPage(
        nextPage,
        this.props.id,
      );
    }
  }

  goToNextSlide = () =>
  {
    const nextPage =
      (this.props.page === (this.props.totalPage - this.props.visibleSlides + 1)) ?
        1 : this.props.page + 1;

    this.goToSlide(nextPage);
  }

  startAutoPlay = () =>
  {
    if (this.forceStart && this.props.autoplay && parseInt(this.props.autoplay) > 0)
    {
      this.autoplay = setInterval(this.goToNextSlide, this.props.autoplay * 1000);
    }
  }

  flushAutoplay = () =>
  {
    if (this.props.autoplay && this.autoplay)
    {
      clearInterval(this.autoplay);
      this.autoplay = 0;
    }
  }

  render()
  {
    const { rawData, page, transition, visibleSlides, Slide } = this.props;

    const width = `${100 / visibleSlides}%`;

    return (
      <div
        className="slide-mask"
        onMouseOver={this.onMouseOverHandler}
        onMouseOut={this.onMouseOutHandler}
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
              // className="px-1/2"
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
   * Start autoplay if leave it
   */
  forceStart: PropTypes.bool,
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
  forceStart: true,
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
