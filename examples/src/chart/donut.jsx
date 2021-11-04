
import React from 'react';


/* !- React Elements */

import Donut from '../../../src/chart/donut';




const Example = () =>
{
  return (
    <div className="flex">
      <div className="col-1-3 inline-block">
        <Donut
          color="#009688"
          percent={25}
          caption="hello world"
        />
      </div>
      <div className="col-1-12 inline-block">
        <Donut
          color="red"
          percent={75}
          strokeWidth={4}
          caption="hello world"
        />
      </div>

    </div>
  );
};

export default Example;
