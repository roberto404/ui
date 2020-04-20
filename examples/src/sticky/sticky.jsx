
import React from 'react';
import { connect } from 'react-redux';


/* !- React Elements */

import Sticky from '../../../src/sticky/sticky';


/* !- Actions */

// ...

/* !- Constants */

// ...

/**
 * GridView + Filters + Connect + Paginate
 */
const Example = () =>
{

  return (
    <div style={{ height: '3vh' }}>
      <h1>Sticky</h1>

      <h2>Simple sticky</h2>

      <div className="bg-gray-light" style={{ width: '300px', height: '300px' }}>
        <Sticky>
          <div className="bg-red" style={{ width: '100px', height: '100px' }}>1</div>
        </Sticky>
      </div>


    </div>
  );
};

export default Example;
