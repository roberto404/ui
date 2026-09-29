import React from 'react';

import Coordinate from './coordinate';
import { findMinimumValueInSeries } from './coordinate/functions';


const DEFAULT_COLOR = '#a8ea80';   // resting fill of a single series (green)
const DEFAULT_ACTIVE = '#186eff';  // highlighted / hovered fill (blue-dark)
const VALUE_COLOR = '#252631';     // the floating value label (black)

// default per-series fill when several series sit side by side and no explicit
// `color` is set — keeps the old green / black double-bar look.
const SERIES_COLORS = ['#a8ea80', '#252631', '#186eff', '#ffab2b'];


/**
 * Index highlighted "at rest" (pointer not over the chart).
 *   'max' | 'min' -> arg-max / arg-min of the series
 *   number        -> that fixed index
 *   anything else -> nothing highlighted (null)
 */
const resolveHighlight = (highlight, values) => {
  if (highlight === 'max' || highlight === 'min') {
    const numeric = values.filter((v) => typeof v === 'number');
    if (!numeric.length) {
      return null;
    }
    const target = (highlight === 'max' ? Math.max : Math.min)(...numeric);
    return values.indexOf(target);
  }

  return typeof highlight === 'number' ? highlight : null;
};


/**
 * Pixel geometry of one bar from its resolved data point. Bars grow from the
 * baseline (the yAxisValueMin line) up to the point. `radius` stays raw here;
 * `barPath` clamps it once it knows whether the bottom is rounded too.
 */
const barGeometry = (point, canvas, { gap, seriesIndex, seriesLength, radius }) => {
  const baseline = canvas.margin.top + canvas.height;

  let width = canvas.colWidth * (1 - gap);
  let x = point.x - (width / 2);

  if (seriesLength > 1) {
    width /= seriesLength;
    x += width * seriesIndex;
  }

  const top = Math.min(point.y, baseline);
  const height = Math.abs(baseline - point.y);
  const r = radius === 'pill' ? width / 2 : radius;

  return { x, width, top, height, baseline, radius: r, cx: x + (width / 2) };
};


/**
 * Path for a bar. The top corners always round (radius `r`); the bottom corners
 * round only when `roundBottom` is set — a plain bar sits flat on the axis
 * (square bottom, the original look), the pill / progress bars round both ends.
 */
const barPath = (x, y, w, h, r, roundBottom) => {
  const top = Math.max(0, Math.min(r, w / 2, roundBottom ? h / 2 : h));
  const bot = roundBottom ? top : 0;

  return [
    `M${x},${y + top}`,
    `Q${x},${y} ${x + top},${y}`,
    `L${x + w - top},${y}`,
    `Q${x + w},${y} ${x + w},${y + top}`,
    `L${x + w},${y + h - bot}`,
    bot ? `Q${x + w},${y + h} ${x + w - bot},${y + h}` : `L${x + w},${y + h}`,
    `L${x + bot},${y + h}`,
    bot ? `Q${x},${y + h} ${x},${y + h - bot}` : '',
    'Z',
  ].join(' ');
};


/**
 * Diagonal-hatch pattern used by `track="hatch"` — the striped 100% background
 * of the progress-bar look. Defined once per chart (unique id per series).
 */
const HatchPattern = ({ id, color }) => (
  <defs>
    <pattern id={id} width={7} height={7} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <rect width={7} height={7} fill="#fff" />
      <line x1={0} y1={0} x2={0} y2={7} stroke={color} strokeWidth={3} />
    </pattern>
  </defs>
);


/**
 * Default value label (used when no custom `tooltip` render-prop is given).
 *   mode 'active' -> a single label floating above the bar (weekly look)
 *   mode 'always' -> a label per bar, inside when the bar is tall enough
 */
const DefaultValue = ({ label, geo, color, mode }) => {
  if (mode === 'active') {
    return (
      <text
        className="bar-value above"
        x={geo.cx}
        y={geo.top - 14}
        textAnchor="middle"
        fontSize={17}
        style={{ fill: VALUE_COLOR }}
      >
        {label}
      </text>
    );
  }

  const fontSize = Math.max(10, Math.min(geo.width / 3.4, 20));
  const inside = geo.height > fontSize * 2.4;

  return (
    <text
      className={inside ? 'bar-value inside' : 'bar-value outside'}
      x={geo.cx}
      y={inside ? geo.top + fontSize + 4 : geo.top - 6}
      textAnchor="middle"
      alignmentBaseline="hanging"
      fontSize={fontSize}
      style={inside ? undefined : { fill: color }}
    >
      {label}
    </text>
  );
};


/**
 * A whole bar series, drawn once (on the first point of the series). Keeping it
 * in one stateful component — instead of one element per point — is what lets a
 * single bar be "active" (default highlight or hovered) and lets the value / axis
 * label of that bar react, the same idea as the line chart's hover layer.
 *
 * Colours come from props (`color` / `activeColor`), not css, so a bar can be
 * highlighted by swapping its fill.
 */
const BarSeries = ({
  data,
  canvas,
  seriesId,
  seriesIndex,
  seriesLength,
  color,
  activeColor,
  highlight,
  hover,
  showValue,
  valueFormat,
  tooltip,
  track,
  trackColor,
  trackStyle,
  marker,
  radius,
  roundBottom,
  gap,
  labels,
  labelColor,
}) => {
  const [hovered, setHovered] = React.useState(null);

  // point.value is the raw data point ({ x, y }); its numeric value is `.y`
  const values = data.map((p) => p.value.y);
  const highlightIndex = resolveHighlight(highlight, values);
  const activeIndex = (hover && hovered !== null) ? hovered : highlightIndex;

  const top = canvas.margin.top;
  const bottom = canvas.margin.top + canvas.height;

  const hatchId = `bar-hatch-${seriesId}`;
  const usesHatch = track === 'hatch';

  const colorOf = (value, index, active) =>
    (typeof color === 'function' ? color(value, index, active) : (active ? activeColor : color));

  const isShown = (index) => {
    if (showValue === 'always') {
      return true;
    }
    if (showValue === 'active' || showValue === true) {
      return index === activeIndex;
    }
    return false;
  };

  // resolve every bar once, then draw in layers so values / labels stay on top
  const bars = data.map((point, i) => {
    const geo = barGeometry(point, canvas, { gap, seriesIndex, seriesLength, radius });
    const active = i === activeIndex;
    return { point, i, geo, active, fill: colorOf(point.value.y, i, active) };
  });

  // hover: one target over the plot, moving picks the nearest column (smooth,
  // no flicker between bars) — same mapping as the line chart's hover layer.
  const onMove = (e) => {
    const box = e.currentTarget.getBoundingClientRect();
    const scaleX = box.width / canvas.width;
    const userX = canvas.x + ((e.clientX - box.left) / scaleX);

    let nearest = 0;
    let best = Infinity;
    bars.forEach(({ geo }, i) => {
      const distance = Math.abs(geo.cx - userX);
      if (distance < best) {
        best = distance;
        nearest = i;
      }
    });

    setHovered(nearest);
  };

  return (
    <g className="bar-series">
      {usesHatch && <HatchPattern id={hatchId} color={trackColor} />}

      {/* full-height background track (progress-bar look) */}
      {track && bars.map(({ geo, i }) => {
        const t = { ...geo, top, height: bottom - top };

        if (typeof track === 'function') {
          return <g key={`track-${i}`}>{track({ ...t, index: i, canvas })}</g>;
        }

        const trackR = Math.min(t.radius, t.width / 2, t.height / 2);

        return (
          <rect
            key={`track-${i}`}
            className="bar-track"
            x={t.x}
            y={t.top}
            width={t.width}
            height={t.height}
            rx={trackR}
            ry={trackR}
            fill={usesHatch ? `url(#${hatchId})` : trackColor}
            style={trackStyle}
          />
        );
      })}

      {/* bars + per-bar decoration (e.g. a target tick) from the `marker` prop */}
      {bars.map(({ geo, i, active, fill, point }) => (
        <g key={`bar-${i}`}>
          <path
            className={`bar-rect${active ? ' active' : ''}`}
            d={barPath(geo.x, geo.top, geo.width, geo.height, geo.radius, roundBottom)}
            fill={fill}
          />
          {marker && marker({
            x: geo.cx,
            y: geo.top,
            width: geo.width,
            height: geo.height,
            value: point.value.y,
            index: i,
            active,
            color: fill,
          })}
        </g>
      ))}

      {/* value display: custom `tooltip` render-prop, else the default label */}
      {bars.map(({ geo, i, active, fill, point }) => (isShown(i) ? (
        <g key={`value-${i}`}>
          {tooltip
            ? tooltip({
              value: point.value.y,
              index: i,
              active,
              x: geo.cx,
              y: geo.top,
              width: geo.width,
              height: geo.height,
              color: fill,
              canvas,
              top,
              bottom,
            })
            : <DefaultValue label={valueFormat(point.value.y)} geo={geo} color={fill} mode={showValue} />}
        </g>
      ) : null))}

      {/* x labels drawn here (not on the axis) so the active one can highlight */}
      {labels && bars.map(({ geo, i, active }) => (
        <text
          key={`label-${i}`}
          className={`bar-label${active ? ' active' : ''}`}
          x={geo.cx}
          y={bottom + 24}
          textAnchor="middle"
          style={active ? { fill: labelColor || activeColor } : undefined}
        >
          {labels[i]}
        </text>
      ))}

      {hover && (
        <rect
          className="bar-hover-target"
          x={canvas.x}
          y={top}
          width={canvas.width}
          height={bottom - top}
          fill="transparent"
          onMouseMove={onMove}
          onMouseLeave={() => setHovered(null)}
        />
      )}
    </g>
  );
};


/**
 * Bar series element (rendered once per data point by coordinate/point). The
 * whole series is drawn on its first point; the other points render nothing.
 */
export const Bar = (options = {}) => ({ canvas, index, data, seriesIndex, seriesLength }) => {
  if (index !== data[0].index) {
    return null;
  }

  return (
    <BarSeries
      data={data}
      canvas={canvas}
      seriesIndex={seriesIndex}
      seriesLength={seriesLength}
      {...options}
    />
  );
};


/**
 * Bar chart.
 *
 * By default every bar shares `color` and all values are shown — the plain look.
 * Opt into the interactive looks with the props below; `color`, `activeColor`
 * and `label` can also be set per-series on the data.
 *
 * @param {string|Function} color        resting fill, or (value, index, active) => colour for per-bar fills
 * @param {string}          activeColor  fill of the highlighted / hovered bar
 * @param {'max'|'min'|number} highlight  bar highlighted at rest (default none)
 * @param {boolean}         hover        highlight + reveal the value of the hovered bar
 * @param {'always'|'active'|false} showValue  when value labels are shown (default 'always')
 * @param {Function}        valueFormat  format the printed value
 * @param {Function}        tooltip      custom value render-prop: ({ value, index, active, x, y, width, height, color, canvas, top, bottom }) => element
 * @param {boolean|'hatch'|Function} track  full-height background track behind each bar
 * @param {Function}        marker       per-bar decoration render-prop: ({ x, y, width, height, value, index, active, color }) => element
 * @param {number|'pill'}   radius       corner radius ('pill' = stadium caps)
 * @param {boolean}         roundBottom  round the bottom corners too (default false: flat bottom, the plain look)
 * @param {boolean}         barLabels    draw the x labels inside the series (highlightable) instead of on the axis
 */
const ChartBar = ({
  data,
  className,
  yAxisValueMin,
  yAxisValueMax,
  margin = {
    top: 40,
    right: 100,
    bottom: 40,
    left: 100,
  },
  gap = 0.5,
  radius = 'pill',
  roundBottom = false,
  color,
  activeColor = DEFAULT_ACTIVE,
  highlight = null,
  hover = false,
  showValue = 'always',
  valueFormat = (value) => value,
  tooltip,
  track = false,
  trackColor = '#eef1f4',
  trackStyle,
  marker,
  barLabels = false,
  labelColor,
  ...props
}) => {
  const labels = data[0].xAxis || data[0].values;

  return (
    <Coordinate
      id="bar"
      xAxisValueMin={-1}
      xAxisValueMax={data[0].values.length}
      xAxisValues={[null, ...labels, null]}
      yAxisValueMin={yAxisValueMin === undefined ? findMinimumValueInSeries(data) : yAxisValueMin}
      yAxisValueMax={yAxisValueMax}
      yGrid={false}
      margin={margin}
      {...props}
      className={className || `chart bar rounded${hover ? ' hover' : ''}`}
      data={
        data.reduce((result, series, i) => {
          const element = Bar({
            seriesId: series.id,
            color: series.color || color || (data.length > 1 ? SERIES_COLORS[i % SERIES_COLORS.length] : DEFAULT_COLOR),
            activeColor: series.activeColor || activeColor,
            highlight,
            hover,
            showValue,
            valueFormat,
            tooltip,
            track,
            trackColor,
            trackStyle,
            marker,
            radius,
            roundBottom,
            gap,
            labels: barLabels ? labels : null,
            labelColor,
          });

          return {
            ...result,
            [series.id]: series.values.map((v, idx) => ({ x: idx, y: v, element })),
          };
        }, {})
      }
    />
  );
};

export default ChartBar;
