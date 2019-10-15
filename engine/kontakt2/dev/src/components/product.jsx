
import React from 'react';
import PropTypes from 'prop-types';
import map from 'lodash/map';
import capitalizeFirstLetter from '@1studio/utils/string/capitalizeFirstLetter';
import { FormattedNumber } from 'react-intl';
import classNames from 'classnames';


/* !- React Actions */

import { setValues } from '@1studio/ui/form/actions';


/* !- React Elements */

import IconFavorite from '@1studio/ui/icon/mui/action/favorite_border';
import IconFavoriteActive from '@1studio/ui/icon/mui/action/favorite';


/* !- Constants */

import { IMAGE_URL } from '../views/product/const';


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
  });

  return results;
};


/**
 * [Product description]
 */
export const ProductCard = (
  props,
  {
    register,
  },
) =>
{
  const {
    id,
    related_id,
    brand,
    manufacturer,
    title,
    title_orig,
    title_orig_rest,
    subtitle,
    price_discount,
    price_orig,
    price_orig_gross,
    price_sale,
    price_sale_gross,
    vat,
    flag,
    category,
    features,
    dimension,
    color,
    images,
    instore,
    incart,
    description,
    priority,
    className,
    onClick,
  } =  props;

  const helper = register && register.data.product ? register.data.product : {};

  const classes = classNames({
    product: true,
    relative: true,
    [className]: true,
  })

  const Favourite = priority > 0 ? <IconFavoriteActive className="favorite active" /> : <IconFavorite className="favorite" />

  return (
    <div className={classes} style={{ minWidth: '250px' }} onClick={() => onClick(props)}>
      { Array.isArray(flag) && flag.lenght &&
      <div className="tag pin-top absolute m-1">
        {flag.join(', ')}
      </div>
      }
      <div
        className="image"
        style={
          images ?
          {
            height: '200px',
            backgroundImage: `url(${IMAGE_URL + manufacturer}/${id}-01.jpg)`,
          }
          :
          {
            height: '200px',
            filter: 'grayscale(100%)',
            opacity: '0.2',
            backgroundImage: 'url(/images/logo.svg)',
          }
        }
      />
      <div className="mb-1/2 bold zoom-1.1 ellipsis">{brand} {title}</div>
      <div className="light overflow mb-2" style={{ height: '2.4em', lineHeight: '1.2em' }}>{subtitle}</div>

      <div className="grid pr-4">
        <div className="col-2-3">
          <div className="mb-1/2" style={{ height: '1.5em' }}>
            { parseInt(price_discount) > 0 &&
            <div className="h-center">
              <div className="text-s bold text-gray strikethrough">
                <FormattedNumber
                  value={price_orig_gross}
                  style="currency"
                  currency="HUF"
                  minimumFractionDigits={0}
                />
              </div>
              <div className="tag mx-1 red bold">-{price_discount}%</div>
            </div>
            }
          </div>
          <div className="text-xl heavy">
            <FormattedNumber
              value={price_sale_gross}
              style="currency"
              currency="HUF"
              minimumFractionDigits={0}
            />
          </div>
        </div>
        <div className="col-1-3 text-right">
          { Favourite }
        </div>
      </div>

    </div>
  );
};

ProductCard.defaultProps = {
  className: 'col-1-3',
};

/**
 * [Product description]
 */
const Product = (
  {
    id,
    related_id,
    brand,
    manufacturer,
    title,
    title_orig,
    title_orig_rest,
    subtitle,
    price_discount,
    price_orig,
    price_orig_gross,
    price_sale,
    price_sale_gross,
    vat,
    flag,
    category,
    features,
    dimension,
    color,
    images,
    instore,
    incart,
    description,
    priority,
  },
  {
    register,
  },
) =>
{
  const helper = register && register.data.product ? register.data.product : {};

  return (
    <div className="grid-4 nowrap">
      <div className="grow w-auto block">
        <div className="mb-2 text-s">
          <span className="bold pr-1/2">{parseCategory(category, helper.categories).title}:</span>
          {/* <span>Otthon &rsaquo; Nappali bútorok &rsaquo; Szekrények</span> */}
        </div>

        <div
          className="image"
          style={
            images ?
            {
              backgroundImage: `url(${IMAGE_URL + manufacturer}/${id}-01.jpg)`,
            }
            :
            {
              filter: 'grayscale(100%)',
              opacity: '0.2',
              backgroundImage: 'url(/images/logo.svg)',
            }
          }
        />

        <div className="mb-1 heavy zoom-1.1">Leírás</div>

        <div className="light text-line-l">{description || '-'}</div>

        <hr />

        { flag && flag.length > 0 &&
        <fieldset>
          <div className="mb-1 heavy zoom-1.1">Kiemelt tulajdonságok</div>
          <div>
            { flag.map(f => <span key={f} className="tag mx-1">{f}</span>) }
          </div>
          <hr />
        </fieldset>
        }

        <div className="grid-2 light">
          <div className="col-1-3">
            <div className="mb-1 heavy">Méretek</div>
            <div className="mb-1/2">Szélesség: {dimension.w || '-'} cm</div>
            <div className="mb-1/2">Magasság: {dimension.h || '-'} cm</div>
            <div>Mélység: {dimension.d || '-'} cm</div>
          </div>
          <div className="col-1-3">
            <div className="mb-1 heavy">{dimension.e || 'Egyéb méretek'}</div>
            { (dimension.e || dimension.w2 || dimension.h2 || dimension.d2) &&
            <fieldset>
              <div className="mb-1/2">Szélesség: {dimension.w2 || '-'} cm</div>
              <div className="mb-1/2">Magasság: {dimension.h2 || '-'} cm</div>
              <div>Mélység: {dimension.d2 || '-'} cm</div>
            </fieldset>
            }
          </div>
          <div className="col-1-3">
            <div className="mb-1 heavy">Jellemzők</div>
            <span>
              {
                parseFeatures(features, helper.features).map(({ id, title, value }) => (
                  <div key={id} className="mb-1/2">
                    <span>{capitalizeFirstLetter(title)}: </span>
                    <span>{value}</span>
                  </div>
                ))
              }
            </span>
          </div>
        </div>

      </div>

      <div className="p-0 mobile:order--1 desktop:w-35" style={{ minWidth: '35rem' }}>
        <div className="mb-1 light"><span className="bold">Cikkszám:</span> {id}</div>
        <div className="mb-1 text-l bold">{brand} {title}</div>
        <div className="light">{subtitle}</div>
        <hr />
        <div className="mb-1 tag">raktáron</div>
        <div className="mb-1 text-s light">
          <span className="bold">Méret: </span>
          <span>{dimension.w || '-'} x {dimension.h || '-'} x {dimension.d || '-'} cm</span>
        </div>
        <div className="text-s light"><span className="bold">Megtekinthető:</span> Budaörs</div>
        <hr />
        <div className="mb-1/2">
          { parseInt(price_discount) > 0 &&
          <div className="h-center">
            <div className="text-s bold text-gray strikethrough">
              <FormattedNumber
                value={price_orig_gross}
                style="currency"
                currency="HUF"
                minimumFractionDigits={0}
              />
            </div>
            <div className="tag mx-1 red bold">-{price_discount}%</div>
          </div>
          }
        </div>
        <div className="text-xxl bold">
          <FormattedNumber
            value={price_sale_gross}
            style="currency"
            currency="HUF"
            minimumFractionDigits={0}
          />
        </div>
        <hr />
        <div className="bold">Színek:</div>
      </div>
    </div>
  );
};

/**
 * defaultProps
 * @type {Object}
 */
Product.defaultProps =
{
  flag: [],
  dimension: {},
  price_discount: 0,
  price_orig: 0,
  price_orig_gross: 0,
  price_sale: 0,
  price_sale_gross: 0,
  vat: 0,
};

Product.contextTypes =
{
  register: PropTypes.object,
}


export default Product;
