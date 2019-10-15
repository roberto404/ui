
import reduce from 'lodash/reduce';
import max from 'lodash/max';
import isEmpty from 'lodash/isEmpty';
import slugify from '@1studio/utils/string/slugify';


export const DIMENSION_KEYS = ['w', 'h', 'd'];

export const MAX_FABRICS_LENGTH = 13;

export const MAX_THUMBNAIL_FABRICS_LENGTH = 5;
export const MAX_THUMBNAIL_FEATURE_LENGTH = 2;

export const PRODUCT_DICTIONARY = {
  id: 'id',
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
  ct: 'category',
  im: 'images',
  ic: 'incart',
  de: 'description',
  st: 'stock',
  sg: 'slug',
};

//@todo dictionary!!!

export const STOCK_STATUS = {
  '-1': 'rendelhető',
  0: 'megtekinthető',
  1: 'utolsó darabok',
  2: 'készleten',
};

export const STORE_INDEX = ['Budapest XIII', 'Budapest XVIII', 'Budaörs'];

export const STOCK_DELIVER_MESSAGE = 'héten belül';


/* !- FakeApi */

export const loadProducts = records => () => new Promise(resolve => resolve({ status: 'SUCCESS', records }));


/* !- Filter methods */

export const EMPTY_FILTER = '-';

export const filters = {
  product: (record, terms) =>
    terms.every((term) =>
    {
      const hashIndex = term.indexOf('#');
      const filterIndex = term.substring(0, hashIndex);
      const filterTerm = term.substring(hashIndex + 1);

      return filters[filterIndex || filterTerm] ?
        filters[filterIndex || filterTerm](record, [filterTerm]) : false;
    }),

  category: ({ category }, terms) =>
    !terms.length
    || (terms[0] === EMPTY_FILTER && isEmpty(category))
    || terms.some(term => parseInt(category) === parseInt(term)),
  discount: ({ price_discount }) => parseInt(price_discount) > 0,
  stock: ({ stock }, terms) => parseInt(max(stock[1])) >= (parseInt(terms) || 1),
  flag: ({ flag }, terms) => terms.every(term => flag.indexOf(term) !== -1),
  price: ({ price_sale_gross }, terms) =>
    parseInt(price_sale_gross) >= terms[0] && parseInt(price_sale_gross) <= terms[1],
  features: ({ features }, terms) =>
    features
    && Object
      .keys(terms)
      .every(id =>
        terms[id].length === 0
        || (
          features[id]
          && (
            features[id] === terms[id]
            || terms[id].every(v =>
              (
                Array.isArray(features[id]) ?
                  features[id].indexOf(v) !== -1 : features[id].toString() === v
              ),
            )
          )
        ),
      ),
};


/* !- Helper methods */

export const getSlug = ({ brand, title, slugIndex }) =>
{
  const index = slugIndex ? `-${slugIndex}` : '';

  return slugify(`${brand} ${title}${index}`);
};

export const productPropsParser = product =>
  Object
    .keys(PRODUCT_DICTIONARY)
    .reduce(
      (results, index) =>
      {
        if (PRODUCT_DICTIONARY[index] === 'slugIndex')
        {
          product[index] = getSlug(product);
        }

        results[PRODUCT_DICTIONARY[index] ? PRODUCT_DICTIONARY[index] : index] = product[index]; // eslint-disable-line
        return results;
      },
      {},
    );

/**
 * Find + ORDER BY priority
 * @example
 * flag: [ 'HUN' ]
 * // => [ { id: 'HUN', title: 'Magyar termék', priority: '1', description: null } ]
 */
export const parseFlag = ({ flag }, helper = []) =>
  (Array.isArray(flag) ? flag : [])
    .map(flagId => (helper ? helper.find(({ id }) => id === flagId) : undefined))
    .filter(flagProps => flagProps !== undefined)
    .sort((a, b) => b.priority - a.priority);

/**
 * @example
 * features: { '32': '3', '36': false }
 * // => [ { id: '32', title: 'stílus', value: 'eco' } ]
 */
export const parseFeatures = ({ features }, helper = []) =>
  reduce(
    (String(features) === '[object Object]' && Array.isArray(helper) ? features : {}),
    (result, featureValue, featureId) =>
    {
      const feature = helper.find(({ id }) => id === featureId);

      if (!feature || featureValue === false)
      {
        return result;
      }

      result.push({
        id: feature.id,
        title: feature.title,
        value: Array.isArray(featureValue) ?
          featureValue.map(featureValueIndex => feature.options[featureValueIndex])
          : feature.options[featureValue],
      });

      return result;
    },
    [],
  );

/**
 * @example
 * color: 'R'
 * // => [ { id: '32', title: 'stílus', value: 'eco' } ]
 */
export const parseFabrics = ({ color, brand, manufacturer }, helper = {}) =>
{
  if (String(helper[manufacturer]) !== '[object Object]' || helper[manufacturer] === undefined)
  {
    return [];
  }

  /**
   * NF1 color is a brand
   */
  if (color === brand)
  {
    let fabrics = [];

    Object.keys(helper[manufacturer]).forEach((brands) =>
    {
      if (
        brands.split(',').indexOf(brand.toLowerCase()) !== -1
      )
      {
        fabrics = [...fabrics, ...helper[manufacturer][brands]];
      }
    });

    return fabrics;
  }

  return helper[manufacturer][color.toLocaleLowerCase()] || [];
};


export const parseDimension = ({ dimension }) =>
  `${DIMENSION_KEYS
    .map(key => dimension[key])
    .filter(key => key !== undefined)
    .join(' x ')} cm`;


export const parseStock = ({ stock }) =>
{
  const maxSupplyStatus = Math.max(...stock[1]);

  if (maxSupplyStatus > 0)
  {
    return STOCK_STATUS[maxSupplyStatus];
  }
  else if (stock[1] > 0)
  {
    return `${stock[1]} ${STOCK_DELIVER_MESSAGE}`;
  }

  return STOCK_STATUS['-1'];
};

export const parseStockSample = ({ stock }) =>
  stock[1]
    .map((status, index) => (status < 0 ? undefined : STORE_INDEX[index]))
    .filter(store => store !== undefined);

export const parse = {
  stock: parseStock,
  stockSample: parseStockSample,
  dimension: parseDimension,
  fabrics: parseFabrics,
  features: parseFeatures,
  flag: parseFlag,
};
