
import React from 'react';


/* !- React Elements */

import Coordinate from '../../../src/chart/coordinate';


/* !- Elements */

import ChartGroup from '../../../src/chart/group';
import ChartBar from '../../../src/chart/bar';
import ChartLine from '../../../src/chart/line';


/**
 * GridView + Filters + Connect + Paginate
 */
const Example = () =>
{
  const data = [
    {
      id: 's1',
      label: 'store1',
      values: [100, 200, 50],
      xAxis: ['Lorem', 'ipsum', 'dolor'],
    },
    {
      id: 's2',
      label: 'store2',
      values: [20, 30, 10],
      xAxis: ['RS1', 'RS2', 'RS3'],
    },
  ];


  return (
    <div>
      <h2>Negative Bar without xAxis labels</h2>

      <ChartBar
        width={800}
        height={250}
        data={[{
          id: 'negative',
          label: "Negative",
          values: [10, -30, 25, -5],
        }]}
      />


      {/* <h2>Bar chart</h2>

      <ChartBar
        width={800}
        height={250}
        data={[data[0]]}
      />


      <h2>Double bar</h2>

      <ChartBar
        width={800}
        height={250}
        data={data}
        className="chart bar yellow"
      />

      <h2>Bar + Line to compare</h2> */}
 

      {/* <ChartGroup
        width={800}
        height={250}
        data={data}
      >
        <ChartBar />
        <ChartLine
          xGrid={false}
          xAxis={false}
          yAxis={false}
          y2Axis={true}
        />
      </ChartGroup> */}

    </div>
  );
};

export default Example;
