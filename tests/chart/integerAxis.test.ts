import integerAxis from '../../src/chart/coordinate/functions/integerAxis';

describe('integerAxis', () => {
  it('rounds the maximum up to a whole step', () => {
    // 1 perckor indul, 10 mp-ig fut
    expect(integerAxis(0, 1 + (10 / 60))).toEqual({ min: 0, max: 2, step: 1, steps: 2, values: [0, 1, 2] });
  });

  it('keeps an exact integer maximum', () => {
    expect(integerAxis(0, 4)).toEqual({ min: 0, max: 4, step: 1, steps: 4, values: [0, 1, 2, 3, 4] });
    expect(integerAxis(0, 5).values).toEqual([0, 1, 2, 3, 4, 5]);
  });

  it('uses a nice integer step within maxSteps', () => {
    expect(integerAxis(0, 6).values).toEqual([0, 2, 4, 6]);
    expect(integerAxis(0, 43).values).toEqual([0, 10, 20, 30, 40, 50]);
    expect(integerAxis(0, 7, 4).values).toEqual([0, 2, 4, 6, 8]);
    expect(integerAxis(0, 1440).step).toBe(500);
  });

  it('never exceeds maxSteps after rounding the ends', () => {
    [[1, 11], [3, 97], [0, 0.3], [12, 13.5], [0, 23]].forEach(([min, max]) => {
      const { steps, step, values } = integerAxis(min, max, 5);

      expect(steps).toBeLessThanOrEqual(5);
      expect(Number.isInteger(step)).toBe(true);
      expect(values.every(Number.isInteger)).toBe(true);
      expect(values[0]).toBeLessThanOrEqual(min);
      expect(values[values.length - 1]).toBeGreaterThanOrEqual(max);
    });
  });

  it('gives one division for an empty range', () => {
    expect(integerAxis(0, 0).values).toEqual([0, 1]);
    expect(integerAxis(3, 3).values).toEqual([3, 4]);
  });
});
