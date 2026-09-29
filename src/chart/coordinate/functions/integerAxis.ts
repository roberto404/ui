
/* !- Types */

export type IntegerAxisType = {
  min: number,
  max: number,
  // distance between two labels (integer)
  step: number,
  // number of divisions: (max - min) / step
  steps: number,
  // label values from min to max
  values: number[],
};


/* !- Helpers */

/**
 * Smallest "nice" integer (1, 2, 5, 10, 20, 50 …) not less than `value`
 */
const niceInteger = (value: number): number => {
  let magnitude = 1;

  for (;;) {
    for (const base of [1, 2, 5]) {
      if (base * magnitude >= value) {
        return base * magnitude;
      }
    }

    magnitude *= 10;
  }
};


/**
 * Axis division with integer labels only.
 *
 * The range is widened to whole steps (min rounded down, max rounded up) and
 * the step is the smallest nice integer that keeps the divisions within `maxSteps`.
 *
 * @example
 * integerAxis(0, 1.17) // => { min: 0, max: 2, step: 1, steps: 2, values: [0, 1, 2] }
 * integerAxis(0, 43) // => { min: 0, max: 50, step: 10, steps: 5, values: [0, 10, 20, 30, 40, 50] }
 * integerAxis(0, 7, 4) // => { min: 0, max: 8, step: 2, steps: 4, values: [0, 2, 4, 6, 8] }
 */
const integerAxis = (min: number, max: number, maxSteps = 5): IntegerAxisType => {
  const from = Math.min(min, max);
  const to = Math.max(min, max);
  const limit = Math.max(1, Math.floor(maxSteps));

  let step = niceInteger((to - from) / limit);
  let axisMin = Math.floor(from / step) * step;
  let axisMax = Math.ceil(to / step) * step;

  // rounding the ends may add a division
  while ((axisMax - axisMin) / step > limit) {
    step = niceInteger(step + 1);
    axisMin = Math.floor(from / step) * step;
    axisMax = Math.ceil(to / step) * step;
  }

  // empty range: at least one division
  if (axisMax === axisMin) {
    axisMax = axisMin + step;
  }

  const steps = (axisMax - axisMin) / step;

  return {
    min: axisMin,
    max: axisMax,
    step,
    steps,
    values: Array.from({ length: steps + 1 }, (_, i) => axisMin + (i * step)),
  };
};

export default integerAxis;
