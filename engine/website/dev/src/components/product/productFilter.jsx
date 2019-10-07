
import React from 'react';
import PropTypes from 'prop-types';



/* !- React Actions */

// import { setValues } from '@1studio/ui/form/actions';


/* !- React Elements */

import NestedList, { Accordion } from '@1studio/ui/grid/pure/nestedList';
import Slider from '@1studio/ui/form/pure/slider';

/* !- Constants */


const NESTED_DATA = {
  Title1: [<div>Hello Title1</div>],
  Title2: [<div key="1">Hello Title21</div>, <div key="2">Hello Title22</div>],
};



/**
 * [ProductFilter description]
 */
const ProductFilter = () =>
{
  return (
    <div>
      <div className="text-l heavy">Találatok szűkítése</div>
      <hr />


      <div className="bold mb-1">Ár (Ft)</div>
      <div className="underline text-xs pointer">Összes ár érdekel</div>

      <Slider
        id="price"
        // label="Slider"
        from={3000}
        to={197000}
        // value={[1220, 1650]}
        stateFormat={state => state.map(v => `${Math.round(v)} Ft`)}
        enableStartHandler
        // onTheFly
      />

      <hr />

      <NestedList
        UI={[Accordion, Accordion]}
        nestedData={NESTED_DATA}
      />


    </div>
  );
};

/**
 * defaultProps
 * @type {Object}
 */
ProductFilter.defaultProps =
{
  // flag: [],
  // dimension: {},
  // price_discount: 0,
  // price_orig: 0,
  // price_orig_gross: 0,
  // price_sale: 0,
  // price_sale_gross: 0,
  // vat: 0,
};

ProductFilter.contextTypes =
{
  // register: PropTypes.object,
};


export default ProductFilter;
