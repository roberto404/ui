
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Data from '@1studio/utils/models/data';
import { search, compare } from '@1studio/ui/grid/filters';
import capitalizeFirstLetter from '@1studio/utils/string/capitalizeFirstLetter';

/* !- React Actions */

import { setValues } from '@1studio/ui/form/actions';
import { changeOrder } from '@1studio/ui/grid/actions';


/* !- React Elements */

import GridView from '@1studio/ui/view/grid';
import Connect from '@1studio/ui/grid/connect';
import { ProductConnectUI } from '../../components/product/productThumbnail';
import ProductFilter from '../../components/product/productFilter';
import GridFilters from '@1studio/ui/grid/pure/gridFilters';
import ShowMore from '@1studio/ui/pagination/pure/showmore';

import IconArrow from '@1studio/ui/icon/mui/navigation/expand_more';
import DropDown from '@1studio/ui/form/pure/dropdown';



/* !- Constants */

import { loadProducts, filters } from '../../components/product/const';

let priceFilterTagIndex = 1;
const sliderFilterTagPostfix = ['tól', 'ig'];

/**
* ProductGridView Component
*/
class ProductGridView extends Component
{
  constructor(props)
  {
    super(props);

    this.state = {
      visibleFilter: true,
    }
  }

  onClickFilterVisibilityHandler = (event) =>
  {
    event.preventDefault();
    this.setState({ visibleFilter: !this.state.visibleFilter });
  }

  onChangeOrderHandler = (payload) =>
  {
    const order = payload.value.split('#');

    this.context.store.dispatch(changeOrder({
      column: order[0],
      direction: order[1],
    }, 'products'))

    this.context.store.dispatch(setValues(payload));
  }

  render()
  {

    /**
     * Menu filter
     */
    const query = (this.props.filters || []).map(i => i.field + i.operator + i.value).join('&');

    const data = new Data(
      this.context.config.products,
      {
        filters: [{
          id: 'product',
          handler: (record, terms, otherTerms, model, index) =>
            search({ record, value: terms, hooks: {}, index }),
          // handler: record => this.props.filters.every(({ field, operator, value }) =>
          //   compare[operator](record[field], value)),
          arguments: [query],
          status: !!query,
        }],
      },
    );

    /**
     * Extend helper stock and discount to gridFilterFormat
     */
    const helper = {
      ...this.context.config,
      stock: [{ id: '0', title: 'Megtekinthető' }, { id: '1', title: 'Készleten' }],
      discount: [{ id: '1', title: 'Akciós termék' }],
    };

    /**
     * Format grid filter tag values
     */
    const gridFilterFormat = ({ id, value }) =>
    {
      if (id === 'price')
      {
        priceFilterTagIndex += 1;

        if (priceFilterTagIndex > 1)
        {
          priceFilterTagIndex = 0;
        }

        return `Ár: ${Math.round(value)} Ft -${sliderFilterTagPostfix[priceFilterTagIndex]}`;
      }

      if (id === 'product')
      {
        const productFilter = value.split('#');

        id = { flag: 'flags'}[productFilter[0]] || productFilter[0]; // eslint-disable-line
        value = productFilter[1]; // eslint-disable-line
      }

      if (helper[id])
      {
        if (Array.isArray(value))
        {
          const filter = helper[id].find(({ id }) => id === value[0]);

          if (filter && filter.options[value[1]])
          {
            return capitalizeFirstLetter(filter.options[value[1]]);
          }
          else
          {
            return capitalizeFirstLetter(filter.title);
          }
        }

        return capitalizeFirstLetter((helper[id].find(({ id }) => id === value) || {}).title);
      }

      return value;
    };

    return (
      <GridView
        id="products"
        settings={{
          paginate: { limit: 12, page: 0 },
          filters: ['product', 'price', 'category', 'features'].map(id => ({ id, handler: filters[id], arguments: [], status: false })),
        }}
        api={loadProducts(data.results)}
        className="wrapper"
        // flushFiltersUnmount={false}
      >
        <hr />

        {/* !- FilterVisibilty */}

        <GridFilters
          format={gridFilterFormat}
          className="pb-1"
          tagClassName="tag gray mr-1/2 pointer no-select"
        />

        <div className="grid-2">

          {/* !- FilterVisibilty */}

          <div className="col-1-2 h-center">
            <button className="w-auto primary p-1/2" onClick={this.onClickFilterVisibilityHandler}>
              <IconArrow className={`rotate-${270 - (180 * +this.state.visibleFilter)} m-0`} />
            </button>
            <button className="w-auto text-s light" onClick={this.onClickFilterVisibilityHandler}>
              <span className="text-black">{`Szűrő ${this.state.visibleFilter ? 'elrejtése' : 'megjelenítése'}`}</span>
            </button>
          </div>

          {/* !- Order */}

          <div className="col-1-2">
            <DropDown
              id="order"
              data={[
                { id: 'priority#desc', title: 'Legnépszerűbb elöl' },
                { id: 'slug#asc', title: 'Név szerint' },
                { id: 'price_sale_gross#asc', title: 'Legolcsóbb elöl' },
                { id: 'price_sale_gross#desc', title: 'Legdrágább elöl' },
                { id: 'price_discount#desc', title: 'Akciós termékek legelöl' },
              ]}
              onChange={this.onChangeOrderHandler}
              buttonClassName="w-auto input embed-arrow-down-gray text-black v-left"
              placeholder={false}
              value="slug#asc"
              className="m-0"
            />
          </div>
        </div>

        <hr />

        {/* !- Total Results */}

        <Connect
          UI={({ model }) => <div className="bold zoom-1.1 mb-2 pt-1">{`${model.results.length} db találat`}</div>}
        />

        <div className="flex">

          {/* !- Filter */}

          { this.state.visibleFilter === true &&
          <Connect
            UI={ProductFilter}
            uiProps={{
              className: 'col-3-12 pr-2 no-select',
            }}
          />
          }

          {/* !- Results › ProductThumbnail */}

          <Connect
            UI={ProductConnectUI}
            col={3 + +!this.state.visibleFilter}
          />
        </div>

        {/* !- Paginate */}

        <div className={this.state.visibleFilter ? 'ml-auto col-9-12' : ''}>
          <Connect
            UI={ShowMore}
            label="Mutass még!"
            format={({ current, limit }) => `${current} termék ${limit}-ból`}
          />
        </div>
      </GridView>
    );
  }
}

ProductGridView.contextTypes =
{
  config: PropTypes.object,
  register: PropTypes.object,
  store: PropTypes.object,
};

export default ProductGridView;
