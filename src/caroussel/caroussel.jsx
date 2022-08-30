
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';


/* !- Redux Actions */

import * as GridActions from '../grid/actions';


/* !- React Elements */

import Slides, { SlideHelperComponent as Slide } from './slides';
import Pager from '../pagination/pure/pager';
import { Pages } from '../pagination/pure/pages';
import IconArrow from '../icon/mui/navigation/expand_less';


/* !- Constants */

export const CAROUSSEL_SETTINGS = {
  paginate: { limit: 1 },
  // order: {},
  // filters: [],
};


/**
 * Group three components: Slides, Pager, Pages.
 * Refresh every component if the Redux-Grid page changes.
 *
 * @example
 * import Caroussel, { CAROUSSEL_SETTINGS } from '../src/caroussel/';
 *
 * const items = [
 * {
 *   id: 1,
 *   slide: <img src='image_980x630.png' />,
 * },
 * ...]
 *
 * GridActions.setData(items, CAROUSSEL_SETTINGS, 'sample');
 *
 * <Caroussel id="sample" />
 */
const Caroussel = (
{
  id,
  totalPage,
  page,
  goToPage,
  visibleSlides,
  stepSlides,
  Slide,
  onPaginate,
  width,
  height,
  className,
  autoplay,
  disablePages,
  pagerNextUI,
  pagerPrevUI,
},
) =>
{
  /**
   * When the stepSlides value more than one it use remake:
   * totalPage = 50
   * stepSlides = 10
   * The carussel will paginate 10 item one click. In fact, you will see only 5 pages:
   * => remakeTotalPage = 5
   */
  const remakeTotalPage = Math.ceil((totalPage - visibleSlides) / stepSlides) + 1;

  /**
   * Pages use remakePage, because the bullet show only n-th bullet
   * totalPage = 50
   * stepSlides = 10
   * => remakePage = 1...5
   */
  const remakePage = Math.ceil(page / stepSlides);


  /* !-- Handlers -- */

  const onClickPage = (nextPage) =>
  {
    if (nextPage > 0 && nextPage <= remakeTotalPage)
    {
      goToPage(
        ((nextPage - 1) * stepSlides) + 1,
        id,
      );
    }
  };

  const carousselClasses = classNames({
    caroussel: true,
    [className]: true,
  });

  return (
    <div className={carousselClasses}>
      <Slides
        id={id}
        onPaginate={onPaginate}
        visibleSlides={visibleSlides}
        stepSlides={stepSlides}
        Slide={Slide}
        autoplay={autoplay}
      />

      { totalPage > 1 &&
      <Pager
        totalPage={remakeTotalPage}
        page={remakePage}
        goToPage={onClickPage}
        prevText={pagerPrevUI}
        nextText={pagerNextUI}
      />
      }

      { totalPage > 1 && disablePages === false &&
      <Pages
        totalPage={remakeTotalPage}
        page={remakePage}
        goToPage={onClickPage}
      />
      }
    </div>
  );
};

/**
 * propTypes
 * @type {Object}
 */
Caroussel.propTypes =
{
  id: PropTypes.string.isRequired,
  totalPage: PropTypes.number,
  page: PropTypes.number,
  goToPage: PropTypes.func.isRequired,
  visibleSlides: PropTypes.number,
  stepSlides: PropTypes.number,
  Slide: PropTypes.func,
  className: PropTypes.string,
  autoplay: PropTypes.number,
  disablePages: PropTypes.bool,
  pagerNextUI: PropTypes.element,
  pagerPrevUI: PropTypes.element,
};

/**
 * defaultProps
 * @type {Object}
 */
Caroussel.defaultProps =
{
  totalPage: 0,
  page: 0,
  visibleSlides: 1,
  stepSlides: 1,
  className: '',
  Slide,
  autoplay: 0,
  disablePages: false,
  pagerNextUI: <IconArrow />,
  pagerPrevUI: <IconArrow />,
};


export default connect(
  (state, { id }) =>
  {
    const grid = state.grid[id] || {};

    return ({
      totalPage: grid.totalPage,
      page: grid.page,
    });
  },
  {
    goToPage: GridActions.goToPage,
  },
)(Caroussel);
