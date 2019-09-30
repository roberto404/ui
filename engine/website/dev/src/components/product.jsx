
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedNumber } from 'react-intl';
import map from 'lodash/map';
import classNames from 'classnames';
import capitalizeFirstLetter from '@1studio/utils/string/capitalizeFirstLetter';
import formatThousand from '@1studio/utils/string/formatThousand';
import  { File } from '@1studio/ui/form/pure/dropzone';

/* !- React Actions */

import { setValues } from '@1studio/ui/form/actions';


/* !- React Elements */

import IconFavorite from '../icons/heart';
import IconFavoriteActive from '../icons/heartSolid';
import IconZoom from '../icons/searchPlus';


/* !- Constants */

// import { IMAGE_URL } from '../views/product/const';

const IMAGE_URL = 'foo';


/**
 * Covert category id to category record
 * @param  {Number} [category=0]    category Id
 * @param  {Array}  [categories=[]] all categories
 * @return {Object}                 { id, title, features, template_title, template_subtitle }
 */
export const parseCategory = (category = 0, categories = []) =>
{
  return categories.find(c => c.id === category) || {};
}

/**
 * Convert Features to feature array
 * @param  {Object} [featureCollection={}] { featureId: featureValue }
 * @param  {Array}  [features=[]]          [description]
 * @return {Array}                        [{ id, title, value }]
 *
 * @example
 * {31: 2}
 * =>
 * [{ id: 31, title: 'funkcio', value: 'eco' }]
 */
export const parseFeatures = (featureCollection = {}, features = []) =>
{
  const results = [];

  Object.keys(featureCollection).forEach((featureId) =>
  {
    const feature = features.find(f => f.id === featureId);
    const featureOptions = feature.options ? JSON.parse(feature.options) : [];

    if (feature)
    {
      /**
       * @example
       * "1", ["1", ..], true|false
       */
      const featureValue = featureCollection[featureId];

      switch (typeof featureValue)
      {
        case 'boolean':
          if (featureValue === true)
          {
            results.push({
              id: featureId,
              title: feature.title,
              value: '',
            });
          }
          break;

        case 'object':
          if (Array.isArray(featureValue))
          {
            results.push({
              id: featureId,
              title: feature.title,
              value: featureValue.map(f => featureOptions[f]).join(', '),
            });
          }
          break;

        case 'string':
        default:
          results.push({
            id: featureId,
            title: feature.title,
            value: featureOptions[featureValue],
          });
      }
    }
  })

  return results;
}


export const PRODUCT_DICTIONARY = {
  i: 'id',
  ri: 'related_id',
  b: 'brand',
  m: 'manufacturer',
  t: 'title',
  s: 'subtitle',
  pd: 'price_discount',
  po: 'price_orig_gross',
  ps: 'price_sale_gross',
  f: 'flag',
  fe: 'features',
  di: 'dimension',
  c: 'color',
  im: 'images',
  ic: 'incart',
  de: 'description',
};

export const productPropsParser = props =>
  Object
    .keys(props)
    .reduce(
      (results, index) =>
      {
        results[PRODUCT_DICTIONARY[index] ? PRODUCT_DICTIONARY[index] : index] = props[index]; // eslint-disable-line
        return results;
      },
      {},
    );
