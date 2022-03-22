import React from 'react';

import Coordinate from './coordinate';


/**
 * ChartGroup
 */
const ChartGroup = (props) =>
{
  const children = Array.isArray(props.children) ? props.children : [props.children];

  const width = props.width || children[0].props.width;
  const height = props.height || children[0].props.height;

  const data = children
    .filter(i => i)
    .map((child, i) =>
    ({
      element: () => 
        React.cloneElement(child, { width, height, data: [(props.data || [])[i]], ...child.props }),
    }));

  return (
    <Coordinate
      width={width}
      height={height}
        data={{ group1: data }}
        xGrid={false}
        yGrid={false}
        xAxis={false}
        yAxis={false}
      />
  )
}

export default ChartGroup;