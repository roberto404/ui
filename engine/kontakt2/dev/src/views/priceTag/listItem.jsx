
import React from 'react';

/* !- React Elements */
import templates from './templates/';


/**
* NestedList Level2 Component
*/
export default ({ items }) =>
  React.createElement(templates[items.type], items.props);
