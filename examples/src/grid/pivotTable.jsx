
import React, { Component } from 'react';
import count from '@1studio/utils/array/count';
import pivotTable from '@1studio/utils/array/pivotTable';


/* !- React Elements */

import { Grid as GridView } from '../../../src/view';
import Grid from '../../../src/grid/pure/grid';


/* !- Constants */

import { DATA } from './constants';

const fakeApi = () => new Promise(resolve => resolve({ status: 'SUCCESS', records: DATA }));


/**
 * GridRow component Example
 */
class Example extends Component
{
  constructor(props)
  {
    super(props);

    this.state = {
      data: [],
    }
  }
  render()
  {
    const pivotData = pivotTable(this.state.data, 'id', count, ['visits', 'gender']) || [];

    const data = pivotData.map(({ id, title }) =>
    {
      let record = { id };

      if (Array.isArray(title))
      {
        title.forEach(x =>  record[x.id] = x.title);
      }
      else
      {
        record[id] = title;
      }

      return record;
    });

    return (
      <GridView
        id="sample"
        api={fakeApi}
        className="p-4"
        onLoad={({ grid }) => this.setState({ data: grid.data })}
      >
        <Grid
          data={data}
          hook={{
            id: 'Date',
            '1': 'Male',
            '2': 'Female',
            count: { title: 'Sum' },
          }}
        />

      </GridView>
    )
  }
}
export default Example;
