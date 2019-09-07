
import React from 'react';


/* !- React Elements */

// import Layer from '@1studio/ui/layer';
import Layer from '../../src/layer';


/* !- Example: Style */

// import Example from './style/avatar';
// import Example from './style/buttons';
// import Example from './style/screen';
// import Example from './icon/mui';
// import Example from './icon/la';



/* !- Example: Form */

// import Example from './form/basic';
// import Example from './form/fields';
// import Example from './form/submit';
// import Example from './form/connect';
// import Example from './form/flat';
// import Example from './form/plain';


/* !- Example: Grid */

// import Example from './grid/static';
// import Example from './grid/connect';
// import Example from './grid/dynamic';
// import Example from './grid/filters';
// import Example from './grid/extra';
// import Example from './grid/complex';
// import Example from './grid/list';
// import Example from './grid/casual';
// import Example from './grid/pivotTable';
import Example from './grid/pivotTableComplex';
// import Example from './grid/withoutGrid';


/* !- Example: Layer */

// import Example from './layer/actions';


/* !- Example: Caroussel */

// import Example from './caroussel/slides';
// import Example from './caroussel/caroussel';
// import Example from './caroussel/dynamic';


/* !- Example: Calendar */

// import Example from './calendar/static';
// import Example from './calendar/week';
// import Example from './calendar/dynamic';
// import Example from './calendar/caroussel';
// import Example from './calendar/filters';


// import Example from './print';


/* !- Example: Chart */

// import Example from './chart/coordinate';
// import Example from './chart/complex';


/* !- Example: Map */

// import Example from './map/gmaps';
// import Example from './map/mapbox/static';
// import Example from './map/mapbox/dynamic';


export default () =>
(
  <div className="application">
    <Example />
    <Layer />
  </div>
);
