import React from 'react';

import Coordinate from './coordinate';
import { findMinimumValueInSeries } from './coordinate/functions';

import roundPathCorners from './roundedPath';


const DEFAULT_COLOR = '#186eff';

// corner radius used when rounding the poly-line into a bezier curve
const CORNER_RADIUS = 30;


/**
 * Move `from` toward `to` by up to CORNER_RADIUS — matches
 * roundedPath.movePointLength (the trim roundPathCorners applies before a corner).
 */
const movePointLength = (from, to) => {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const distance = Math.hypot(dx, dy);

  if (!distance) {
    return { x: from.x, y: from.y };
  }

  const fraction = Math.min(1, CORNER_RADIUS / distance);

  return { x: from.x + (dx * fraction), y: from.y + (dy * fraction) };
};

/**
 * The cubic bezier roundPathCorners inserts at the corner `cur`.
 *
 * roundPathCorners trims sequentially: the incoming side starts from the previous
 * corner's already-trimmed end, except at the very first corner where it starts
 * from the original point. Reproducing that keeps markers on the rendered curve
 * for short segments too (a plain `min(dist, radius)` trim is only right when the
 * segment is longer than twice the radius).
 */
const cornerCurve = (prev, cur, next, isFirstCorner) => {
  const startFrom = isFirstCorner ? prev : movePointLength(prev, cur);
  const start = movePointLength(cur, startFrom);
  const end = movePointLength(cur, next);

  return {
    start,
    end,
    c1: { x: (start.x + cur.x) / 2, y: (start.y + cur.y) / 2 },
    c2: { x: (cur.x + end.x) / 2, y: (cur.y + end.y) / 2 },
  };
};

/**
 * Point on the rounded corner curve at a given x (Bx is monotonic in t → bisect).
 * Used to place markers / hover dots on the bezier line at the data point's x.
 */
const curvePointAtX = (prev, cur, next, isFirstCorner, targetX) => {
  const { start, end, c1, c2 } = cornerCurve(prev, cur, next, isFirstCorner);

  const at = (t, axis) => {
    const m = 1 - t;
    return (m * m * m * start[axis]) + (3 * m * m * t * c1[axis]) + (3 * m * t * t * c2[axis]) + (t * t * t * end[axis]);
  };

  let lo = 0;
  let hi = 1;
  for (let k = 0; k < 24; k += 1) {
    const mid = (lo + hi) / 2;
    if (at(mid, 'x') < targetX) { lo = mid; } else { hi = mid; }
  }

  const t = (lo + hi) / 2;

  return { x: at(t, 'x'), y: at(t, 'y') };
};


/**
 * Default point marker: a small filled dot on the line. Used when `marker` is
 * `true` but no custom marker element is supplied.
 */
const DefaultMarker = ({ x, y, color }) => (
  <circle
    className="point-marker"
    cx={x}
    cy={y}
    r="4"
    fill={color}
    stroke="#fff"
    strokeWidth="2"
    style={{ pointerEvents: 'none' }}
  />
);


/**
 * Interactive hover layer for the line chart.
 *
 * A single marker (vertical guide + dot + value box) that slides to the data
 * point nearest to the cursor. Because it is one element driven by state, moving
 * between points animates smoothly (via CSS transitions) instead of flickering.
 *
 * `data` holds every point of the series already resolved to pixel coordinates
 * (`x`, `y`) plus the raw `value`, so no extra geometry math is needed here.
 */
const HoverLayer = ({ data, canvas, valueFormat, color, tooltip, bezier }) => {
  const [active, setActive] = React.useState(null);

  // remember the last hovered point so the marker fades out in place
  const lastIndex = React.useRef(0);
  if (active !== null) {
    lastIndex.current = active;
  }

  const top = canvas.margin.top;
  const bottom = canvas.margin.top + canvas.height;

  const onMove = (e) => {
    const box = e.currentTarget.getBoundingClientRect();
    const scaleX = box.width / canvas.width; // svg may be rendered scaled
    const userX = canvas.x + ((e.clientX - box.left) / scaleX);

    let nearest = 0;
    let best = Infinity;

    data.forEach((point, i) => {
      const distance = Math.abs(point.x - userX);
      if (distance < best) {
        best = distance;
        nearest = i;
      }
    });

    setActive(nearest);
  };

  const activeIndex = active !== null ? active : lastIndex.current;
  const point = data[activeIndex];
  const label = `${valueFormat(point.value.y)}`;

  // the dot sits on the (possibly bezier) curve at the point's x, not the cut-off vertex
  const dotY = (bezier && activeIndex > 0 && activeIndex < data.length - 1)
    ? curvePointAtX(data[activeIndex - 1], data[activeIndex], data[activeIndex + 1], activeIndex === 1, point.x).y
    : point.y;

  // value box geometry (svg has no cheap text measuring)
  const fontSize = 13;
  const padX = 10;
  const padY = 6;
  const boxW = (label.length * fontSize * 0.62) + (padX * 2);
  const boxH = fontSize + (padY * 2);

  // keep the box within the plot area horizontally (edge points)
  const boxLeft = Math.max(
    canvas.x - point.x,
    Math.min(canvas.x + canvas.width - point.x - boxW, -boxW / 2),
  );

  return (
    <g className="hover-layer">
      <rect
        className="hover-target"
        x={canvas.x}
        y={top}
        width={canvas.width}
        height={canvas.height}
        onMouseMove={onMove}
        onMouseLeave={() => setActive(null)}
      />

      <g
        className="hover-marker"
        style={{ transform: `translateX(${point.x}px)`, opacity: active !== null ? 1 : 0 }}
      >
        {tooltip
          /* custom tooltip: rendered at the point's x (slides), draws with absolute y.
             ctx gives the value + point pixel + canvas so it can span top..axis freely */
          ? tooltip({
            value: point.value.y,
            index: activeIndex,
            color,
            canvas,
            x: point.x,
            y: dotY,
            top,               // plot top (absolute y)
            bottom,            // axis (absolute y)
            colWidth: canvas.colWidth, // px width of one data point (for proportional sizing)
          })
          : (
            /* default: dot + value box + guide, following the point vertically too */
            <g className="marker-point" style={{ transform: `translateY(${dotY}px)` }}>
              <line className="marker-guide" x1={0} y1={-10} x2={0} y2={bottom - dotY} />
              <circle className="marker-dot" cx={0} cy={0} r="5" style={{ fill: color }} />

              <g className="marker-tooltip" transform={`translate(${boxLeft}, ${-boxH - 10})`}>
                <rect className="marker-box" width={boxW} height={boxH} rx={boxH / 2} ry={boxH / 2} />
                <text
                  className="marker-value"
                  x={boxW / 2}
                  y={boxH / 2}
                  fontSize={fontSize}
                  textAnchor="middle"
                  dominantBaseline="central"
                >
                  {label}
                </text>
              </g>
            </g>
          )}
      </g>
    </g>
  );
};


/**
 * Interactive hover layer for a multi-line chart.
 *
 * One shared vertical guide at the hovered x, a dot on every series at that x and
 * a tooltip listing each series value (colour coded). Like the single-line layer
 * it is state driven, so it slides smoothly between points.
 *
 * `data` (primary series, resolved to pixels) gives the x positions; `series`
 * holds every series' raw values + colour, from which the per-line y is derived.
 */
const MultiHoverLayer = ({ data, canvas, valueFormat, series }) => {
  const [active, setActive] = React.useState(null);

  const lastIndex = React.useRef(0);
  if (active !== null) {
    lastIndex.current = active;
  }

  const bottom = canvas.margin.top + canvas.height;

  const onMove = (e) => {
    const box = e.currentTarget.getBoundingClientRect();
    const scaleX = box.width / canvas.width;
    const userX = canvas.x + ((e.clientX - box.left) / scaleX);

    let nearest = 0;
    let best = Infinity;

    data.forEach((point, i) => {
      const distance = Math.abs(point.x - userX);
      if (distance < best) {
        best = distance;
        nearest = i;
      }
    });

    setActive(nearest);
  };

  const index = active !== null ? active : lastIndex.current;
  const px = data[index].x;

  // pixel y for a value (same mapping coordToPix uses)
  const pixelY = (v) => canvas.svgHeight - canvas.margin.bottom - (canvas.rowHeight * (v - canvas.yAxisValueMin));

  // tooltip geometry (one row per series)
  const fontSize = 13;
  const padX = 10;
  const padY = 6;
  const rowH = 20;
  const swatch = 4;
  const gap = 8;
  const boxTop = 6;

  const maxLen = Math.max(...series.map((s) => `${valueFormat(s.values[index])}`.length));
  const boxW = (padX * 2) + (swatch * 2) + gap + (maxLen * fontSize * 0.62);
  const boxH = (padY * 2) + (series.length * rowH);

  const boxLeft = Math.max(
    canvas.x - px,
    Math.min(canvas.x + canvas.width - px - boxW, -boxW / 2),
  );

  return (
    <g className="hover-layer">
      <rect
        className="hover-target"
        x={canvas.x}
        y={canvas.margin.top}
        width={canvas.width}
        height={canvas.height}
        onMouseMove={onMove}
        onMouseLeave={() => setActive(null)}
      />

      <g
        className="hover-marker"
        style={{ transform: `translateX(${px}px)`, opacity: active !== null ? 1 : 0 }}
      >
        {/* guide runs from the tooltip down to the axis, through every dot */}
        <line className="marker-guide" x1={0} y1={boxTop + boxH} x2={0} y2={bottom} />

        {series.map((s) => {
          const cy = pixelY(s.values[index]);

          // put the dot on the bezier curve (under the guide), not at the cut-off vertex
          const dotY = (s.bezier && index > 0 && index < s.values.length - 1)
            ? curvePointAtX(
              { x: data[index - 1].x, y: pixelY(s.values[index - 1]) },
              { x: px, y: cy },
              { x: data[index + 1].x, y: pixelY(s.values[index + 1]) },
              index === 1,
              px,
            ).y
            : cy;

          return (
            <g key={s.id} className="hover-dot" style={{ transform: `translateY(${dotY}px)` }}>
              <circle cx={0} cy={0} r="5" fill={s.color} stroke="#fff" strokeWidth="2" />
            </g>
          );
        })}

        <g className="marker-tooltip" transform={`translate(${boxLeft}, ${boxTop})`}>
          <rect className="marker-box" width={boxW} height={boxH} rx={6} ry={6} />
          {series.map((s, si) => {
            const rowY = padY + (rowH * si) + (rowH / 2);

            return (
              <g key={s.id}>
                <circle cx={padX + swatch} cy={rowY} r={swatch} fill={s.color} />
                <text
                  className="marker-value"
                  x={padX + (swatch * 2) + gap}
                  y={rowY}
                  fontSize={fontSize}
                  dominantBaseline="central"
                >
                  {`${valueFormat(s.values[index])}`}
                </text>
              </g>
            );
          })}
        </g>
      </g>
    </g>
  );
};


/**
 * Line series element (rendered once per data point by coordinate/point).
 *
 * The poly-line (`bezier` → rounded, otherwise straight), the optional gradient
 * area and the hover layer are drawn once, on the first point of the series; a
 * marker is drawn on every point when `marker` is enabled. Colours come from the
 * `color` option (prop) rather than css.
 *
 * @param {object}           options
 * @param {boolean}          options.area         gradient area below the line (primary series)
 * @param {boolean}          options.hover        single sliding marker on hover (primary series)
 * @param {boolean}          options.bezier       rounded (true) or straight (false) line
 * @param {boolean|Function} options.marker       point markers: true (default dot) or ({ id, x, y, value, index, color }) => element
 * @param {string}           options.seriesId     data series id (passed to a custom marker)
 * @param {string}           options.color        line + area + marker colour
 * @param {boolean}          options.dashed       dashed line (e.g. a trend line)
 * @param {Function}         options.valueFormat  format the value printed in the hover box
 * @param {string}           options.gradientId   svg id of the area gradient (unique per chart)
 */
export const Line = ({
  area = false,
  hover = false,
  hoverSeries,
  tooltip,
  bezier = true,
  marker = false,
  seriesId,
  color = DEFAULT_COLOR,
  dashed = false,
  valueFormat = (value) => value,
  gradientId = 'line-gradient',
} = {}) =>
  ({ x, y, canvas, index, value, data }) => {

    const isFirst = index === data[0].index;

    const points = data.map((point, i) => `${i ? 'L' : 'M'}${point.x},${point.y}`).join(' ');
    const linePath = bezier ? roundPathCorners(points, CORNER_RADIUS, false) : points;

    // chart bottom in pixel, used as the area fill baseline
    const baseline = canvas.margin.top + canvas.height;

    const lineStyle = { stroke: color };
    if (dashed) {
      lineStyle.strokeWidth = 2;
      lineStyle.strokeDasharray = '6 6';
    }

    /**
     * Marker on this point (drawn on every point). For a bezier line the inner
     * points are placed on the rounded corner, not at the cut-off data vertex.
     */
    let markerNode = null;
    if (marker) {
      const pos = (bezier && index > 0 && index < data.length - 1)
        ? curvePointAtX(data[index - 1], data[index], data[index + 1], index === 1, x)
        : { x, y };

      markerNode = typeof marker === 'function'
        ? marker({ id: seriesId, x: pos.x, y: pos.y, value: value.y, index, color })
        : <DefaultMarker x={pos.x} y={pos.y} color={color} />;
    }

    return (
      <g>
        {isFirst && area &&
          <>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" style={{ stopColor: color, stopOpacity: 0.2 }} />
                <stop offset="100%" style={{ stopColor: color, stopOpacity: 0 }} />
              </linearGradient>
            </defs>
            <path
              className="area"
              d={`${linePath} L${data[data.length - 1].x},${baseline} L${data[0].x},${baseline} Z`}
              fill={`url(#${gradientId})`}
            />
          </>
        }

        {isFirst &&
          <path className="line" d={linePath} fill="none" style={lineStyle} />
        }

        {markerNode}

        {isFirst && hover &&
          (hoverSeries && hoverSeries.length > 1
            ? <MultiHoverLayer data={data} canvas={canvas} valueFormat={valueFormat} series={hoverSeries} />
            : <HoverLayer data={data} canvas={canvas} valueFormat={valueFormat} color={color} tooltip={tooltip} bezier={bezier} />)
        }
      </g>
    );
  };


/**
 * Line chart.
 *
 * Multiple series are supported. `bezier`, `marker`, `color` and `dashed` can be
 * set per series on the data (overriding the chart-level defaults); `area` and
 * `hover` always follow the primary — first — series and are chart-level only.
 *
 * `marker` may be a boolean or a render function `({ id, x, y, value, index, color })
 * => element` — the same idea as `yAxisLabel`; it receives the series id so a
 * single function can draw a different marker per series.
 *
 * @param {boolean}          area
 * @param {boolean}          hover
 * @param {boolean}          bezier       default line shape (per-series `bezier` overrides)
 * @param {boolean|Function} marker       default marker (per-series `marker` boolean toggles it)
 * @param {string}           color        default line colour (per-series `color` overrides)
 * @param {Function}         xAxisFormat  (value, index) => label — format / hide an x-axis label
 * @param {Function}         valueFormat  format the value shown in the hover box
 */
const ChartLine = ({
  area = false,
  hover = false,
  tooltip,
  bezier = true,
  marker = true,
  color = DEFAULT_COLOR,
  xAxisFormat,
  valueFormat,
  // false (default): one step of x-padding on each side (points sit inset).
  // true: the first point starts at the left edge and the last ends at the right
  // edge — the line/area fills the plot width (stat/stock cards).
  edgeToEdge = false,
  ...props
}) => {

  const gradientId = `line-gradient-${props.data[0].id || '0'}`;

  // every series' values + resolved colour + line shape, for the multi-line hover
  const hoverSeries = props.data.map((s) => ({
    id: s.id,
    values: s.values,
    color: s.color || color,
    bezier: s.bezier !== undefined ? s.bezier : bezier,
  }));

  const xAxis = props.data[0].xAxis || props.data[0].values;
  const length = props.data[0].values.length;
  const labels = xAxis.map((v, i) => (xAxisFormat ? xAxisFormat(v, i) : v));

  return (
    <Coordinate
      id="line"

      xAxisValueMin={edgeToEdge ? 0 : -1}
      xAxisValueMax={edgeToEdge ? Math.max(length - 1, 1) : length}

      xAxisValues={edgeToEdge ? labels : [null, ...labels, null]}
      yAxisValueMin={findMinimumValueInSeries(props.data)}

      yGrid={false}

      margin={{
        top: 40,
        right: 100,
        bottom: 40,
        left: 100,
      }}

      {...props}

      className={props.className || `chart line rounded${area ? ' area' : ''}${hover ? ' hover' : ''}`}
      data={
        props.data.reduce((result, series, i) => {
          const showMarker = series.marker !== undefined ? !!series.marker : !!marker;

          const element = Line({
            area: area && i === 0,   // area only under the primary series
            hover: hover && i === 0, // hover overlay driven by the primary series
            hoverSeries: (hover && i === 0) ? hoverSeries : undefined,
            tooltip: (hover && i === 0) ? tooltip : undefined,
            bezier: series.bezier !== undefined ? series.bezier : bezier,
            marker: showMarker ? (typeof marker === 'function' ? marker : true) : false,
            seriesId: series.id,
            color: series.color || color,
            dashed: !!series.dashed,
            valueFormat,
            gradientId,
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

export default ChartLine;
