
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';


/* !- React Elements */

import GridView from '@1studio/ui/view/grid';
import Connect from '@1studio/ui/grid/connect';
import Grid from '@1studio/ui/grid/pure/grid';
import Input from '@1studio/ui/form/pure/input';
import Button from '@1studio/ui/form/pure/button';
import Pagination from '@1studio/ui/pagination/pure/pagination';
import { CalendarButton } from '@1studio/ui/form/pure/calendarMonthCaroussel';
import GridButton from '@1studio/ui/grid/pure/gridSelectableButton';


/* !- Actions */

import { close } from '@1studio/ui/layer/actions';


/* !- Constants */

import { SETTINGS } from './constStock';


/**
* StockGrid Component
*/
const StockGrid = ({ onClick, filters }, { store }) =>
{
  // auto filters
  if (filters)
  {
    SETTINGS.filters.forEach((filter, index) =>
    {
      if (filters[filter.id])
      {
        SETTINGS.filters[index].status = true;
        SETTINGS.filters[index].arguments = [filters[filter.id]];
      }
      else
      {
        SETTINGS.filters[index].status = false;
      }
    })
  }

  const onClickGridButton = (items) =>
  {
    if (!items.length)
    {
      return false;
    }

    onClick(items);

    store.dispatch(close());

    return true;
  }

  return (
    <GridView
      id="stock"
      settings={SETTINGS}
      onLayer
    >

      <div className="filters">
        <Input
          id="search"
          label={<div className="icon embed-search-gray-dark">Keresés</div>}
          placeholder="Cikkszám vagy terméknév..."
        />

        <Button
          id="instock"
          placeholder="Készleten"
        />

        <CalendarButton
          id="arvalt"
          placeholder={<div className="icon embed-calendar-gray-dark label">Árváltozás</div>}
          onChange={value => moment(value).fromNow()}
        />
      </div>

      <Connect
        UI={Grid}
        uiProps={{
          className: 'card',
          noResults: 'stock.noResults',
          selectable: true,
        }}
      />

      <GridButton
        className="primary w-auto"
        onClick={onClickGridButton}
        label="priceTag.addSelected"
      />

      <Connect
        UI={Pagination}
        uiProps={{
          limit: 5,
        }}
      />

    </GridView>
  );
};

StockGrid.contextTypes =
{
  store: PropTypes.object,
};

export default StockGrid;
