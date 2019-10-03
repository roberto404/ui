// npx babel-node ./benchmark/data.js

import Benchmark from 'benchmark';
import Data from '../src/models/data';
import sort from '../src/array/sort';
import toNumber, { NOT_NAN_REGEX } from '../src/string/toNumber';


import stockJson from '../../../../public_html/kontakt2/json/stock.json';

const SETTINGS = {
  paginate:
  {
    page: 1,
    limit: 50,
  },
  order:
  {
    // column: 'id',
    column: (a, b) => a.id.toLowerCase().localeCompare(b.id.toLowerCase()) === 1,
    order: 'asc',
  },
  filters:
  [
    {
      id: 'search',
      handler: (record, term) => Object.keys(record).some(index => record[index]
        .toString()
        .toLowerCase()
        .indexOf(term.toString().toLowerCase()) >= 0,
      ),
      // arguments: ['IBIZA FOTEL 1.'],
      arguments: ['I'],
      status: true,
    },
  ],
};



// data model sort compare method
const sortMethod = (recordOne, recordTwo) =>
{
  let a = recordOne[SETTINGS.order.column] || '';
  let b = recordTwo[SETTINGS.order.column] || '';

  // string looks like a number => convert to number
  const aLikeNum = typeof a === 'string' && NOT_NAN_REGEX.test(a);
  const bLikeNum = typeof b === 'string' && NOT_NAN_REGEX.test(b);

  if (aLikeNum && (typeof b === 'number' || bLikeNum))
  {
    a = toNumber(a);
  }

  if (bLikeNum && typeof a === 'number')
  {
    b = toNumber(b);
  }

  if (!isNaN(a) && !isNaN(b))
  {
    return parseFloat(a) >= parseFloat(b);
  }

  return a.toLowerCase().localeCompare(b.toLowerCase()) === 1;
};


const simpleSortMethod = (recordOne, recordTwo) =>
{
  let a = recordOne[SETTINGS.order.column] || '';
  let b = recordTwo[SETTINGS.order.column] || '';

  return a.toLowerCase().localeCompare(b.toLowerCase()) === 1;
};



const suite = new Benchmark.Suite();

suite
  .add('#A: Model', () =>
  {
    const dataModel = new Data(stockJson.records, SETTINGS);
    return dataModel.results;
  })
  .add('#C: Native', () =>
  {
    const results = stockJson.records.filter(r =>
      SETTINGS.filters[0].handler(r, SETTINGS.filters[0].arguments[0]),
    );

    const sortedResults = results.sort(simpleSortMethod);
    return sortedResults;
  })
  // add listeners
  .on('cycle', (event) =>
  {
    console.log(String(event.target));
  })
  .on('complete', () =>
  {
    console.log('Fastest is ' + suite.filter('fastest').map('name'));

    /**
     * hist suite runs num / sec
     * suite[0].hz
     */
    console.log(`${suite[1].name} runs ${Math.round((suite[1].hz / suite[0].hz) * 10) / 10}x ${suite[1].hz > suite[0].hz ? 'fastest' : 'slowest'} then ${suite[0].name}`);
  })
  // run async
  .run({ 'async': true });
