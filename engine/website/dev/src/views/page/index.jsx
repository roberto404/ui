
import React from 'react';
import PropTypes from 'prop-types';


/* !- React Actions */

// ...


/* !- React Elements */

import GridView from '@1studio/ui/view/grid';
import Connect from '@1studio/ui/grid/connect';
import { productPropsParser } from '../../components/product';
import Product from '../../components/product/product';
import ProductCard from '../../components/product/productThumbnail';

/* !- Constants */

// ...


const SETTINGS = {
  paginate:
  {
    page: 1,
    limit: 1,
  },
  // order:
  // {
  //   column: 'm',
  //   order: 'asc',
  // },
  filters:
  [
    {
      id: 'title',
      handler: (record, terms) => productPropsParser(record).id === terms,
      arguments: ['K65904301'],
      // arguments: ['NF11E20051000'],
      status: true,
    },
    // {
    //   id: 'title',
    //   handler: (record, terms) => productPropsParser(record).title.indexOf(terms) !== -1,
    //   arguments: ['szekrény'],
    //   status: true,
    // },
    // {
    //   id: 'brand',
    //   handler: (record, terms) => terms.split(',').indexOf(productPropsParser(record).brand) !== -1,
    //   arguments: ['Bling,Box'],
    //   status: true,
    // },
  ]
}


// const ProductCardGrid = ({ data }) =>
// (
//   <div className="grid">
//     { data.map(props => (
//       <ProductCard
//         key={props.i}
//         {...productPropsParser(props)}
//         className="col-1-4 bg-white"
//       />
//     ))}
//   </div>
// );
const ProductCardGrid = ({ data }) =>
(
  <div className="_grid">
    { data.map(props => (
      <Product
        key={props.i}
        {...productPropsParser(props)}
        // className="col-1-4 bg-white"
      />
    ))}
  </div>
);

/**
* Home Component
*/
const Home = (props, { register, store }) =>
{
  return (
    <div className="wrapper">

        <GridView
          id="products"
          settings={SETTINGS}
        >
          <Connect>
            <ProductCardGrid />
          </Connect>
        </GridView>



      {/*<div className="bold">Home</div>
      <div className="text-green">Galléria - Caroussel 1</div>
      <div className="text-green">Termék válogatás - Caroussel 1, 3</div>
      <div className="text-green">Galéria - Lista 3</div>
      <div>Otthon teremtés</div>
      <div className="text-green">Galéria - Lista 4</div>
      <div className="text-green">Galéria - Lista 2</div>
      <div>Magyar termék</div>
      <div>Rólunk???</div>*/}
    </div>
  );
};

Home.contextTypes =
{
  register: PropTypes.object,
  store: PropTypes.object,
};

export default Home;
