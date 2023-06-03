
import React from 'react';


/* !- React Elements */

import Pie from '../../../src/chart/pie';




const Example = () =>
{
  return (
    <div className="flex">
      <div className="col-1-3 inline-block">
        <Pie
          data={[
            { percent: 25, color: 'lightslategray' },
          ]}
          strokeWidth={0.5}
          strokeColor="lightslategray"
        />
      </div>
      <div className="col-1-12 inline-block">
        <Pie
          data={[
            { id: 'a', percent: 20, color: 'red', title: 'foo' },
            { id: 'b', percent: 80, color: 'blue', title: 'foo' },
          ]}
        />
      </div>
      <div className="col-1-12 inline-block">
        <Pie
          data={[{ percent: 20 }, { percent: 10 }, { percent: 40 }, { percent: 10 } ]}
        />
      </div>

    </div>
  );
};

export default Example;
