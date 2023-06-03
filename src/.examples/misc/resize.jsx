import React from 'react';


/* !-- Components */

import Resize from '../../resize';


const TargetElement = ({ width, height }) =>
  (
    <svg width={width} height={height}>
      <rect width="100%" height="100%" style={{ fill: 'rgb(0, 255, 0)'}} />
    </svg>
  );

  
const ExampleResize = () =>
{
  return (
    <div style={{ width: 100, height: 100 }}>
      <Resize
        // width={100}
        // height={100}
      >
        <TargetElement />
      </Resize>

    </div>
  )
};

export default ExampleResize;