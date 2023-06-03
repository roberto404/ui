
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

  
const coordToPix: coordToPixType = (canvas) => (x: number, y: number) =>
({
  x: canvas.x + (canvas.colWidth * x),
  y: canvas.svgHeight - canvas.margin.bottom - (canvas.rowHeight * y),
  canvas,
  coord: { x, y },
});

export default coordToPix;