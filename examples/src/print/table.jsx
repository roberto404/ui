import React from 'react';

import Table from '../../../src/print/table';
import PivotTable from '@1studio/utils/array/pivotTable';
import { count } from '@1studio/utils/array';


const pivot = new PivotTable(
  [
    { "id": 1, "name": "Megan J. Cushman", "gender": '1', "age": '22', "visits": "2017-07-23" },
    { "id": 2, "name": "Taylor R. Fallin", "gender": '2', "age": '26', "visits": "2017-07-22" },
    { "id": 3, "name": "Jose C. Rosado", "gender": 1, "age": '28', "visits": "2017-07-22" },
    { "id": 4, "name": "Sammy C. Brandt", "gender": 1, "age": '32', "visits": "2017-07-22" },
    { "id": 5, "name": "June K. Jenkins", "gender": 2, "age": '26', "visits": "2017-06-10" },
    { "id": 6, "name": "Pamela R. Benson", "gender": 2, "age": '28', "visits": "2017-05-23" },
    { "id": 7, "name": "James H. Kelly", "gender": 1, "age": '22', "visits": "2017-04-23" },
    { "id": 8, "name": "Joseph D. Black", "gender": 1, "age": '26', "visits": "2017-03-23" },
    { "id": 9, "name": "Kellie E. Franklin", "gender": 2, "age": '32', "visits": "2017-02-23" },
    { "id": 10, "name": "Wayne D. Price", "gender": 1, "age": '32', "visits": "2017-01-23" },
    { "id": 11, "name": "Michael P. Danley", "gender": 1, "age": '22', "visits": "2016-07-23" },
    { "id": 12, "name": "Weston S. Taylor", "gender": 1, "age": '22', "visits": "2015-07-23" },
  ],
  'id',
  count,
  ['age', 'gender']
)
.toTable();

console.log(pivot);

const Example = () =>
{

  return (
    <div>

      <h2>Simple</h2>
      <div className="w-auto mb-2 bg-white-light shadow-outer-2">
        <Table
          head={[['title', 'col1', 'col2', 'col3']]}
          body={[
            ['title #1', '1', '2', '3'],
            ['title #2', '1', '2', '3'],
            ['title #3', '1', '2', '3'],
          ]}
          width={850}
        />
      </div>

      <h2>Split cols</h2>
      <div className="w-auto mb-2 bg-white-light shadow-outer-2">
        <Table
          body={[
            ['title #1', ['1', '2', ['a', 'b', 'c', 'd']], ['1', '2', '3'], ['1', '2', '3']],
            ['title #2', ['1', '2', '3'], ['1', '2', '3'], ['1', '2', '3']],
            ['title #3', ['1', '2', '3'], ['1', '2', '3'], ['1', '2', '3']],
          ]}
          width={850}
        />
      </div>
      

      <h2>Custom & Dyn Children</h2>
      <div className="w-auto mb-2 bg-white-light shadow-outer-2">
        <Table
          body={[
            {
              ...['title #1', '1', '2', '3'],
              children: (
                <g height={100}>
                  <defs>
                    <pattern id="pinstripe" patternUnits="userSpaceOnUse" width="50" height="50">
                      <line x1="0" y1="0" x2="50" y2="50" stroke="goldenrod" stroke-width="25" />
                    </pattern>
                  </defs>
                  <rect x="0" width="1372" height="100" fill="url(#pinstripe)" />
                </g>
              ),
            },
            {
              ...['title #11', '1', '2', '3'],
              children: ({ width, height }) => (
                <rect x="0" width={width} height={height} fill="red" />
              ),
            },
            ['title #2', ['1', '2', '3'], ['1', '2', '3'], ['1', '2', '3']],
            {
              ...['title #3', '1.11', '2.22', '3.33'],
              children: [
                ['title #31', ['1', '2', '3'], ['1', '2', '3'], ['1', '2', '3']],
                ['title #32', ['1', '2', '3'], ['1', '2', '3'], ['1', '2', '3']],
                ['title #33', ['1', '2', '3'], ['1', '2', '3'], ['1', '2', '3']],
              ],
            },
            ['title #5', '1', '2', '3']
          ]}
          width={850}
        />
      </div>


      <h2>Nested</h2>
      <div className="w-auto mb-2 bg-white-light shadow-outer-2">
        <Table
          body={[
            ['title #1', 1, 2, 3],
            {
              ...['title #2', '1.11', '2.22', '3.33'],
              children: [
                ['title #21', 1,2,3],
                // {
                //   0: 'title #22',
                //   children: [
                //     ['title #221', 1, 2, 3],
                //     ['title #222', 1, 2, 3],
                //     ['title #223', 1, 2, 3],
                //   ],
                // },
                ['title #23', ['1', '2', '3'], ['1', '2', '3'], ['1', '2', '3']],
              ],
            },
            ['title #3', '1', '2', '3']
          ]}
          width={850}
        />

      </div>

      <h2>Working with pivot (count: age/gender)</h2>
      <Table body={pivot} />
    </div>
  );
};

export default Example;