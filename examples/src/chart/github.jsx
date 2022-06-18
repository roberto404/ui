
import React from 'react';


/* !- React Elements */

import GithubChart from '../../../src/chart/github';

const Popover = ({ record }) => <div>{record.value}</div>;



/* !- Constants */

const dataByWeeks = [
  { value: 12 }, // 1 week
  { value: 15 }, // 2 week
  { value: 6 }, // ...
  { value: 42 },
  { value: 112 },
  { value: 12 },
];

/**
 * GridView + Filters + Connect + Paginate
 */
const Example = () =>
{
  return (
    <div>
      <GithubChart
        data={dataByWeeks}
        Popover={Popover}
      />
    </div>
  )
};

export default Example;
