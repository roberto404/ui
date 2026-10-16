import React from 'react';

import Coordinate from './coordinate';
import integerAxis from './coordinate/functions/integerAxis';


/* !- Types */

export interface BulletRow
{
  label: React.ReactNode,
  value: number,
  /** highlighted row (bold label, `activeColor`, bigger dot) */
  active?: boolean,
  /** overrides `color` / `activeColor` */
  color?: string,
}

export interface BulletTarget
{
  value: number,
  /** default: `cél <valueFormat(value)>` */
  label?: React.ReactNode,
}

export interface PropTypes
{
  rows: BulletRow[],
  /** dashed vertical reference line */
  target?: BulletTarget,
  /** axis start (default 0) */
  min?: number,
  /** axis end (default: nice integer above the largest value / target) */
  max?: number,
  /** axis labels; false = hidden (default: `axisSteps` even divisions) */
  ticks?: number[] | false,
  axisSteps?: number,
  color?: string,
  activeColor?: string,
  trackColor?: string,
  targetColor?: string,
  /** ring around the end dot (px), separates it from the bar; 0 = none */
  dotBorder?: number,
  dotBorderColor?: string,
  valueFormat?: (value: number) => React.ReactNode,
  /** row title, drawn into an svg <text> (string / <tspan>); default: `label · value` */
  labelFormat?: (row: BulletRow, value: React.ReactNode, index: number) => React.ReactNode,
  /** drawing width; the height follows the rows unless given */
  width?: number,
  height?: number,
  margin?: { top: number, right: number, bottom: number, left: number },
  /** scales to the wrapper width keeping the width / height ratio */
  responsive?: boolean,
  className?: string,
}


/* !- Constants */

const TEXT_COLOR = '#252631'; // $black
const MUTED_COLOR = '#778ca2'; // $gray-dark
const AXIS_COLOR = '#98a9bc'; // $gray

const DOT = 9;
const DOT_ACTIVE = 12;
const BAR = 8;

const LABEL_SIZE = 18;
const TARGET_HEIGHT = 30;
const ROW_HEIGHT = 66;
const AXIS_HEIGHT = 30;

const defaultValueFormat = (value: number) => value.toLocaleString('hu-HU');

const defaultLabelFormat = (row: BulletRow, value: React.ReactNode) =>
  <>{row.label} · {value}</>;


/* !- Elements */

/**
 * Every row of the bullet chart, drawn once (on the first point): label, track,
 * value bar with an end dot; the dashed target line with its label above the rows
 * and the axis labels below them.
 */
const BulletSeries = ({
  data,
  canvas,
  min,
  to,
  axis,
  target,
  color,
  activeColor,
  trackColor,
  targetColor,
  dotBorder,
  dotBorderColor,
  valueFormat,
  labelFormat,
}) =>
{
  const rows: BulletRow[] = data.map(({ value }) => value.row);

  const range = (to - min) || 1;
  const toX = (value: number) =>
    canvas.x + (canvas.width * Math.min(1, Math.max(0, (value - min) / range)));

  const top = canvas.y + (target ? TARGET_HEIGHT : 0);
  const rowsBottom = top + (rows.length * ROW_HEIGHT);

  return (
    <g className="bullet-series">
      { rows.map((row, index) =>
      {
        const fill = row.color || (row.active ? activeColor : color);
        const labelY = top + (index * ROW_HEIGHT) + LABEL_SIZE;
        const barY = top + (index * ROW_HEIGHT) + 44;
        const x = toX(row.value);

        return (
          <g key={index} className="bullet-row">
            <text
              x={canvas.x}
              y={labelY}
              fontSize={LABEL_SIZE}
              fontWeight={row.active ? 700 : 400}
              fill={row.active ? TEXT_COLOR : MUTED_COLOR}
            >
              {labelFormat(row, valueFormat(row.value), index)}
            </text>

            <line
              x1={canvas.x}
              y1={barY}
              x2={canvas.x + canvas.width}
              y2={barY}
              stroke={trackColor}
              strokeWidth={BAR}
              strokeLinecap="round"
            />
            { x > canvas.x &&
            <line
              x1={canvas.x}
              y1={barY}
              x2={x}
              y2={barY}
              stroke={fill}
              strokeWidth={BAR}
              strokeLinecap="round"
            />
            }
            { dotBorder > 0 &&
            <circle cx={x} cy={barY} r={(row.active ? DOT_ACTIVE : DOT) + dotBorder} fill={dotBorderColor} />
            }
            <circle cx={x} cy={barY} r={row.active ? DOT_ACTIVE : DOT} fill={fill} />
          </g>
        );
      })}

      { target &&
      <g className="bullet-target">
        <text
          x={toX(target.value)}
          y={canvas.y + TARGET_HEIGHT - 10}
          // near an edge the label is aligned to it, so it stays inside
          textAnchor={
            toX(target.value) > canvas.x + canvas.width - 30
              ? 'end'
              : (toX(target.value) < canvas.x + 30 ? 'start' : 'middle')
          }
          fontSize={14}
          fontWeight={700}
          fill={targetColor}
        >
          {target.label ?? <>cél {valueFormat(target.value)}</>}
        </text>
        <line
          x1={toX(target.value)}
          y1={canvas.y + TARGET_HEIGHT - 4}
          x2={toX(target.value)}
          y2={rowsBottom}
          stroke={targetColor}
          strokeWidth={2}
          strokeDasharray="6 5"
        />
      </g>
      }

      { axis && axis.map((tick, index) => (
        <text
          key={index}
          x={toX(tick)}
          y={rowsBottom + AXIS_HEIGHT - 8}
          textAnchor={index === 0 ? 'start' : (index === axis.length - 1 ? 'end' : 'middle')}
          fontSize={13}
          fill={AXIS_COLOR}
        >
          {valueFormat(tick)}
        </text>
      ))}
    </g>
  );
};

export const Row = options => (props) =>
{
  if (props.index !== props.data[0].index)
  {
    return null;
  }

  return <BulletSeries {...props} {...options} />;
};


/**
 * Bullet chart: horizontal value bars with an end dot, compared to a target line.
 *
 * @example
 * <Bullet
 *   rows={[{ label: 'Ez a kampány', value: 20, active: true }, { label: 'Előző kampány', value: 14 }]}
 *   target={{ value: 25 }}
 *   max={30}
 *   valueFormat={(value) => `${value} %`}
 * />
 */
const Bullet: React.FC<PropTypes> = (
{
  rows,
  target,
  min = 0,
  max,
  ticks,
  axisSteps = 2,
  color = '#adb1ba',
  activeColor = '#2f5ca8',
  trackColor = '#eef0f3',
  targetColor = '#1f2937',
  dotBorder = 3,
  dotBorderColor = '#fff',
  valueFormat = defaultValueFormat,
  labelFormat = defaultLabelFormat,
  width = 460,
  height,
  margin = {
    top: 0,
    right: DOT_ACTIVE + 5,
    bottom: 0,
    left: DOT_ACTIVE + 5,
  },
  responsive,
  className = 'chart bullet',
}) =>
{
  let to = max;
  let axis = ticks;

  if (to === undefined)
  {
    const auto = integerAxis(min, Math.max(min, ...rows.map(({ value }) => value), target?.value ?? min), axisSteps);
    to = auto.max;
    axis = axis ?? auto.values;
  }

  if (axis === undefined)
  {
    axis = Array.from({ length: axisSteps + 1 }, (_, i) => min + (((to - min) / axisSteps) * i));
  }

  // the height follows the rows: target label + rows + axis labels
  const svgHeight = height ?? (
    margin.top
    + (target ? TARGET_HEIGHT : 0)
    + (rows.length * ROW_HEIGHT)
    + (axis ? AXIS_HEIGHT : 0)
    + margin.bottom
  );

  const element = Row({
    min,
    to,
    axis,
    target,
    color,
    activeColor,
    trackColor,
    targetColor,
    dotBorder,
    dotBorderColor,
    valueFormat,
    labelFormat,
  });

  const points = rows.map((row, index) => ({
    x: 0,
    y: index,
    row,
    element,
  }));

  return (
    <Coordinate
      id="bullet"
      className={className}
      data={{ bullet: points }}
      width={width}
      height={svgHeight}
      margin={margin}
      responsive={responsive}
      // keep the ratio: the height follows the width, no distortion
      preserveAspectRatio="xMidYMid meet"
      xAxisValueMin={0}
      xAxisValueMax={1}
      yAxisValueMin={0}
      yAxisValueMax={Math.max(1, rows.length - 1)}
      xGrid={false}
      yGrid={false}
      xAxis={false}
      yAxis={false}
    />
  );
};


export default Bullet;
