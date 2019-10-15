import React from 'react';


import ProductThumbnail from '../../../src/components/product/productThumbnail'

const Example = () =>
(
  <div>
    <ProductThumbnail
      record={{
        id: '8F20105F0',
        related_id: '8F20105F0',
        brand: 'Rómeó',
        manufacturer: '8',
        title: '-F105 fürdőszoba szekrény',
        subtitle: 'mdf, tükrös, felső, elem',
        price_discount: 0,
        price_orig_gross: 47760,
        price_sale_gross: 47760,
        flag: ['HUN'],
        images: [15],
        features: { 33: 2, 1: 5 },
        dimension: { w: 105, h: 100, d: 18 },
        color: '',
        incart: true,
        description: 'termék leírás',
        stock: [-17, [-1, -1, -1]],
      }}
    />
  </div>
);


export default Example;
