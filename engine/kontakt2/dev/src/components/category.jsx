
import React from 'react';
import PropTypes from 'prop-types';
import Tree from '@1studio/utils/models/tree';


/* !- React Actions */

//..


/* !- React Elements */

import { ProductCard } from './product';


/**
 * [Category description]
 */
const Category = (
  {
    id,
    title,
    template_title,
    template_subtitle,
    features,
    featuresRegEx,
  },
  {
    register,
  },
) =>
{
  const helper = register && register.data.category ? register.data.category : {};

  const featuresModel = !features ? [] :
    features.split(',').map(featureId => helper.features.find(feature => feature.id === featureId));

  if (!helper || !helper.categoriesWeb)
  {
    return <div />;
  }

  const categoryTree = new Tree(helper.categoriesWeb);

  /**
   *  Affected webcategory records
   * @type {Array} [{ id, title, pid, pos, categories }, ...]
   */
  const categoriesWeb = helper.categoriesWeb.filter(
    category => category.categories && typeof JSON.parse(category.categories)[id] !== 'undefined',
  );

  /**
   * Web categories with full path
   * @type {Array} [' Otthon › Nappali › Komod ']
   */
  const categoryWebPathes = categoriesWeb.map(({ id }) =>
    categoryTree.getPath(id).map(pathId => categoryTree.getItem(pathId).title).slice(1).join(' › '),
  );

  return (
    <div>
      <div className="mb-1 light">{id}.</div>
      <div className="mb-1 text-xxl bold">{title}</div>
      <div className="mb-2 light">
        { categoryWebPathes.map((path, index) => (
          <div key={index} className="mb-1/2">
            <span>{path}</span>
            <span className="px-1 text-red">{categoriesWeb[index].categories ? JSON.stringify(JSON.parse(categoriesWeb[index].categories)[id]) : ''}</span>
          </div>
        ))}
      </div>
      <div className="grid-2">
        <div className="col-1-3">
          <div
            className="p-1 m-1 border border-gray-light shadow"
            style={{ width: 'calc(250px + 2rem)' }}
          >
            <ProductCard
              title={`Márka ${template_title}`}
              subtitle={template_subtitle}
              price_sale_gross="1999"
            />
          </div>
        </div>
        <div className="col-2-3">
          <div className="mb-1 heavy">Választható jellemzők</div>
          { featuresModel.map(f => (
            <div key={f.id} className="mb-1/2 light">
            {f.id}. {f.title}: {f.options}
            </div>)) }
        </div>
      </div>
      <hr/>
      <div>{featuresRegEx}</div>
    </div>
  );
};

/**
 * defaultProps
 * @type {Object}
 */
Category.defaultProps =
{
  template_title: '',
  template_subtitle: '',
};

Category.contextTypes =
{
  register: PropTypes.object,
}


export default Category;
