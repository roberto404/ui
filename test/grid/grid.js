//
// import { createStore } from 'redux';
// import { expect } from 'chai';
// import deepFreeze from 'deep-freeze';
// // import DataModel from '@1studio/utils/models/data';
// import DataModel from '../../../utils/src/models/data';
//
//
// import Reducers from '../../src/grid/reducers';
// import * as Filters from '../../src/grid/filters';
// import * as Actions from '../../src/grid/actions';
// import * as Formats from '../../src/grid/formats';
// import SettingsActivity from '../../examples/activity/SettingsActivity';
//
//
// describe('Grid Reducers', () =>
// {
//   const data = [
//     { id: 1, name: 'Megan J. Cushman', gender: 1, visits: '2017-07-23' },
//     { id: 2, name: 'Taylor R. Fallin', gender: 2, visits: '2017-07-22' },
//     { id: 3, name: 'Jose C. Rosado', gender: 1, visits: '2017-07-20' },
//     { id: 4, name: 'Sammy C. Brandt', gender: 1, visits: '2017-07-10' },
//   ];
//
//   const settings = {
//     order: {
//       column: 'id',
//       direction: 'desc',
//     },
//     paginate: {
//       page: 3,
//       limit: 1,
//     },
//     filters: [
//       {
//         id: 'gender',
//         handler: (record, value) =>
//         record.gender === value,
//         arguments: [],
//         status: false,
//       },
//     ],
//   };
//
//   let store;
//
//   before(() =>
//   {
//     deepFreeze(data);
//     deepFreeze(settings);
//   });
//
//   beforeEach(() =>
//   {
//     store = createStore(Reducers);
//   });
//
//   it('Handle missing action types', () =>
//   {
//     expect(Reducers(undefined)).to.eql({});
//     expect(Reducers(undefined, { type: '' })).to.eql({});
//     expect(Reducers(undefined, { type: 'MISSING_TYPE' })).to.eql({});
//   });
//
//   it('Pure Reducers', () =>
//   {
//     const store = createStore(Reducers);
//     const stateBefore = store.getState();
//
//     const actionSetData = {
//       type: 'SET_GRID_DATA',
//       data,
//       settings,
//     };
//
//     const actionApplyFilter = {
//       type: 'APPLY_GRID_FILTER',
//       filters: [{ id: 'filterId', arguments: ['filterValue'], status: true }],
//     };
//
//     const actionDetachFilter = {
//       type: 'DETACH_GRID_FILTER',
//       filterId: 'gender',
//       filterValue: 1,
//     };
//
//     deepFreeze(stateBefore);
//     deepFreeze(actionSetData);
//     deepFreeze(actionApplyFilter);
//     deepFreeze(actionDetachFilter);
//
//     store.dispatch(actionSetData);
//     store.dispatch(actionApplyFilter);
//     store.dispatch(actionDetachFilter);
//   });
//
//   it('setData', () =>
//   {
//     store.dispatch(Actions.setData([]));
//     store.dispatch(Actions.setData(data));
//     expect(store.getState().data).to.deep.equal(data);
//   });
//
//   it('setData with gridID', () =>
//   {
//     store.dispatch(Actions.setData(data, {}, 'first'));
//     store.dispatch(Actions.setData(data, {}, 'second'));
//
//     expect(store.getState().second.data).to.deep.equal(data);
//     expect(store.getState().first.data).to.deep.equal(data);
//   });
//
//   it('setData with gridID and without gridID', () =>
//   {
//     store.dispatch(Actions.setData(data, {}, 'first'));
//     store.dispatch(Actions.setData(data, {}));
//     store.dispatch(Actions.setData(data, {}, 'second'));
//
//     expect(store.getState().data).to.deep.equal(data);
//     expect(store.getState().first.data).to.deep.equal(data);
//     expect(store.getState().second.data).to.deep.equal(data);
//   });
//
//
//   it('flush', () =>
//   {
//     store.dispatch(Actions.setData(data, {}, 'first'));
//     store.dispatch(Actions.setData(data, {}));
//     store.dispatch(Actions.setData(data, {}, 'second'));
//
//     expect(Object.keys(store.getState()).indexOf('second')).not.equal(-1);
//     store.dispatch(Actions.flush('second'));
//     expect(Object.keys(store.getState()).indexOf('second')).to.equal(-1);
//
//     store.dispatch(Actions.flush());
//     expect(store.getState()).to.deep.equal({});
//   });
//
//   it('addRecord', () =>
//   {
//     const newRecord = { id: 5, name: 'John Doe', gender: 1, visits: '2222-02-22' };
//
//     deepFreeze(newRecord);
//
//     store.dispatch(Actions.setData(data));
//     store.dispatch(Actions.addRecord(newRecord));
//
//     expect(store.getState().data[4]).to.deep.equal(newRecord);
//   });
//
//   it('addRecord with gridID', () =>
//   {
//     const newRecord = { id: 5, name: 'John Doe', gender: 1, visits: '2222-02-22' };
//
//     deepFreeze(newRecord);
//
//     store.dispatch(Actions.setData(data, {}, 'first'));
//     store.dispatch(Actions.addRecord(newRecord, 'first'));
//
//     expect(store.getState().first.data[4]).to.deep.equal(newRecord);
//   });
//
//   it('modifyRecord', () =>
//   {
//     const modifiedRecord = { id: 4, gender: 2 };
//
//     deepFreeze(modifiedRecord);
//
//     store.dispatch(Actions.setData(data));
//     store.dispatch(Actions.modifyRecord(modifiedRecord));
//
//     expect(store.getState().data[3]).to.deep.equal({ ...data[3], ...modifiedRecord });
//   });
//
//   it('modifyRecord with gridID', () =>
//   {
//     const modifiedRecord = { id: 4, gender: 2 };
//
//     deepFreeze(modifiedRecord);
//
//     store.dispatch(Actions.setData(data, {}, 'first'));
//     // store.dispatch(Actions.setData(data));
//     store.dispatch(Actions.modifyRecord(modifiedRecord, 'first'));
//
//     expect(store.getState().first.data[3]).to.deep.equal({ ...data[3], ...modifiedRecord });
//   });
//
//   it('setSettings', () =>
//   {
//     store.dispatch(Actions.setData(data));
//     store.dispatch(Actions.setSettings({ paginate: settings.paginate }));
//
//     expect(store.getState().data).to.deep.equal([data[2]]);
//   });
//
//   it('setSettings width gridID', () =>
//   {
//     store.dispatch(Actions.setData(data, {}, 'first'));
//     store.dispatch(Actions.setSettings(
//       {
//         paginate: {
//           page: 3,
//           limit: 1,
//         },
//       },
//       'first',
//     ));
//
//     expect(store.getState().first.data).to.deep.equal([data[2]]);
//   });
//
//   it('setHook', () =>
//   {
//     store.dispatch(Actions.setData(data, {}, 'first'));
//     store.dispatch(Actions.setData(data));
//     store.dispatch(Actions.setHook(
//       {
//         foo: 'bar'
//       },
//     ));
//     store.dispatch(Actions.setHook(
//       {
//         foo: 'bar2'
//       },
//       'first',
//     ));
//
//     expect(store.getState().hook.foo).to.equal('bar');
//     expect(store.getState().first.hook.foo).to.equal('bar2');
//   });
//
//   it('changeOrder', () =>
//   {
//     store.dispatch(Actions.setData(data, {}, 'first'));
//     store.dispatch(Actions.setData(data));
//     store.dispatch(Actions.changeOrder(settings.order));
//     store.dispatch(Actions.changeOrder(settings.order.column, 'first'));
//
//     expect(store.getState().data[0].id).to.equal(4);
//     expect(store.getState().first.data[0].id).to.equal(4);
//   });
//
//   it('changeOrder', () =>
//   {
//     store.dispatch(Actions.setData(data, { paginate: settings.paginate }, 'first'));
//     store.dispatch(Actions.setData(data, { paginate: settings.paginate }));
//     store.dispatch(Actions.goToPage(2));
//     store.dispatch(Actions.goToPage(2, 'first'));
//
//     expect(store.getState().data[0].id).to.equal(2);
//     expect(store.getState().first.data[0].id).to.equal(2);
//   });
//
//   it('modifyLimit', () =>
//   {
//     store.dispatch(Actions.setData(data, {}, 'first'));
//     store.dispatch(Actions.setData(data, {}));
//     store.dispatch(Actions.modifyLimit(1));
//     store.dispatch(Actions.modifyLimit(1, 'first'));
//
//     expect(store.getState().data.length).to.equal(1);
//     expect(store.getState().first.data.length).to.equal(1);
//   });
//
//   it('applyFilter', () =>
//   {
//     store.dispatch(Actions.setData(data, settings));
//     store.dispatch(Actions.applyFilter('gender', 2));
//
//     expect(store.getState().data[0].gender).to.eql(2);
//   });
//
//   it('applyFilter with gridId', () =>
//   {
//     store.dispatch(Actions.setData(data, settings, 'first'));
//     store.dispatch(Actions.applyFilter('gender', 2, 'first'));
//
//     expect(store.getState().first.data[0].gender).to.eql(2);
//   });
//
//   it('detachFilter', () =>
//   {
//     store.dispatch(Actions.setData(data, settings));
//     store.dispatch(Actions.applyFilter('gender', 2))
//     store.dispatch(Actions.detachFilter('gender', 2));
//
//     expect(store.getState().data[0].gender).to.eql(1);
//
//     store.dispatch(Actions.applyFilter('gender', 2))
//     store.dispatch(Actions.detachFilter('gender'))
//     expect(store.getState().data[0].gender).to.eql(1);
//   });
//
//   it('detachFilter with gridID', () =>
//   {
//     store.dispatch(Actions.setData(data, settings, 'first'));
//     store.dispatch(Actions.applyFilter('gender', 2, 'first'))
//     store.dispatch(Actions.detachFilter('gender', 2, 'first'));
//
//     expect(store.getState().first.data[0].gender).to.eql(1);
//
//     store.dispatch(Actions.applyFilter('gender', 2, 'first'))
//     store.dispatch(Actions.detachFilter('gender', null, 'first'))
//     expect(store.getState().first.data[0].gender).to.eql(1);
//   });
// });
//
// describe('Grid Filters', () =>
// {
//   const expectFilter = (subject, result = true) =>
//   {
//     expect(Filters.search({
//       record: {
//         id: '16',
//         tipsId: '1',
//         status: '2', // Megérkezett
//         restaurantId: '4', // Cafe Vian Liszt F. tér
//         userId: '3', // Robi
//         date: '2016-12-04',
//         time: '23:30:00',
//         person: '2',
//       },
//       hooks: SettingsActivity.hook,
//       helpers: SettingsActivity.helper,
//       value: subject,
//     })).be[result];
//   };
//
//   it('Search Simple', () =>
//   {
//     expectFilter('2016-12-04');
//   });
//
//   it('Search Join array', () =>
//   {
//     expectFilter('Meg');
//   });
//
//   it('Search Join object', () =>
//   {
//     expectFilter('c');
//     expectFilter('Rob');
//     expectFilter('VIAN');
//   });
//
//   it('Search more', () =>
//   {
//     expectFilter('VIAN,ROB');
//     expectFilter('rob,  vian');
//     expectFilter('nincs,  vian', false);
//     expectFilter('Rob vian');
//     expectFilter('vian   Rob');
//     expectFilter('vian   Tom', false);
//   });
//
//   it('Search term', () =>
//   {
//     expectFilter('person=2');
//     expectFilter('person=3', false);
//     expectFilter('person==2');
//     expectFilter('person>=2');
//     expectFilter('person<3');
//     expectFilter('person>2', false);
//     expectFilter('person!=2', false);
//   });
//
//   it('more search term', () =>
//   {
//     expectFilter('person=2,id=16');
//     expectFilter('person=2, id=17', false);
//     expectFilter('person=2,person=16', false);
//     expectFilter('person=2,Vian', true);
//   });
// });
//
// describe('Grid Hook predefied format methos', () =>
// {
//   it('averageDeviation', () =>
//   {
//     const data = [
//       { id: 1, field: 2 },
//       { id: 1, field: 4 },
//       { id: 1, field: 6 },
//     ];
//
//     const props = {
//       column: 'field',
//       last: true,
//       value: 0,
//     };
//
//     const state = {
//       grid: {
//         model: new DataModel(data),
//       },
//     };
//
//     // avg 4.
//     expect(Formats.averageDeviation(props)(state)).to.equal(0);
//     expect(Formats.averageDeviation({ ...props, value: 2 })(state)).to.equal(-0.5);
//     expect(Formats.averageDeviation({ ...props, value: 4 })(state)).to.equal(0);
//     expect(Formats.averageDeviation({ ...props, value: 6 })(state)).to.equal(0.5);
//     expect(Formats.averageDeviation({ ...props, value: 8 })(state)).to.equal(1);
//   });
// });
