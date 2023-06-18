
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import { ReactReduxContext } from 'react-redux';
import { AppContext } from '../context';

/* !- Redux Actions */

import { setData, flush } from '../grid/actions';


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
 * @param  {number} page current Caroussel page
 * @param  {array} data static data
 * @return {array}      active three data
 */
const fetchData = (page = 0, data, visibleSlides) =>
{
  const items = [];
  const length = data.length;

  if (!length)
  {
    return [];
  }

  for (let i = 0; i < 3 * visibleSlides; i += 1)
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
  UNSAFE_componentWillMount()
  {
    // Enable caroussel settings and create datas if it is non-static
    this.updateSlides();
  }

  UNSAFE_componentWillReceiveProps(props)
  {
    this.updateSlides(props);
  }

  componentWillUnmount()
  {
    this.context.store.dispatch(flush(this.props.id));
  }

  updateSlides = (props = this.props) =>
  {
    /**
     * Length of data less than necessary number of items
     */
    if (props.data.length && props.data.length < 3 * props.visibleSlides)
    {
      this.context.store.dispatch(
        setData(
          props.data,
          {
            paginate: {
              limit: 1,
              page: 1,
            },
          },
          props.id,
        ),
      );
    }
    else
    {

      const data =
        props.fetchData(this.carousselPage || 0, props.data, props.visibleSlides)
          .map(i =>
          {
            if (typeof i.slide === undefined)
            {
              return i;
            }

            const slide = (
              <AppContext.Provider value={this.context}>
                {i.slide}
              </AppContext.Provider>
            )

            return ({ ...i, slide });
          });

      this.context.store.dispatch(
        setData(
          data,
          CAROUSSEL_SETTINGS,
          props.id,
        ));
    }
  }

  carousselPage = 0;

  transitionEndListener = () =>
  {
    const page = this.context.store.getState().grid[this.props.id]?.page;

    if (typeof page === undefined)
    {
      this.carousselPage = 0;
      return;
    }

    const nextPage = this.carousselPage + page - 2;

    if (this.carousselPage !== nextPage)
    {
      this.carousselPage = nextPage;
      this.updateSlides();
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
  visibleSlides: PropTypes.number,
};

DynamicCaroussel.defaultProps =
{
  data: [],
  fetchData,
  visibleSlides: 1,
};

DynamicCaroussel.contextType = AppContext;

export default DynamicCaroussel;
