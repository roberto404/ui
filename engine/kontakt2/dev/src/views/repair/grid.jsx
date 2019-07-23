
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import map from 'lodash/map';


/* !- React Elements */

import GridView from '@1studio/ui/view/grid';
import Connect from '@1studio/ui/grid/connect';
import Grid from '@1studio/ui/grid/pure/grid';
import Input from '@1studio/ui/form/pure/input';
import Button from '@1studio/ui/form/pure/button';
import Pagination from '@1studio/ui/pagination/pure/pagination';
import { CalendarButton } from '@1studio/ui/form/pure/calendarMonthCaroussel';
import GridButton from '@1studio/ui/grid/pure/gridSelectableButton';
import RepairForm from './form';
// import RepairForm from '../product/form';


/* !- Actions */

import { close, preload, modal } from '@1studio/ui/layer/actions';
import { removeRecord } from '@1studio/ui/grid/actions';
import { setValues } from '@1studio/ui/form/actions';


/* !- Constants */

import { FORM_ERRORS_KEY } from '@1studio/ui/form/constants';
import { SETTINGS } from './const';


/**
* StockGrid Component
*/
const StockGrid = ({ onClick, filters }, { store, api, register }) =>
{
  // auto filters
  // if (filters)
  // {
  //   SETTINGS.filters.forEach((filter, index) =>
  //   {
  //     if (filters[filter.id])
  //     {
  //       SETTINGS.filters[index].status = true;
  //       SETTINGS.filters[index].arguments = [filters[filter.id]];
  //     }
  //     else
  //     {
  //       SETTINGS.filters[index].status = false;
  //     }
  //   })
  // }

  const onClickGridButton = (items) =>
  {
    const form = (store.getState().form || {});

    if (!form.repair)
    {
      return false;
    }

    // if (!isEmpty(form.features[FORM_ERRORS_KEY]))
    // {
    //   store.dispatch(modal({
    //     title: 'Kérem adja meg a teljes kategória besorolást',
    //     classes: 'error',
    //   }));
    //
    //   return false;
    // }

    store.dispatch(preload());

    // const category = form.features.categories;
    //
    // // find a category features
    // const availableFeatures =
    //   register.data.repair.categories.find(({ id }) => id === category).features.split(',');

    api({
      method: 'repair',
      payload: {
        items: items.map(
        ({
          id,
          megnevezes,
          afa,
          listaar_float,
          akcar_float,
          jellemzo,
          meret,
          meret_szelesseg1,
          meret_szelesseg2,
          meret_magassag1,
          meret_magassag2,
          meret_melyseg1,
          meret_melyseg2,
          fekvofelulet_szelesseg,
          fekvofelulet_magassag,
          fekvofelulet_melyseg,
          meret_egyeb,
        }) =>
        ({
          id,
          title_orig: megnevezes,
          price_orig: listaar_float,
          price_sale: akcar_float,
          vat: afa,
          features_orig: jellemzo,
          dimension_orig: meret,
          dimension_orig_new: [
            meret_szelesseg1,
            meret_szelesseg2,
            meret_magassag1,
            meret_magassag2,
            meret_melyseg1,
            meret_melyseg2,
            fekvofelulet_szelesseg,
            fekvofelulet_magassag,
            fekvofelulet_melyseg,
            meret_egyeb,
          ],
          category: form.repair.category,
          features: form.repair.features,
        })),
      },
    })
      .then((response) =>
      {
        // remove from grid
        response.records.forEach(({ id }) => store.dispatch(removeRecord({ id }, 'repair')));

        // clear selection
        store.dispatch(setValues({ id: 'repair' }));

        // close layer
        store.dispatch(close());
      });

    // do not want auto erase selection
    return false;
  }

  return (
    <GridView
      id="repair"
      settings={SETTINGS}
    >

      <div className="filters">
        <Input
          id="search"
          label={<div className="icon embed-search-gray-dark">Keresés</div>}
          placeholder="Cikkszám vagy terméknév..."
          onPaste={(value, onChange) =>
          {
            onChange(value.replace(/\r?\n|\r/g, ','));
          }}
        />
      </div>

      <div className="flex card mb-0 grid-2" style={{ height: 'calc(100vh - 20rem)', alignContent: 'stretch' }}>

        <div style={{ overflow: 'scroll', width: '50%' }}>
          <Connect
            UI={Grid}
            uiProps={{
              // className: 'card',
              // showHeader: false,
              noResults: 'stock.noResults',
              selectable: true,
            }}
          />
        </div>

        <div className="p-4" style={{ flex: '1' }}>
          <Connect
            UI={RepairForm}
          />
          <GridButton
            className="primary w-auto"
            onClick={onClickGridButton}
            label="priceTag.addSelected"
          />
        </div>
      </div>

    </GridView>
  );
};

StockGrid.contextTypes =
{
  store: PropTypes.object,
  api: PropTypes.func,
  register: PropTypes.object,
};

export default StockGrid;
