import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Hammer from 'hammerjs';
import isEqual from 'lodash/isEqual';
import clamp from '@1studio/utils/math/clamp';
import classNames from 'classnames';

/* !- Redux Actions */

import { setSettings, goToPage } from '../grid/actions';

/* !- Elemens */

import { SlideImage } from './slide';


/* !- Constants */

import { CAROUSSEL_SETTINGS } from './caroussel';




const useComponentWillReceiveProps = (callback, nextProps) =>
{
  const props = useRef(nextProps);

  if (
    isEqual(props.current, nextProps) === false
  )
  {
    useEffect(() => {
      callback(nextProps, props.current)
      props.current = nextProps
    })
  }
}

export const useReferredState = (
  initialValue = undefined
) =>
{
  const [state, setState] = useState(initialValue);
  const reference = useRef(state);

  const setReferredState = (value) => {
      reference.current = value;
      setState(value);
  };

  return [state, reference, setReferredState];
};



/* !- Types */

const defaultProps =
{
  rawData: [],
  page: 0,
  totalPage: 0,
  transition: 'left 0.4s ease-out',
  onPaginate: false,
  visibleSlides: 1,
  stepSlides: 1,
  Slide: SlideImage,
  autoplay: 0,
  forceStart: true,
  disableDrag: false,
};

type PropTypes = Partial<typeof defaultProps> & {
  /**
   * Key of Redux Grid. Slides use the selected grid records.
   */
  id: string,
  /**
   * Css transition, use to when slide is paginating
   */
  transition?: string,
  /**
   * Call this function, when pagination finished (end of css transition)
   */
  onPaginate?: () => void,
  /**
   * Determine number of slides display at the same time.
   * Do not change grid limit props, use this.
   *
   * @example
   * <Slides id="sample" visibleSlides={2} />
   */
  visibleSlides?: number,
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
  Slide: () => JSX.Element,
  /**
   * Auto paginate in second
   */
  autoplay: number,
  /**
   * Start autoplay if leave it
   */
  forceStart: boolean,
  /**
   * Redux grid prop
   * @private
   */
  rawData: {}[],
  /**
   * Redux grid prop
   * @private
   */
  page: number,
  /**
   * Redux grid prop
   * @private
   */
  totalPage: number,
  disableDrag: boolean,
  stepSlides: number,
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
const Slides = ({
  id,
  transition,
  onPaginate,
  visibleSlides,
  stepSlides,
  Slide,
  autoplay,
  forceStart,
  disableDrag,
}: PropTypes) =>
{
  const dispatch = useDispatch();

  console.log('slides');

  const forceStartRef = useRef(false);
  const autoplayRef = useRef(null);
  const hammerDragManager = useRef(null);
  const slidesManager = useRef(null);
  const startCoord = useRef(null);
  const slides = useRef(null);
  const mask = useRef(null);

  // const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [active, setActive] = useState(false);


  const [
    x,
    xRef,
    setX,
  ] = useReferredState(0);

  // componentWillMount
  useMemo(
    () =>
    {
      forceStartRef.current = !!forceStart;

      dispatch(setSettings(CAROUSSEL_SETTINGS, id));
    },
    [],
  );

  // componentDidMount, componentWillUnmount
  useEffect(
    () =>
    {
      // componentDidMount
      if (disableDrag === false)
      {
        initHammerDrag();
      }

      initPaginationListener();
      startAutoPlay();

      // componentWillUnmount
      return () =>
      {
        flushAutoplay();
      };
    },
    [],
  );

  const { page, rawData, totalPage } = useSelector(
    (state) =>
    {
      const grid = state.grid[id] || {};

      return ({
        page: grid.page || 1,
        rawData: grid.rawData || [],
        totalPage: grid.totalPage || 1,
      });
    },
    isEqual,
  );

  console.log(page, rawData, totalPage);

  useState(
    (props) =>
    {
      console.log(props);
    },
    [Slide],
  )

  // componentWillReceiveProps
  // TODO
  // useComponentWillReceiveProps(
  //   (nextProps, props) =>
  //   {
  //     console.log('willReceiveProps', nextProps, props);
  //     if (!isEqual(props.rawData, nextProps.rawData))
  //     {
  //       setActive(true);
  //     }
  //     else if (active === true)
  //     {
  //       setActive(false);
  //     }
  
  //     if (!autoplayRef.current && nextProps.page !== props.page)
  //     {
  //       forceStartRef.current = false;
  //     }
  
  //     if (autoplayRef.current && !nextProps.autoplay)
  //     {
  //       flushAutoplay();
  //     }

  //     // componentDidUpdate ???

  //     if (!autoplayRef.current && autoplay && !nextProps.autoplay)
  //     {
  //       forceStartRef.current = !!forceStart;
  //       startAutoPlay();
  //     }

  //   },
  //   { rawData, page, autoplay },
  // );

  const onMouseOverHandler = () =>
  {
    flushAutoplay();
  }

  const onMouseOutHandler = (event) =>
  {
    if (!event.currentTarget.parentElement.contains(event.relatedTarget))
    {
      startAutoPlay();
    }
  }

  const dragListener = (event) =>
  {
    if (!slides.current || !mask.current || !slides.current.offsetWidth || !mask.current.offsetWidth)
    {
      return;
    }

    const angle = Math.abs(event.angle);

    if (!startCoord.current)
    {
      startCoord.current = event.center;
      startCoord.current.left = slides.current.offsetLeft;

      if (active === false)
      {
        setActive(true);
      }
      return;
    }

    const shift = {
      x: event.center.x - startCoord.current.x,
      y: event.center.y - startCoord.current.y,
    };

    switch (event.type)
    {
      case 'panmove':
        {
          if (
            startCoord.current.left + shift.x < slides.current.offsetWidth * 0.3
            && startCoord.current.left + shift.x >
              (slides.current.scrollWidth * -1) + (slides.current.offsetWidth * 0.7)
            && (x !== shift.x || y !== shift.y)
            && event.isFinal !== true
            && !(
              (angle >= 90 && angle < 150)
              || (angle > 30 && angle < 90)
            )
          )
          {
            setX(shift.x);
            setY(shift.y);
          }
          break;
        }

      case 'pancancel':
      case 'panend':
        {
          startCoord.current = null;

          console.log(x, xRef.current);

          if (Math.abs(xRef.current) / mask.current.offsetWidth > 0.1)
          {
            const direction = xRef.current < 0 ? 1 : -1;
            
            const steps = Math.ceil(
              Math.abs(xRef.current) / (mask.current.offsetWidth / visibleSlides),
            );

            goToSlide(page + (steps * direction), id);
          }

          setX(0);
          setY(0);
          setActive(false);

          break;
        }

      default:
        if (active === true)
        {
          setActive(false);
        }
        break;
    }
  }


  const initHammerDrag = () =>
  {
    if (!hammerDragManager.current)
    {
      hammerDragManager.current = new Hammer.Manager(mask.current, { domEvents: true, touchAction: "pan-y" });
      hammerDragManager.current.add(new Hammer.Pan({ direction: Hammer.DIRECTION_HORIZONTAL }));
      hammerDragManager.current.on('panstart panmove pancancel panend', dragListener);
    }
  }


  /**
   * Listen to the end of transition, that is the end of pagination.
   * If the pagination is complete, then call onPaginate props.
   *
   * this.slidesManager will be the eventListener pointer.
   */
  const initPaginationListener = () =>
  {
    if (!slidesManager.current && typeof onPaginate === 'function')
    {
      slidesManager.current = slides.current.addEventListener('transitionend', onPaginate);
    }
  }

  const startAutoPlay = () =>
  {
    if (forceStartRef.current && autoplay && parseInt(autoplay) > 0)
    {
      autoplayRef.current = setInterval(goToNextSlide, autoplay * 1000);
    }
  }

  const flushAutoplay = () =>
  {
    if (autoplay && autoplayRef.current)
    {
      clearInterval(autoplayRef.current);
      autoplayRef.current = 0;
    }
  }

  const goToSlide = (pageRequest) =>
  {
    const nextPage = (((pageRequest <= totalPage ? pageRequest : 1) - 1) * stepSlides) + 1;

    if (nextPage !== page)
    {
      dispatch(goToPage(
        nextPage,
        id,
      ));
    }
  }

  const goToNextSlide = () =>
  {
    const nextPage =
      (page === (totalPage - visibleSlides + 1)) ?
        1 : page + 1;

   goToSlide(nextPage);
  }

  const width = `${100 / visibleSlides}%`;

  const classNameSlides = classNames({
    'slides': true,
    'scroll': disableDrag,
  });

  const slideComponents =
    rawData
      .filter(i => i && i.id)
      .map(i =>
      (
        <div
          key={i.id}
          style={{ width }}
        >
          {i.slide || <Slide {...i} active={active} />}
        </div>
      ));

  return (
    <div
      className="slide-mask"
      onMouseOver={onMouseOverHandler}
      onMouseOut={onMouseOutHandler}
      ref={mask}
    >
      <div
        className={classNameSlides}
        ref={slides}
        style={{
          left: `calc(${(100 / visibleSlides * -(page - 1))}% + ${x}px)`,
          transition: active || !transition ? 'none' : transition,
        }}
      >
        { slideComponents }
      </div>
    </div>
  );
}

Slides.defaultProps = defaultProps;

export default Slides;