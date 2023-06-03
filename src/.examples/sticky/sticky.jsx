
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
    <div>
      <h1 className="my-1">Sticky</h1>

      <h2>Simple case</h2>

      <div className="border border-gray p-2 m-2 bg-white-light shadow-outer" style={{ paddingBottom: '100vh' }}>
        <div className="" style={{ display: 'flex' }}>
          <div className="bg-gray-light" style={{ width: '50%', height: '200vh' }}>left</div>
          <Sticky>
            <div className="text-center bg-red" style={{ width: '100px', height: '100px' }}>1</div>
          </Sticky>
        </div>
      </div>

      <h2>heightest then view</h2>

      <div className="border border-gray p-2 m-2 bg-white-light shadow-outer" style={{ paddingBottom: '100vh' }}>
        <div className="" style={{ display: 'flex' }}>
          <div className="bg-gray-light" style={{ width: '50%', height: '200vh' }}>left</div>
          <Sticky>
            <div>
              <div className="text-center bg-red" style={{ width: '100px', height: '100px' }}>2</div>
              <div className="text-center bg-green" style={{ width: '100px', height: '100vh' }}>2</div>
              <div className="text-center bg-blue" style={{ width: '100px', height: '100px' }}>2</div>
            </div>
          </Sticky>
        </div>
      </div>

      <h2>heightest then left</h2>

      <div className="border border-gray p-2 m-2 bg-white-light shadow-outer">
        <div className="" style={{ display: 'flex' }}>
          <div className="bg-gray-light" style={{ width: '50%', height: '200vh' }}>left</div>
          <Sticky>
            <div>
              <div className="text-center bg-red" style={{ width: '100px', height: '100vh' }}>3</div>
              <div className="text-center bg-green" style={{ width: '100px', height: '100vh' }}>3</div>
              <div className="text-center bg-blue" style={{ width: '100px', height: '100vh' }}>3</div>
              <div className="text-center bg-yellow" style={{ width: '100px', height: '100vh' }}>3</div>
            </div>
          </Sticky>
        </div>
      </div>


    </div>
  );
};

export default Example;
