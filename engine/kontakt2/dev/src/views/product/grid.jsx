
import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom'
import copyToClipboard from '@1studio/utils/string/copyToClipboard';


/* !- React Actions */

import { setHook } from '@1studio/ui/grid/actions';
import { toggleView } from '@1studio/ui/view/actions';
import { dialog, preload } from '@1studio/ui/layer/actions';


/* !- React Elements */

import GridView from '@1studio/ui/view/grid';
import Connect from '@1studio/ui/grid/connect';
import Grid from '@1studio/ui/grid/pure/grid';
import OrderMenu from '@1studio/ui/grid/pure/gridOrder';
import GridFieldGroupBy from '@1studio/ui/grid/pure/gridFieldGroupBy';
import Product, { ProductCard } from '../../components/product';

import Filter from './filter';
import NestedList from './nestedList';


import {
  Input,
  Button,
  Dropdown,
} from '@1studio/ui/form/pure/intl';

import Form from './form';

import View, { ViewMenu } from '@1studio/ui/view/view';


import IconAdd from '@1studio/ui/icon/mui/content/add_circle_outline';


/* !- Constants */

import { SETTINGS, HOOK_TABLE, HOOK_LIST, SETTINGS_VIEW } from './const';



const RowAvatarTitleAction = ({ data }) =>
{
  return (
    <ProductCard
      key={data.id}
      {...data}
      className="col-1-4"
      onClick={data => store.dispatch(dialog(<Product {...data} />, { className: 'w-786' }))}
    />
  );
};



/**
* ProductGrid Component
*/
const ProductGrid = (props, { register, store }) =>
{
  /**
   * <View onChange={onChangeViewHandler}>
   *
   * Controll visible only one view same time expect filter view
   */
  const onChangeViewHandler = (next, prev) =>
  {
    const numOfActive = next.filter(({ id, status }) => status && id !== 'filter').length;

    if (numOfActive === 0)
    {
      store.dispatch(toggleView(next[Object.keys(next)[0]].id));
    }
    else if (numOfActive > 1)
    {
      // set invisible, which not changed and active
      const prevView = next.find(
        ({ id, status }) => status && id !== 'filter' && prev.find(i => i.id === id).status === status,
      );

      if (prevView)
      {
        store.dispatch(toggleView(prevView.id));
      }
    }
    else
    {
      const activeView = next.find(({ id, status }) => status && id !== 'filter');

      if (activeView.id === 'list')
      {
        store.dispatch(setHook(HOOK_LIST, 'product'));
      }
      else if (activeView.id === 'table')
      {
        store.dispatch(setHook(HOOK_TABLE, 'product'));
      }
    }
  };

  return (
    <GridView
      id="product"
      className="column"
      settings={{ ...SETTINGS, hook: HOOK_LIST }}
      onLoad="selectFirst"
    >
      {/* Total Results */}

      <Connect
        UI={({ data }) => <div className="absolute tag text-white" style={{ top: '1.9rem', left: '14rem' }}>{data.length}</div>}
      />

      {/* View and Order Menu */}

      <div className="absolute pin-x pin-t mt-1/2 flex">
        <ViewMenu className="mr-2" />

        <OrderMenu
          data={[
            { id: 'id', title: 'Cikkszám' },
            { id: 'brand', title: 'Márka' },
            { id: 'priority', title: 'Prioritás' },
            // { id: () => console.log(1), title: 'Prioritás2' },
          ]}
        />
      </div>

      {/* Add new + Filters */}

      <div className="grid">
        <div className="col-1-3 mb-1">

          <button
            className="green outline shadow w-auto mr-2 inline-block"
            onClick={() => props.history.push('/repair')}
          >
            <IconAdd />
            <span>Új termék</span>
          </button>

          <Dropdown
            id="error"
            className="inline-block"
            buttonClassName="gray outline shadow"
            placeholder="Hibás termékek"
            data={[
              { id: 'related_id', title: 'Összevonások' },
              { id: 'color', title: 'Színek' },
              { id: 'images', title: 'Kép' },
            ]}
          />
        </div>

        <div className="col-2-3">
          <div className="filters">
            <Input
              id="search"
              label={<div className="icon embed-search-gray-dark">Keresés</div>}
              placeholder="Cikkszám vagy terméknév..."
              // forceFocus
            />

            <GridFieldGroupBy
              id="category"
              placeholder="Kategória"
              helper={() => register.data.product ? register.data.product.categories : {}}
            />

            {/*<GridFieldGroupBy
              id="flag"
              placeholder="Címkék"
              helper={register.data.product ? register.data.product.flags : {}}
            />*/}

            <Button
              id="instore"
              placeholder="Webshopban"
            />
          </div>
        </div>
      </div>

      {/* List-View */}

      <View
        className="card mb-0 p-0 shadow-outer border border-white grid grow scroll-y"
        settings={SETTINGS_VIEW}
        onChange={onChangeViewHandler}
      >
        <div data-view="list" className="grid grow">
          <div className="col-1-3 bg-white-semi-light">
            <Connect
              UI={Grid}
              onClick={({ id }) => copyToClipboard(id)}
              listen={['data', 'hook']}
              uiProps={{
                className: 'w-full scroll-y',
                selectable: true,
                expandSelect: false,
                showHeader: false,
                infinity: true,
              }}
            />
          </div>
          <div className="col-2-3 border-left border-gray-light p-4 scroll-y">
            <Form id="product" />
          </div>
        </div>

        {/* Group-View */}

        <div data-view="groupby" className="grow pt-1/2">
          <NestedList />
        </div>


        {/* Table-View */}

        <div data-view="table" className="grow">
          <Connect
            UI={Grid}
            listen={['data', 'hook']}
            onClick={item => store.dispatch(dialog(<Product {...item} />))}
            uiProps={{
              className: 'overflow',
              freezeHeader: true,
              infinity: true,
            }}
          />
        </div>


        {/* Card-View */}

        <div data-view="card" className="grow pt-1/2">
          <Connect>
            <Grid
              className="scroll-y w-full"
              bodyClassName="p-2"
              rowElement={({ data }) => (
                <ProductCard
                  key={data.id}
                  {...data}
                  className="col-1-4"
                  onClick={item => store.dispatch(dialog(<Product {...item} />, { className: 'w-786' }))}
                />
              )}
              showHeader={false}
              infinity
            />
          </Connect>
        </div>


        {/* Filter-View */}

        <div
          data-view="filter"
          className="col-1-7 pt-1/2 order--1 bg-gray-light border-right border-3"
          style={{ minWidth: '20rem', borderColor: '#e2eaef' }}
        >
          <Connect
            UI={Filter}
            uiProps={{
              className: 'p-2 scroll-y',
            }}
          />
        </div>

      </View>
    </GridView>
  );
};

ProductGrid.contextTypes =
{
  register: PropTypes.object,
  store: PropTypes.object,
};

export default withRouter(ProductGrid);
