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
