
/* !- Types */

import { ICanvas } from "../index";

export type coordToPixReturnType = 
{
  x: number,
  y: number,
  canvas: ICanvas,
  coord: {
    x: number,
    y: number,
  }
}

export type coordToPixFuncType =
  (x: number, y: number) => coordToPixReturnType

export type coordToPixType =
  (canvas: ICanvas) => coordToPixFuncType

  
// 1/1000 px: no exponent notation (eg. 3.6e-14) in the svg path
const round = (value: number) => Math.round(value * 1000) / 1000;

const coordToPix: coordToPixType = (canvas) => (x: number, y: number) =>
({
  x: round(canvas.x + (canvas.colWidth * x)),
  y: round(canvas.svgHeight - canvas.margin.bottom - (canvas.rowHeight * y)),
  canvas,
  coord: { x, y },
});

export default coordToPix;