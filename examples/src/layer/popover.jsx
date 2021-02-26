
import React from 'react';
import { connect } from 'react-redux';


/* !- React Actions */

import * as LayerActions  from '../../../src/layer/actions';


/* !- Constants */



/**
 * Example Component
 */
const Example = ({
  popover,
}) =>
{
  return (
    <div className="p-2">
      <h2>Classic Popover</h2>
      <button className="outline gray  w-full h-6" onClick={e => popover(<span>Hello</span>, e)}>Popover</button>
      <h2>On mouse position</h2>
      <button className="outline gray w-full h-6" onClick={e => popover(<span>Hello</span>, e, { useMousePosition: true })}>Popover</button>
    </div>
  );
};


export default connect(
  null,
  {
    ...LayerActions,
  },
)(
  Example,
);
