
import React from 'react';

/* !- React Elements */

import NestedList, { Accordion } from '../../../src/grid/pure/nestedList';


/* !- Constants */

const NESTED_DATA = {
  Title1: [<div>Hello Title1</div>],
  Title2: [<div key="1">Hello Title21</div>, <div key="2">Hello Title22</div>],
};


/**
 * GridView + Filters + Connect + Paginate
 */
const Example = () =>
(
  <div className="p-2">
    <NestedList
      UI={[Accordion, Accordion]}
      nestedData={NESTED_DATA}
      className="accordion"
    />
  </div>
);

export default Example;
