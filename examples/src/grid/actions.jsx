import React from 'react';
import { connect } from 'react-redux';
import * as Actions from '../src/grid/actions';


const data = [
  { id: 1, name: 'Megan J. Cushman', gender: 1, visits: '2017-07-23' },
  { id: 2, name: 'Taylor R. Fallin', gender: 2, visits: '2017-07-22' },
  { id: 3, name: 'Jose C. Rosado', gender: 1, visits: '2017-07-20' },
  { id: 4, name: 'Sammy C. Brandt', gender: 1, visits: '2017-07-10' },
];

const settings = {
  order: {
    column: 'id',
    direction: 'desc',
  },
  filters: [
    {
      id: 'gender',
      handler: (record, value) =>
      record.gender === value,
      arguments: [],
      status: false,
    },
  ],
};

const ExampleGridActions = (
{
  setData,
  addRecord,
  modifyRecord,
  setSettings,
  setHook,
  setHelper,
  changeOrder,
  applyFilter,
  flush,
},
) =>
{
  setData(data, settings);
  // setData(data, {}, 'first');
  // changeOrder(settings.order, 'first');
  // changeOrder(settings.order);
  // setSettings({ filters: settings.filters }, 'first');
  applyFilter('gender', 2);
  // flush();
  // setData(data, { filters: settings.filters }, 'first');
  // applyFilter('gender', 2);
  return <div />;
}

export default connect(
  null,
  Actions,
)(ExampleGridActions);
