
import React, { Component } from 'react';
import PropTypes from 'prop-types';


/* !- Redux Actions */

import { setData } from '../grid/actions';


/* !- React Elements */

import Caroussel from './caroussel';


/* !- Constants */

export const CAROUSSEL_SETTINGS = {
  paginate: {
    limit: 1,
    page: 2,
  },
};

/**
 * Create infinite caroussel by static data
 * @param  {[integer]} page current Caroussel page
 * @param  {[array]} data static data
 * @return {[array]}      active three data
 */
const fetchData = (page, data) =>
{
  const items = [];
  const length = data.length;

  for (let i = 0; i < 3; i += 1)
  {
    /**
    * infinite loop determine current loop position
    */
    const index = (page - 1 + i) % (length);

    /**
    * negative position
    * @example
    * index === -1
    * => data[length + index] // data last element.
    */
    if (index < 0)
    {
      items.push(data[length + index]);
    }
    else
    {
      items.push(data[index]);
    }
  }

  return items;
};

/**
 * 1. Automatically
 * Useful if you want infinite caroussel or do not want use lot of heavy dom elements.
 *
 * 2. Manual Usage
 * Grid with three elements. Visible only one element, always page two.
 * When the paginate transition finished call props.fetchData which give next three element.
 *
 * @example
 * 1. Automatically with static data
 *
 * <DynamicCaroussel
 *  id='sample'
 *  data={[{ id: 1, slide: <div /> }, ...]}
 * />
 *
 * @example
 * 2. Manual usage
 *
 * <DynamicCaroussel
 *  id='sample'
 *  fetchData={( page ) =>
 *  {
 *   const items = [];
 *
 *   for (let i = 0; i < 3; i += 1)
 *   {
 *    items.push({ id: i, slide: <div>{page + i}</div>
 *   }
 *
 *   return items;
 *  }}
 * />
 */
class DynamicCaroussel extends Component
{
  componentWillMount()
  {
    // Enable caroussel settings and create datas if it is non-static
    this.updateSlides(this.props);
  }

  componentWillReceiveProps(nextProps)
  {
    this.updateSlides(nextProps);
  }

  updateSlides = (props) =>
  {
    this.context.store.dispatch(
      setData(
        props.fetchData(this.carousselPage, props.data),
        CAROUSSEL_SETTINGS,
        props.id,
      ));
  }

  carousselPage = 0;

  transitionEndListener = () =>
  {
    const page = this.context.store.getState().grid[this.props.id].page;

    const nextPage = this.carousselPage + page - 2;

    if (this.carousselPage !== nextPage)
    {
      this.carousselPage = nextPage;

      this.context.store.dispatch(
        setData(
          this.props.fetchData(this.carousselPage, this.props.data),
          CAROUSSEL_SETTINGS,
          this.props.id,
        ));
    }
  }


  render()
  {
    return (
      <Caroussel
        {...this.props}
        disablePages
        onPaginate={this.transitionEndListener}
      />
    );
  }
}

DynamicCaroussel.propTypes =
{
  id: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(PropTypes.object),
  /**
  * Pull the "visible" slides
  * @param {integer} page
  * @param {data} array static data
  */
  fetchData: PropTypes.func,
};


DynamicCaroussel.defaultProps =
{
  data: [],
  fetchData,
};


DynamicCaroussel.contextTypes = {
  store: PropTypes.object,
};

export default DynamicCaroussel;
