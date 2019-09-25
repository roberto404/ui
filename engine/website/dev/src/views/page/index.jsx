
import React from 'react';
import PropTypes from 'prop-types';


/* !- React Actions */

// ...


/* !- React Elements */

import { ProductCard } from '../../components/product';


/* !- Constants */

// ...

const PRODUCT = {
  id: 1,
  related_id: 1,
  brand: 'Nepo',
  // manufacturer: '',
  title: 'szekrény',
  // title_orig: '',
  // title_orig_rest: '',
  subtitle: 'bútorlapos, akasztós, polcos',
  price_discount: 12,
  // price_orig: '',
  price_orig_gross: 35990,
  // price_sale: '',
  price_sale_gross: 39900,
  // vat: '',
  flag: ['RSTOP', 'SALE'],
  // category: '',
  features: '',
  dimension: '',
  color: '',
  images: ['112', '113'],
  // instore: '',
  incart: 1,
  description: '',
  // priority: '',
  // className: '',
  // onClick: '',
}

const PRODUCT2 = {
  id: 1,
  related_id: 1,
  brand: 'Fineline',
  // manufacturer: '',
  title: 'étkezőasztal 120x85 cm (világos sonoma)',
  // title_orig: '',
  // title_orig_rest: '',
  subtitle: 'bútorlapos, polcos, vitrines, fali elemek, 2 ajtós, 1 üvegajtós, blokk, több színben, -3',
  price_discount: 5,
  // price_orig: '',
  price_orig_gross: 49990,
  // price_sale: '',
  price_sale_gross: 39900,
  // vat: '',
  flag: ['RSTOP', 'SALE'],
  // category: '',
  features: '',
  dimension: '',
  color: '',
  images: ['112', '113'],
  // instore: '',
  incart: 1,
  description: '',
  // priority: '',
  // className: '',
  // onClick: '',
}
const PRODUCT3 = {
  id: 1,
  related_id: 1,
  brand: 'Nepo',
  title: 'szekrény',
  subtitle: '',
  price_discount: 0,
  price_orig_gross: 39900,
  price_sale_gross: 39900,
  flag: ['RSTOP', 'SALE'],
  features: '',
  dimension: '',
  color: '',
  images: ['112', '113'],
  incart: 1,
  description: '',
}



/**
* Home Component
*/
const Home = (props, { register, store }) =>
{
  return (
    <div className="py-2">


      <div className="p-4" style={{ width: '900px' }}>

        <div className="grid">

          <ProductCard
            {...PRODUCT}
            className="col-1-4"
          />

          <ProductCard
            {...PRODUCT2}
          />

          <ProductCard
            {...PRODUCT3}
          />

        </div>



      </div>

      <div className="bold">Home</div>
      <div className="text-green">Galléria - Caroussel 1</div>
      <div className="text-green">Termék válogatás - Caroussel 1, 3</div>
      <div className="text-green">Galéria - Lista 3</div>
      <div>Otthon teremtés</div>
      <div className="text-green">Galéria - Lista 4</div>
      <div className="text-green">Galéria - Lista 2</div>
      <div>Magyar termék</div>
      <div>Rólunk???</div>
    </div>
  );
};

Home.contextTypes =
{
  register: PropTypes.object,
  store: PropTypes.object,
};

export default Home;
