
import { expect } from 'chai';
// import deepFreeze from 'deep-freeze';
// import DataModel from '@1studio/utils/models/data';
// import DataModel from '../../../utils/src/models/data';


// import Reducers from '../../src/grid/reducers';
import * as Filters from '../../src/grid/filters';
// import * as Actions from '../../src/grid/actions';
// import * as Formats from '../../src/grid/formats';
// import SettingsActivity from '../../examples/activity/SettingsActivity';


const SETTINGS = {
  hook:
  {
    id:
    {
      title: '#',
      format: ({ value, helper }) =>
        `abc${value}${helper.status[1]}`, // abc16active
    },
  },
  helper:
  {
    status: { 0: 'inactive', 1: 'active' },
    userId: { 2: 'John', 3: 'Robert' },
  },
};



describe.only('Grid Filters', () =>
{
  const expectFilter = (subject, result = true) =>
  {
    expect(Filters.search({
      record: {
        id: '16',
        status: '0', // inactive
        restaurant: 'cafe',
        userId: '3', // Robert
        date: '2016-12-04',
        time: '23:30:00',
        person: '2',
      },
      hooks: SETTINGS.hook,
      helpers: SETTINGS.helper,
      value: subject,
    })).be[result];
  };

  it('Search Simple', () =>
  {
    expectFilter('2016-12-04');

    expectFilter('fasd', false);
  });

  it('Search helper data', () =>
  {
    expectFilter('inact');
    expectFilter('InAct');
    expectFilter('robert');
    expectFilter('rob');
    expectFilter('BERT');

    expectFilter('roberto', false);
  });


  it('Search hook format', () =>
  {
    expectFilter('16active');
    expectFilter('abc16act');
    expectFilter('d16active', false);
    expectFilter('16actived', false);
    expectFilter('16');
  });

  it('Search more term', () =>
  {
    expectFilter('CAFE,ROB');
    expectFilter('cafe,rob');
    expectFilter('rob,  cafe');
    expectFilter('Rob, cafe');
    expectFilter('cafe   Rob');
    expectFilter('cafe   Tom', false);
    expectFilter('nincs,  cafe', false);
  });

  it('Search expression equal', () =>
  {
    expectFilter('person=2');
    expectFilter('person=3', false);
    expectFilter('person==2');

    expectFilter('restaurant=cafe');
    expectFilter('restaurant=Cafe');
    expectFilter('restaurant=afe');
    expectFilter('restaurant=ABC', false);
    expectFilter('restaurant=cafeABC', false);
  });

  it('Search expression equals', () =>
  {
    expectFilter('restaurant==cafe');

    expectFilter('userId==Rob', false);
    expectFilter('userId==Robert', true);
    expectFilter('userId^=ob', false);
    expectFilter('userId^=Rob', true);
    expectFilter('userId$=obi', false);
    expectFilter('userId$=bert', true);
    expectFilter('userId!=3', true);    // because apply hook => Robert != 3
    expectFilter('userId!=Robert', true); // because result false and check non-hook version => 3 != Robert
    expectFilter('person!=4', true); // working only non-hooked or formated version
    expectFilter('person!=2', false);
  });

  it('Search expression less or more than', () =>
  {
    expectFilter('person>=2');
    expectFilter('person<3');
    expectFilter('person>2', false);
  });

  it('Search expression regex', () =>
  {
    expectFilter('userId*=Rob', true);
    expectFilter('userId*=ob', true);
    expectFilter('userId*=obi', false);
  });

  it('more search expression', () =>
  {
    expectFilter('person=2,id=16');
    expectFilter('person=2, id=17', false);
    expectFilter('person=2,person=16', false);
    expectFilter('person=2,Rob', true);
    expectFilter('person=2,John', false);
  });

  it('search OR expression', () =>
  {
    expectFilter('person=2|id=16');
    expectFilter('person=2|id>16');
    expectFilter('person=3|id=16');
    expectFilter('person=3|id>16', false);
  });

  it('search OR/AND expression', () =>
  {
    expectFilter('person=2&id=18|restaurant=cafe');
    expectFilter('person=2&id=18|id=16&restaurant=cafe');

    expectFilter('person=2&id=18|id=18&restaurant=cafe', false);
    expectFilter('person=3|id=18&restaurant=cafe', false);
  });

  it('search FULL expression', () =>
  {
    expectFilter('rob,person=2&id=18|cafe, id=16');
    expectFilter('rob,person=2&id=18|cafe, id=17', false);
  });
});
