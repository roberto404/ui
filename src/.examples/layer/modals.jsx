
import React from 'react';
import { connect } from 'react-redux';


/* !- React Actions */

import * as LayerActions from '../../../src/layer/actions';


/* !- Constants */

import { MODAL_PROPS } from '../../../src/layer/constants';


/**
 * Example Component
 */
const Example = ({
  modal,
}) =>
{
  const onClickModalListener = (input = 'undefined') =>
  {
    console.log(input);
  }

  return (
    <div className="p-2">
      <h2>Classic action modal</h2>
      <button className="outline gray w-auto" onClick={() => modal(MODAL_PROPS.delete(onClickModalListener))}>Delete</button>
      <h2>With message</h2>
      <button className="outline gray w-auto" onClick={() => modal(MODAL_PROPS.deleteWithMessage(onClickModalListener))}>Delete</button>
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
