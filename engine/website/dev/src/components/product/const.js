
import reduce from 'lodash/reduce';

export const DIMENSION_KEYS = ['w', 'h', 'd'];

export const MAX_FABRICS_LENGTH = 13

export const MAX_THUMBNAIL_FABRICS_LENGTH = 5;
export const MAX_THUMBNAIL_FEATURE_LENGTH = 2;

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
  st: 'stock',
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


/* !- Helper methods */

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


export const parseFlag = ({ flag }, helper = []) =>
  flag
    .map(flagId => helper.find(({ id }) => id === flagId))
    .filter(flagProps => flagProps !== null)
    .sort((a, b) => b.priority - a.priority);


export const parseFeatures = ({ features }, helper = []) =>
  reduce(
    features,
    (result, featureValue, featureId) =>
    {
      const feature = helper.find(({ id }) => id === featureId);

      if (!feature || featureValue === false)
      {
        return result;
      }

      const featureOptions = JSON.parse(feature.options || '{}');

      result.push({
        id: feature.id,
        title: feature.title,
        value: Array.isArray(featureValue) ?
          featureValue.map(featureValueIndex => featureOptions[featureValueIndex])
          : featureOptions[featureValue],
      });

      return result;
    },
    [],
  );


export const parseFabrics = ({ color, brand, manufacturer }, helper = {}) =>
{
  if (helper[manufacturer])
  {
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

    return helper[manufacturer][color.toLocaleLowerCase()];
  }
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
    .map((status, index) => status < 0 ? undefined : STORE_INDEX[index])
    .filter(store => store !== undefined);

export const parse = {
  stock: parseStock,
  stockSample: parseStockSample,
  dimension: parseDimension,
  fabrics: parseFabrics,
  features: parseFeatures,
  flag: parseFlag,
};
