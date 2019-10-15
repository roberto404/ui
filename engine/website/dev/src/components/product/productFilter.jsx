
import React from 'react';
import PropTypes from 'prop-types';
import formatThousand from '@1studio/utils/string/formatThousand';
import isEmpty from 'lodash/isEmpty';
import capitalizeFirstLetter from '@1studio/utils/string/capitalizeFirstLetter';



/* !- React Actions */

import { flush, setValues, unsetValues } from '@1studio/ui/form/actions';


/* !- React Elements */

import NestedList, { Accordion } from '@1studio/ui/grid/pure/nestedList';
import Slider from '@1studio/ui/form/pure/slider';
import Checkbox from '@1studio/ui/form/pure/checkbox';
import IconFilterReset from '../../icons/eraser';

/* !- Constants */


import { EMPTY_FILTER, filters } from './const';


/**
 * Label of Radio, checkbox options
 */
const ProductFilterOptionLabel = ({ title, sum }) => (
  <div className="">
    <span className="">{capitalizeFirstLetter(title)}</span>
    <span className="text-gray-light pl-1/2">{`${sum} db`}</span>
  </div>
);


// Akciós, Azonnal megtekinthet

/**
 * [ProductFilter description]
 */
const ProductFilter = ({ className, model }, { config, store }) =>
{
  const data = model.results;
  /**
  * Group and count all unique value by fields
  *
  * @example
  * {
  *  brand: {
  *   Zero: 221, ...
  *  },
  *  flag: {
  *    '-': 10,
  *    Rstop: 2,
  *  }
  * }
  */
  const results = {};
  const fields = [/*'brand',*/ 'flag', 'category', 'color', /*'manufacturer',*/ 'features'];

  /**
   * Helper method which push data to results.
   */
  const addResults = (field, value) =>
  {
    value = String(value); // eslint-disable-line

    if (!results[field])
    {
      results[field] = {};
    }

    if (Object.keys(results[field]).indexOf(value) === -1)
    {
      results[field][value] = 1;
    }
    else
    {
      results[field][value] += 1;
    }
  };

  data.forEach(product =>
    fields.forEach((field) =>
    {
      if (isEmpty(product[field]))
      {
        addResults(field, EMPTY_FILTER);
        return;
      }

      switch (typeof product[field])
      {
        case 'string':
          addResults(field, product[field]);
          break;

        case 'object':
          // array
          if (Array.isArray(product[field]))
          {
            product[field].forEach((item) =>
            {
              addResults(field, item);
            });
          }
          // object (Ex: features)
          else
          {
            Object.keys(product[field]).forEach((index) =>
            {
              // multiple feature
              if (Array.isArray(product[field][index]))
              {
                product[field][index].forEach((item) =>
                {
                  addResults(`${field}@${index}`, item);
                });
              }
              else
              {
                addResults(`${field}@${index}`, product[field][index]);
              }
            });
          }
          break;

        default:

      }
    }),
  );


  /**
   * Prepare checkbox options (data props) by results
   *
   * results: { color: { 1: 100, R: 20 }, ...}
   *
   * // =>
   * { 1: '1 (100)'}, { R: 'R (20)'}
   *
   * @param  {string} field Ex. 'color'
   * @return {object}       [{ id, title }, { Zero: 'Zero (22)'}, ...]
   */
  const getData = (field, helper) =>
  {
    /**
     * @example
     * {
     *  4: {id: "HUN", title: "Magyar termék (220)"}
     *  5: {id: "RSTOP", title: "RStop (1)"}
     * }
     */
    const fieldData = Object.keys(results[field] || {})
      .map(id => ({
        id,
        title: `${helper && id !== EMPTY_FILTER ? (helper.find(i => i.id === id) || {}).title : id}`,
        sum: results[field][id],
      }))
      .sort((a, b) => a.title.localeCompare(b.title))
      .map(item => ({
        id: item.id,
        title: <ProductFilterOptionLabel {...item} />,
      }));

    /**
     * Add invisible selected options
     * In case checkbox selected but results not contain that option
     * (options will disappear without this)
     *
     * selectedFilterValues = ["RSTOP", "KIM"]
     */
    const selectedFilterValues = store.getState().form[`filter${capitalizeFirstLetter(field)}`] || [];

    selectedFilterValues.forEach((fieldValue) =>
    {
      if (fieldData.findIndex(({ id }) => id === fieldValue) === -1)
      {
        fieldData.push({ id: fieldValue, title: `${fieldValue} (0)` });
      }
    });

    return fieldData;
  };


  /**
   * Add all Feature Checkbox component to Accordion
   * @TODO egyéb <= bool types
   */
  const accordionData = {};

  (config.features || [])
    .forEach((feature) =>
    {
      /**
       * Collected features
       * features@1 = {1: 200, 2: 50}
       */
      const featureResult = results[`features@${feature.id}`];

      if (typeof featureResult === 'undefined')
      {
        return;
      }

      /**
       * Available feature options
       * {1: 'foo', 2: 'bar'}
       * @TODO vannak üresek is az is true???
       */
      const featureOptions = feature.options ?
        feature.options
        : { true: 'igen' /* , 'false': 'nem' */ };

      /**
       * Convert results to checkbox data
       * {1: 200, 2: 50} => [{ id: 1, title: 'feature (200)'}, ...]
       */
      const featureData = Object.keys(featureResult)
        .filter(id => featureOptions[id] !== undefined)
        .map(id => ({ id, title: featureOptions[id], sum: featureResult[id] }))
        .sort((a, b) => a.title.localeCompare(b.title))
        .map(item => ({ id: item.id, title: <ProductFilterOptionLabel {...item} /> }));

      accordionData[capitalizeFirstLetter(feature.title)] = [
        <Checkbox
          className="m-0"
          valueClassName="w-full"
          id="features"
          data={featureData}
          format={value => ({ ...store.getState().form.features, [feature.id]: value })}
          stateFormat={value => (value[feature.id] ? value[feature.id] : [])}
        />,
      ];
    });


  /**
   * Accordion nested data sort by title
   */
  // const sortedAccordionData =



  /**
   * Add categories to Accordion
   * and sort by title feature nested data
   */
  const sortedAccordionData = {
    'Ár (Ft)': [
      <div className="underline text-xs pointer mb-2" onClick={onClickPriceResetHandler}>Összes ár érdekel</div>,
      <Slider
        id="price"
        className="m-0"
        from={3000}
        to={197000}
        stateFormat={state => state.map(v => `${formatThousand(Math.round(v))} Ft`)}
        enableStartHandler
        // onTheFly
      />,
    ],
    Kategóriák: [
      <Checkbox
        id="category"
        className="m-0"
        data={getData('category', config.category)}
        valueClassName="w-full"
      />
    ],
    ...Object.keys(accordionData)
      .sort((a, b) => a.localeCompare(b))
      .reduce((result, key) => ({ ...result, [key]: accordionData[key] }), {}),
  };


  const onClickFilterResetHandler = (event) =>
  {
    event.preventDefault();

    const grid = store.getState().grid.products;
    const values = grid.filters.reduce((values, { id }) => ({ ...values, [id]: undefined }), {});

    store.dispatch(unsetValues(values));
  };

  const onClickPriceResetHandler = () =>
    store.dispatch(setValues({ price: [] }));


  const highlightedCheckboxData = [
    { id: 'flag#WARRANTY_5', title: config.flags.find(({ id }) => id === 'WARRANTY_5').title },
    { id: 'flag#THM_0', title: config.flags.find(({ id }) => id === 'THM_0').title },
    { id: 'flag#RSTOP', title: config.flags.find(({ id }) => id === 'RSTOP').title.toUpperCase() },
    { id: 'discount#1', title: 'Akciós termék' },
    { id: 'stock#1', title: 'Készleten' },
    { id: 'stock#0', title: 'Megtekinthető' },
    { id: 'flag#FREE_DELIVERY', title: config.flags.find(({ id }) => id === 'FREE_DELIVERY').title },
  ].map(({ id, title }) =>
    ({ id, title, sum: data.filter(record => filters.product(record, [id])).length }))
  .filter(({ sum }) => sum > 0)
  .map(item => ({ id: item.id, title: <ProductFilterOptionLabel {...item} /> }));


  return (
    <div className={className}>
      <div className="text-l heavy mb-1/2">Találatok szűkítése</div>

      <button className="outline small mb-2" onClick={onClickFilterResetHandler}>
        <IconFilterReset />
        <span>Szűrő alaphelyzetbe</span>
      </button>

      <Checkbox
        id="product"
        valueClassName="w-full"
        data={highlightedCheckboxData}
      />

      <hr className="mb-0" />

      <NestedList
        UI={[Accordion, Accordion]}
        nestedData={sortedAccordionData}
        className="accordion"
      />





      {/*<Checkbox
        label="color"
        id="color"
        data={getData('color', config.color)}
      />*/}






      <hr />



    </div>
  );
};

/**
 * defaultProps
 * @type {Object}
 */
ProductFilter.defaultProps =
{
  // flag: [],
  // dimension: {},
  // price_discount: 0,
  // price_orig: 0,
  // price_orig_gross: 0,
  // price_sale: 0,
  // price_sale_gross: 0,
  // vat: 0,
};

ProductFilter.contextTypes =
{
  store: PropTypes.object,
  config: PropTypes.object,
};


export default ProductFilter;
