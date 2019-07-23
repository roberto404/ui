
import React from 'react';
import PropTypes from 'prop-types';
import map from 'lodash/map';
import sortBy from 'lodash/sortBy';


/* !- React Actions */

import { setValues } from '@1studio/ui/form/actions';


/* !- React Elements */

import {
  Checkbox,
  Radio,
  Toggle,
} from '@1studio/ui/form/pure';



/**
 * [Features description]
 */
const Features = ({ features, category }, { register, grid, store }) =>
{
  // form feature state value
  // const state = (store.getState().form[id] || {});
  const helper = register.data[grid] || {};

  if (category)
  {
    // form category state value exted category props
    const categoryModel = (helper.categories || []).find(c => c.id === category);

    /**
     * {
     *  features: '1,2,3'
     * }
     */
    if (categoryModel && categoryModel.features)
    {
      // iterate categoryModel's feature create form field (checkbox,radio,toggle...)
      return (
        <div className="grid-2">
          {
            categoryModel
              .features
              .split(',')
              .map((featureId) =>
              {
                /**
                 * @example
                 * {
                 * category: "select"
                 * id: "1"
                 * options: "{"1":"bútorlapos","2":"fa","3":"üveg","4":"fém","5":"mdf"}"
                 * status: "1"
                 * title: "alapanyag"
                 * }
                */
                const feature = register.data[grid].features.find(f => f.id === featureId);

                if (!feature)
                {
                  console.log(`Missing feature, id: ${featureId}`);
                  return <span className="text-red">{featureId}</span>;
                }

                // console.log(`${feature.title} (${feature.id}): ${features[feature.id]} ${feature.options}`);


                let data = [];

                if (feature.options)
                {
                  data = sortBy(
                    map(JSON.parse(feature.options), (title, id) => ({ id, title })),
                    ['title', 'id'],
                  );
                }


                const format = value => ({ ...features, [featureId]: value });

                switch (feature.category)
                {
                  case 'multiselect':
                    return (
                      <Checkbox
                        id="features"
                        key={`feature_${feature.id}`}
                        label={feature.title}
                        data={data}
                        format={value => ({ ...features, [featureId]: value })}
                        stateFormat={
                          /**
                          * @param  {Object} featuresValue complett features from redux
                          * @return {Any}               selected feature values
                          * @example
                          * // featuresValue
                          * {"32": ["1,2"], "9": true}
                          * // featureId = 9
                          * // => true
                          */
                          featuresValue => featuresValue[featureId] || []
                        }
                      />
                    );
                  case 'select':
                    return (
                      <Radio
                        id="features"
                        key={`feature_${feature.id}`}
                        label={feature.title}
                        data={data}
                        format={value => ({ ...features, [featureId]: value })}
                        stateFormat={featuresValue => (featuresValue[featureId] ? [featuresValue[featureId]] : [])}
                      />
                    );
                  case 'boolean':
                    return (
                      <Toggle
                        id="features"
                        key={`feature_${feature.id}`}
                        label={feature.title}
                        format={value => ({ ...features, [featureId]: value })}
                        stateFormat={featuresValue => featuresValue[featureId] === true}
                      />
                    );
                  default:
                    return <div>Nincs ilyen típus: {feature.category}</div>;
                }
              })
             .map((field, index) => (<div key={index} className="col-1-5">{field}</div>))
          }
        </div>
      );
    }
  }
  return <div />;
};

Features.defaultProps =
{
  features: {},
}

Features.contextTypes =
{
  grid: PropTypes.string,
  register: PropTypes.object,
  store: PropTypes.object,
};

export default Features;
