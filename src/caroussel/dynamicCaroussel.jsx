
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';


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
const fetchData = (page, data, visibleSlides) =>
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
  componentWillMount()
  {
    // Enable caroussel settings and create datas if it is non-static
    this.updateSlides();
  }

  componentWillReceiveProps(props)
  {
    this.updateSlides(props);
  }

  //TODO kellene egy minta app ahol props.data valtozik
  // componentDidUpdate(nextProps, nextState)
  // {
  //   if (!isEqual(this.props.data, nextProps.data))
  //   {
  //     this.context.store.dispatch(
  //       setData(
  //         nextProps.data,
  //         null,
  //         props.id,
  //       ),
  //     );
  //   }
  // }

  updateSlides = (props = this.props) =>
  {
    const store = this.context.store.getState().grid[this.props.id];

    /**
     * Length of data less than necessary number of items
     */
    if (props.data.length && props.data.length < 3 * props.visibleSlides)
    {
      if (!store)
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
    }
    else
    {
      this.context.store.dispatch(
        setData(
          props.fetchData(this.carousselPage, props.data, props.visibleSlides),
          CAROUSSEL_SETTINGS,
          props.id,
        ));
    }
  }

  carousselPage = 0;

  transitionEndListener = () =>
  {
    const page = this.context.store.getState().grid[this.props.id].page;

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

DynamicCaroussel.contextTypes = {
  store: PropTypes.object,
};

export default DynamicCaroussel;
