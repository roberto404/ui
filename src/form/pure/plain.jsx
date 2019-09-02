import React from 'react';
// import PropTypes from 'prop-types';


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

export default Plain;
