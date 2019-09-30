
import reduce from 'lodash/reduce';


/* !- Helper methods */

export const parseFlag = (prop, helper = []) =>
  prop
    .map(flagId => helper.find(({ id }) => id === flagId))
    .filter(flagProps => flagProps !== null)
    .sort((a, b) => b.priority - a.priority)

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
{
  return [
    `${dimension.w || '-'} x ${dimension.h || '-'} x ${dimension.d || '-'} cm`,
  ];
}
