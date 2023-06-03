
import { PropTypes } from "./index";


export interface IDataElement
{
  x: number,
  y: number,
  canvas: ICanvas,
}

export interface IData
{
  x: number,
  y: number,
  // element?: React.FC<{x: number, y: number}[]>,
  element?: () => JSX.Element,
}

export interface IMargin
{
  top: number,
  bottom: number,
  left: number,
  right: number,
}

export interface ICanvas
{
  x: number,
  y: number,
  width: number,
  height: number,
  margin: IMargin,
  svgHeight: number,
  svgWidth: number,
  xAxisValueMin: number,
  xAxisValueMax: number,
  yAxisValueMin: number,
  yAxisValueMax: number,

  xAxisValueDiff: number,
  yAxisValueDiff: number
  
  /**
  * Steps determine scale of axis from origo
  * @example
  * xAxisSteps = 2
  * // 0----1----2
  *
  * Dynamic calculation: All data maximum 'x' value => xAxisValueMax - xAxisValueMin
  */
  xAxisSteps: number,
  yAxisSteps: number,

  /**
   * Points determine absolute grid of the coordination, based on x, y min and max values
   *
   * @example
   * maximum y value 1000
   * // => y Axis contains 1000 coordination points
   *
   * Step = points between two step
   * Axis = total points on the axis
   */
  xAxisPoints: number,
  yAxisPoints: number,
  stepXPoints: number,
  stepYPoints: number,

  /**
   * X, Y step in pixel
   */
  colWidth: number,
  rowHeight: number,

  /**
   * Create xAxis Step value
   *
   * @example
   * data = [100, 200, 300];
   * //=> [0, 1, 2]
   *
   * @example
   * data = [100, 200, 300];
   * xAxisValueMin = -1;
   * xAxisValueMax = 3;
   * // => [-1, 0, 1, 2, 3]
   *
   * @example
   * // hide record with props
   * xAxisValues={[null, '#1', '#2'}
   * //=> data[0] not visible
   */
  xAxisValues: NonNullable<PropTypes['xAxisValues']>,
  yAxisValues: NonNullable<PropTypes['yAxisValues']>,
}
