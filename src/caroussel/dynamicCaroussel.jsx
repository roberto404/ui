
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

const fetchData = (page) =>
{
  const items = [];
  return items;
}


/**
 * 1. Automatically
 * Useful if you want infinite caroussel or do not want use lot of heavy dom elements.
 *
 * 2. Manual Usage
 * Grid with three elements. Visible only one element, always page two.
 * When the paginate transition finished call props.fetchData which give next three element.
 *
 * @example
 * 1. Automatically
 *
 * GridActions.setData([{ id: 1, slide: <div /> }, ...], {}, 'sample');
 *
 * <DynamicCaroussel id='sample' />
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
 *
 *
 * @todo 1. auto
 */
class DynamicCaroussel extends Component
{
  constructor(props)
  {
    super(props);

    this.state = {
      in: false,
      width: 0,
    };
  }

  componentWillMount()
  {
    this.context.store.dispatch(
      setData(
        this.props.fetchData(this.carousselPage),
        CAROUSSEL_SETTINGS,
        this.props.id,
      ));
  }

  componentWillReceiveProps(nextProps)
  {
    this.context.store.dispatch(
      setData(
        nextProps.fetchData(this.carousselPage),
        CAROUSSEL_SETTINGS,
        nextProps.id,
      ));
  }

  carousselPage = 0;

  // componentWillReceiveProps(nextProps)
  // {
  //   this.carousselPage += (nextProps.page - 2);
  //   this.props.setData(fetchData(this.carousselPage), CAROUSSEL_SETTINGS);
  // }

  transitionEndListener = () =>
  {
    const page = this.context.store.getState().grid[this.props.id].page;

    const nextPage = this.carousselPage + page - 2;

    if (this.carousselPage !== nextPage)
    {
      this.carousselPage = nextPage;

      this.context.store.dispatch(
        setData(
          this.props.fetchData(this.carousselPage),
          CAROUSSEL_SETTINGS,
          this.props.id,
        ));
    }
  }


  render()
  {
    return (
      <Caroussel
        id={this.props.id}
        onPaginate={this.transitionEndListener}
      />
    );
  }
}

DynamicCaroussel.propTypes =
{
  id: PropTypes.string.isRequired,
  fetchData: PropTypes.func,
};


DynamicCaroussel.defaultProps =
{
  fetchData,
};


DynamicCaroussel.contextTypes = {
  store: PropTypes.object,
};

export default DynamicCaroussel;
