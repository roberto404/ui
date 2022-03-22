export const findMinimumValueInSeries = data =>
  Math.min(...data.map(({ values }) => Math.min(...values)));