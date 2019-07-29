
import React from 'react';
import { connect } from 'react-redux';


/* !- Actions */

import { setData } from '@1studio/ui/grid/actions';


/* !- React Elements */

import DynamicCaroussel from '../../../src/caroussel/dynamicCaroussel';


/* !- Constants */

const SLIDES = [
  { id: 1, slide: <div>1</div> },
  { id: 2, slide: <div>2</div> },
  { id: 3, slide: <div>3</div> },
  { id: 4, slide: <div>4</div> },
  { id: 5, slide: <div>5</div> },
  { id: 6, slide: <div>6</div> },
];


/**
 * GridView + Filters + Connect + Paginate
 */
const Example = ({ setData }) =>
(
  <div>
    <h2>Static data infinite loop</h2>

    <DynamicCaroussel
      data={SLIDES}
      id="sample1"
    />

    <h2>Dynamic data load</h2>
    <DynamicCaroussel
      id="sample2"
      fetchData={(page) =>
      {
        const items = [];

        for (let i = 0; i < 3; i += 1)
        {
          items.push({ id: i, slide: <div>{page + i}</div> });
        }
        return items;
      }}
    />
  </div>
);

export default connect(null, { setData })(Example);
