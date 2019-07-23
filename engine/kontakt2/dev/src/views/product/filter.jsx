import React from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import capitalizeFirstLetter from '@1studio/utils/string/capitalizeFirstLetter';


/* !- React Elements */

import Checkbox from '@1studio/ui/form/pure/checkbox';


/* !- Constants */

export const EMPTY_FILTER = '-';


/**
 * View > Filter
 * Checkbox filters Component
 *
 * brand, flag, color, features... collect grid data available options
 */
const filterProducts = ({ data, className }, { register, store }) =>
{
  const results = {};
  const fields = ['brand', 'flag', 'category', 'color', 'manufacturer', 'features'];

  /**
   * Collect and count all available options by fields
   * @example
   * fields: {
   *  brand: {
   *   Zero: 221, ...
   *  },
   *  flag: {
   *    '-': 10,
   *    Rstop: 2,
   *  }
   * }
   *
   * addResults helper method which push data to results.
   */
  const addResults = (field, value) =>
  {
    value = value.toString(); // eslint-disable-line

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

  const helper = register.data.product || {};

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
  const getData = (field, fieldHelper) =>
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
        title: `${fieldHelper && id !== EMPTY_FILTER ? (fieldHelper.find(i => i.id === id) || {}).title : id} (${results[field][id]})`,
      }))
      .sort((a, b) => a.title.localeCompare(b.title));

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
   * All Feature Checkbox component
   */
  const FeatureFilters = (helper.features || [])
    .filter(({ id }) => results[`features@${id}`])
    .map((feature) =>
    {
      /**
       * Collected features
       * features@1 = {1: 200, 2: 50}
       */
      const featureResult = results[`features@${feature.id}`];

      /**
       * Available feature options
       * {1: 'foo', 2: 'bar'}
       */
      const featureOptions = feature.options ?
        JSON.parse(feature.options)
        : { true: 'igen' /* , 'false': 'nem' */ };

      /**
       * Convert results to checkbox data
       * {1: 200, 2: 50} => [{ id: 1, title: 'feature (200)'}, ...]
       */
      const featureData = Object.keys(featureResult)
        .filter(id => featureOptions[id] !== undefined)
        .map(id => ({ id, title: `${featureOptions[id]} (${featureResult[id]})` }))
        .sort((a, b) => a.title.localeCompare(b.title));

      return (
        <div key={feature.id}>
          <Checkbox
            className="h-max-30 scroll-y"
            id="filterFeature"
            label={capitalizeFirstLetter(feature.title)}
            data={featureData}
            format={value => ({ ...store.getState().form.filterFeature, [feature.id]: value })}
            stateFormat={value => (value[feature.id] ? value[feature.id] : [])}
          />
        </div>
      );
    });

  return (
    <div className={className}>

      <Checkbox
        label="Címkék"
        className="h-max-30 scroll-y"
        id="filterFlag"
        data={getData('flag', helper.flags)}
      />

      {FeatureFilters}

      <Checkbox
        label="Termékcsalád"
        className="h-max-30 scroll-y"
        id="filterBrand"
        data={getData('brand')}
      />

      <Checkbox
        label="Gyártó"
        className="h-max-30 scroll-y"
        id="filterManufacturer"
        data={getData('manufacturer')}
      />

      <Checkbox
        label="Szín csoport"
        className="h-max-30 scroll-y"
        id="filterColor"
        data={getData('color')}
      />
    </div>
  );
};

filterProducts.contextTypes = {
  store: PropTypes.object,
  register: PropTypes.object,
};


export default filterProducts;
