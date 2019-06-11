
import React from 'react';


/* !- React Elements */

// import Layer from '@1studio/ui/layer';
import Layer from '../../src/layer';


/* !- Example: Grid */

// import Example from './grid/static';
// import Example from './grid/connect';
// import Example from './grid/dynamic';
// import Example from './grid/filters';
// import Example from './grid/extra';
import Example from './grid/complex';

/* !- Example: Layer */

// import Example from './layer/actions';


/* !- Example: Calendar */

// import Example from './calendar/';


export default () =>
(
  <div className="application">
    <Example />
    <Layer />
  </div>
);
