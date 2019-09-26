
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
    brand,
    title,
    subtitle,
    price_discount,
    price_orig_gross,
    price_sale_gross,
    flag,
    features,
    dimension,
    color,
    images,
    className,
    onClick,
  } = props;

  const helper = register && register.data.product ? register.data.product : {};

  const classes = classNames({
    relative: true,
    [className]: true,
  })

  // const Favourite = priority > 0 ? <IconFavoriteActive className="w-2 fill-orange" /> : <IconFavorite className="w-2 fill-gray" />



  return (
    <div
      className={classes}
      style={{ minWidth: '250px' }}
      onClick={() => onClick(props)}
    >
      { Array.isArray(flag) && flag.length &&
      <div className="tag pin-top absolute m-1">
        {flag[0]}
      </div>
      }
      <div
        className="embed"
        style={
          images ?
          {
            height: '250px',
            backgroundImage: `url(${new File({ id: images[0] }).getThumbnail()})`,
          }
          :
          {
            height: '250px',
            filter: 'grayscale(100%)',
            opacity: '0.2',
            backgroundImage: 'url(/images/logo.svg)',
          }
        }
      />
      <div className="p-2">
        <div className="overflow mb-2" style={{ height: '4em' }}>
          <div className="mb-1/4 bold" style={{ fontSize: '1.125em', lineHeight: '1.2em' }}>{`${brand} ${title}`}</div>
          <div className="light" style={{ height: '2.4em', lineHeight: '1.2em' }}>{subtitle}</div>
        </div>

        <div className="grid">
          <div className="col-10-12">
            <div className="mb-1/2" style={{ height: '1.5em' }}>
              { parseInt(price_discount) > 0 &&
              <div className="h-center">
                <div className="text-s bold text-gray strikethrough">
                  {`${formatThousand(price_orig_gross)} Ft`}
                </div>
                <div className="tag mx-1 red bold" style={{ fontSize: '0.81em' }}>{`-${price_discount}%`}</div>
              </div>
              }
            </div>
            <div className="text-xl condensed heavy">
              {`${formatThousand(price_sale_gross)} Ft`}
            </div>
          </div>
          <div className="col-2-12 text-right">
            <div className="mb-1/2">
              <IconZoom className="w-2 fill-gray" />
            </div>
            {/*<div>
              { Favourite }
            </div>*/}
          </div>
        </div>
      </div>
    </div>
  );
};

ProductCard.defaultProps = {
  className: 'col-1-3 bg-white',
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
  // const helper = register && register.data.product ? register.data.product : {};

  return (
    <div className="grid-4 nowrap">
      <div className="grow w-auto block">

        <div
          className="embed"
          style={
            images ?
            {
              width: '640px',
              height: '480px',
              backgroundImage: `url(${new File({ id: images[0] }).getUrl('640x480')})`,
            }
            :
            {
              width: '640px',
              height: '480px',
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
            {/*<span>
              {
                parseFeatures(features, helper.features).map(({ id, title, value }) => (
                  <div key={id} className="mb-1/2">
                    <span>{capitalizeFirstLetter(title)}: </span>
                    <span>{value}</span>
                  </div>
                ))
              }
            </span>*/}
          </div>
        </div>

      </div>

      <div className="p-0 mobile:order--1 desktop:w-35" style={{ minWidth: '35rem' }}>
        <div className="mb-1 light"><span className="bold">Cikkszám:</span> {id}</div>
        <div className="mb-1 text-l bold">{brand} {title}</div>
        <div className="text-s light">{subtitle}</div>
        <hr />
        <div className="mb-2 tag">raktáron</div>
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
              {`${formatThousand(price_orig_gross)} Ft`}
            </div>
            <div className="tag mx-1 red bold">{`- ${price_discount}%`}</div>
          </div>
          }
        </div>
        <div className="mb-2 text-xxl condensed">
          {`${formatThousand(price_sale_gross)} Ft`}
        </div>
        <div className="mb-1">
          <span className="bold">Várható szállítási költség:</span>
          <span className="light"> 3000 HUF-tól</span>
        </div>
        <div className="mb-2 text-xs light underline">Szállítási költség kalkulálása</div>
        <div className="text-xs light">(Az ár bruttóban értendő, az ÁFÁ-t tartamlazza.)</div>
        <hr />
        <div className="mb-1 bold">Szín:</div>
        <div className="text-s light">A képen nem a választott szín jelenik meg!</div>
        <hr />
        <div>+/-</div>
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
