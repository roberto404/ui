import reducers from '../../src/grid/reducers';

const GRID = 'test';

const setData = (data) =>
  reducers({}, { type: 'SET_GRID_DATA', data, settings: {}, grid: GRID });

const addRecords = (state, records) =>
  reducers(state, { type: 'ADD_GRID_RECORDS', records, grid: GRID });

describe('grid/reducers ADD_GRID_RECORDS', () => {
  it('appends new records and replaces existing ones by id', () => {
    const state = addRecords(
      setData([{ id: 'a', v: 1 }, { id: 'b', v: 1 }]),
      [{ id: 'b', v: 2 }, { id: 'c', v: 1 }],
    );

    expect(state[GRID].rawData).toEqual([
      { id: 'a', v: 1 },
      { id: 'b', v: 2 },
      { id: 'c', v: 1 },
    ]);
  });

  it('a record repeated in the batch is added once, the last one wins', () => {
    const state = addRecords(
      setData([{ id: 'a', v: 1 }]),
      [{ id: 'c', v: 1 }, { id: 'c', v: 2 }],
    );

    expect(state[GRID].rawData).toEqual([
      { id: 'a', v: 1 },
      { id: 'c', v: 2 },
    ]);
  });

  it('merges large batches quickly (no quadratic lookup)', () => {
    const size = 30000;
    const records = Array.from({ length: size }, (_, index) => ({ id: `p${index}` }));

    let state = setData(records.slice(0, 5000));

    const start = Date.now();

    for (let offset = 5000; offset < size; offset += 5000) {
      state = addRecords(state, records.slice(offset, offset + 5000));
    }

    expect(state[GRID].rawData).toHaveLength(size);
    expect(Date.now() - start).toBeLessThan(2000);
  });
});

const modifyOrAddRecords = (state, records, enableAddRecord = true) =>
  reducers(state, { type: 'MODIFY_GRID_RECORDS', records, grid: GRID, options: { enableAddRecord } });

describe('grid/reducers MODIFY_GRID_RECORDS', () => {
  it('merges into existing records by loose id (1 == "1") and appends new ones', () => {
    const state = modifyOrAddRecords(
      setData([{ id: 1, v: 1, keep: true }, { id: 2, v: 1 }]),
      [{ id: '1', v: 2 }, { id: 3, v: 1 }],
    );

    expect(state[GRID].rawData).toEqual([
      { id: '1', v: 2, keep: true },
      { id: 2, v: 1 },
      { id: 3, v: 1 },
    ]);
  });

  it('a record repeated in the batch is added once and merged', () => {
    const state = modifyOrAddRecords(
      setData([{ id: 'a' }]),
      [{ id: 'c', v: 1, x: 1 }, { id: 'c', v: 2 }],
    );

    expect(state[GRID].rawData).toEqual([
      { id: 'a' },
      { id: 'c', v: 2, x: 1 },
    ]);
  });

  it('without enableAddRecord only modifies', () => {
    const state = modifyOrAddRecords(
      setData([{ id: 'a', v: 1 }]),
      [{ id: 'a', v: 2 }, { id: 'b', v: 1 }],
      false,
    );

    expect(state[GRID].rawData).toEqual([{ id: 'a', v: 2 }]);
  });

  it('merges large batches quickly (no quadratic lookup)', () => {
    const size = 30000;
    const records = Array.from({ length: size }, (_, index) => ({ id: index }));

    const state = setData(records.slice(0, 20000));

    const start = Date.now();
    const next = modifyOrAddRecords(state, records.slice(10000));

    expect(next[GRID].rawData).toHaveLength(size);
    expect(Date.now() - start).toBeLessThan(2000);
  });
});
