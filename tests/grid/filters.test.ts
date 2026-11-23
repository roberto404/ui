import { search } from '../../src/grid/filters';

const records = [
  { id: 1, orderId: '6.0.100', deposit: 20000, attachment: [{ origin: 'piper' }], products: [{ productId: 'K1', features: [{ id: 61 }] }] },
  { id: 2, orderId: '2.3.200', deposit: 0, attachment: [{ origin: 'card' }], products: [{ productId: 'K2', features: [{ id: 7 }] }] },
  { id: 3, orderId: '2.3.300', deposit: 5000, attachment: [], products: [{ productId: 'K1' }, { productId: 'K3' }] },
];

/** ids of the matching records (index 0 builds the cache of the query) */
const run = (value: string, cnf = false) =>
  records.filter((record, index) => search({ record, value, helpers: {}, hooks: {}, index, cnf })).map(({ id }) => id);

describe('grid filters: search', () => {
  it('default: `|` splits first, `&` binds stronger', () => {
    // (orderId 6.0 AND deposit 20000) OR orderId 2.3.3
    expect(run('orderId=6.0&deposit==20000|orderId=2.3.3')).toEqual([1, 3]);
  });

  it('cnf: `&` splits first, `|` inside a group', () => {
    // (orderId 6.0 OR orderId 2.3) AND deposit > 1000
    expect(run('orderId=6.0|orderId=2.3&deposit>1000', true)).toEqual([1, 3]);
    // the same query without cnf: orderId 6.0 OR (orderId 2.3 AND deposit > 1000)
    expect(run('orderId=6.0|orderId=2.3&deposit>1000')).toEqual([1, 3]);
    expect(run('orderId=2.3|orderId=6.0&deposit>10000', true)).toEqual([1]);
    expect(run('orderId=2.3|orderId=6.0&deposit>10000')).toEqual([1, 2, 3]);
  });

  it('path through an array: any item', () => {
    expect(run('attachment.origin==piper')).toEqual([1]);
    expect(run('products.productId==K1')).toEqual([1, 3]);
  });

  it('path through arrays at any depth', () => {
    expect(run('products.features.id==61')).toEqual([1]);
  });

  it('negative operator on an array path: none of the items', () => {
    expect(run('products.productId!==K1')).toEqual([2]);
    expect(run('attachment.origin!==piper')).toEqual([2, 3]);
  });

  it('empty query: no match (as before)', () => {
    expect(run('')).toEqual([]);
    expect(run('', true)).toEqual([]);
  });

  it('plain path (no array): the value', () => {
    expect(run('products.0.productId==K2')).toEqual([2]);
  });

  it('not equal operator', () => {
    expect(run('deposit!==20000')).toEqual([2, 3]);
  });
});
