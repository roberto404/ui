
export const getMobilColNum = (colNum: number) =>
  Math.min(Math.ceil(colNum / 2), 2);

export const getColClassByNum = (colNum: number, compress = false): string => {

  const getClass = colNum => {
    if (colNum === 1) {
      return 'col';
    }

    return `col-1-${colNum}`;
  }

  return getClass(colNum) + (compress ? '<' : '')
}
// (12 % colNum) === 0 && colNum < 12 ?
//   `col-${Math.floor(12 / colNum)}-12`
//   :


export const getColClassesByNum = (colNum: number): string =>
  [colNum, getMobilColNum(colNum)]
    .map((num, i) => (i ? 'mobile:' + getColClassByNum(num, true) : getColClassByNum(num)))
    .join(' ');