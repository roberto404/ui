import React from 'react';


/* !- React Elements */

import Toggle from '../../../src/form/components/toggleStandalone';


/* !- Constants */

const fakeApi = () => new Promise(resolve => setTimeout(() => resolve({ status: 1 }), 1000));




/**
 * [Example description]
 */
const Example = () =>
(
  <div>
    <h2>Standalon toggle</h2>

    <Toggle id="12" status="0" api={fakeApi} />    
  </div>
);

export default Example;
