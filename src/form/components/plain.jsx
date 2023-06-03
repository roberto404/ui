import React from 'react';
import { bindFormContexts } from '../context';


/* !- React Elements */

import Field from '../formField';


/**
* Input Component
*
* @extends Field
*/
class Plain extends Field
{
  /**
   * This method is called when render the Component instance.
   * @override
   * @return {ReactElement}
   */
  render()
  {
    return this.renderPlainField();
  }
}

export default bindFormContexts(Plain);
