import React from 'react';

/* !- React Elements */

import Print from '../../src/print';


/* !- Constants */

/**
 * Printed component
 */
const PrintPages = () => (
  <div>
    <h1>fejlec</h1>
    <div>valami</div>
    <div className="text-xl text-red">valami</div>
    <div>valami</div>
  </div>
);

/**
 * Example CTA
 */
const Example = () =>
(
  <div className="p-4">
    <h1>Print component</h1>

    <h2>Default CTA</h2>
    <Print
      pages={PrintPages}
    />

    <h2>Custom CTA</h2>
    <Print
      className="w-full text-blue underline pointer"
      pages={PrintPages}
      // autoprint
    >
      Print this text or icon...
    </Print>

  </div>
);

export default Example;
