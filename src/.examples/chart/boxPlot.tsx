
import React from 'react';


/* !- Elements */

import ChartBoxPlot from '../../chart/boxPlot';


/* !- Constants */

/**
 * 
 */
const Example = () => {
  return (
    <div>
      <ChartBoxPlot
        min={40000}
        qMin={10000}
        Q1={50000}
        Q2={110000}
        Q3={230000}
        qMax={500000}
        max={800000}
        mode={[100500, 190000]}
        height={80}
        width={500}
      />
    </div>
  )
};

export default Example;
