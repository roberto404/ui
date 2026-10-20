import React from 'react';

import Coordinate from './coordinate';
import { PLOT, SERIES } from './colors';


/* !- Types */

export interface GaugeMarker
{
  value: number,
  /** e.g. "Idei átlag", "Múlt hó" */
  label: string,
  /** overrides `markerColor` (tick) */
  color?: string,
}

export interface GaugeColors
{
  /** active ticks (origin → value) and the area behind them */
  color?: string,
  /** default: `color` */
  needleColor?: string,
  /** inactive ticks */
  trackColor?: string,
  /** mark of the origin (0) */
  originColor?: string,
  /** dotted inner ring */
  dotColor?: string,
  /** reference marker ticks */
  markerColor?: string,
  /** marker names (bold) */
  labelColor?: string,
  /** marker values, axis labels, caption */
  mutedColor?: string,
  /** big value */
  textColor?: string,
  targetColor?: string,
  /**
   * background behind the gauge (= card colour, hex or rgb()): the other colours are
   * derived from it (light / dark text, track, dots …), default white
   */
  background?: string,
  /** opacity of the area between the origin and the value */
  areaOpacity?: number,
}

export interface PropTypes extends GaugeColors
{
  value: number,
  /** scale start (left end), default -100 */
  min?: number,
  /** scale end (right end), default 100 */
  max?: number,
  /** the active ticks start here (clamped into min..max), default 0 */
  origin?: number,
  /** reference values outside the arc (yearly average, last month …) */
  markers?: GaugeMarker[],
  /** target: drawn like a marker, bold, `targetColor` */
  target?: GaugeMarker,
  /** marker labels with their value (`Múlt hó +21`); false = name only (compact) */
  markerValues?: boolean,
  /** number of ticks on the half circle */
  ticks?: number,
  valueFormat?: (value: number) => string,
  /** text under the big value (svg text: string / <tspan>) */
  caption?: React.ReactNode,
  /** axis labels (min, origin, max); false = hidden */
  axisLabels?: boolean,
  width?: number,
  /** scales to the wrapper width keeping the width / height ratio */
  responsive?: boolean,
  className?: string,
}


/* !- Constants */

/** outer radius of the ticks: every other size follows it */
const R = 200;
const TICK_INNER = R * 0.775;
const TICK_WIDTH = 7;
const DOTS = R * 0.7;
const AREA = R + 14;
const NEEDLE_RING = R + 18;
const NEEDLE_RING_R = 7;
const MARKER_FROM = R + 12;
const MARKER_TO = R + 24;
const MARKER_LABEL = R + 34;

const VALUE_SIZE = 80;
const CAPTION_SIZE = 15;
const LABEL_SIZE = 14;
const AXIS_SIZE = 15;

/** room above the arc for the (stacked) marker labels / below it for the axis labels */
const TOP = 72;
const BOTTOM = 34;
const SIDE = 90;

/** 34 -> "+34", -20 -> "−20" */
export const signedFormat = (value: number) =>
  `${value > 0 ? '+' : value < 0 ? '−' : ''}${Math.abs(Math.round(value)).toLocaleString('hu-HU')}`;


/* !- Helpers */

type Rgb = [number, number, number];

/** "#fff" / "#121418" / "rgb(18, 20, 24)" -> [r, g, b]; unknown -> white */
const toRgb = (color: string): Rgb =>
{
  const hex = color.trim().match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);

  if (hex)
  {
    const value = hex[1].length === 3 ? hex[1].replace(/./g, '$&$&') : hex[1];
    return [0, 2, 4].map(i => parseInt(value.slice(i, i + 2), 16)) as Rgb;
  }

  const rgb = color.match(/rgba?\(\s*(\d+)[\s,]+(\d+)[\s,]+(\d+)/i);

  return rgb ? [Number(rgb[1]), Number(rgb[2]), Number(rgb[3])] : [255, 255, 255];
};

/** `amount` of `a` mixed into `b` (svg attributes: no css color-mix) */
const mix = (a: Rgb, b: Rgb, amount: number) =>
  `rgb(${a.map((value, i) => Math.round((value * amount) + (b[i] * (1 - amount)))).join(', ')})`;

/**
 * Colours of the gauge on a background: text / marks are black on a light, white on a dark
 * background, the track, dots and muted texts are their mixes with the background
 */
export const toGaugeColors = (background = '#fff'): Required<GaugeColors> =>
{
  const bg = toRgb(background);
  const isDark = ((0.299 * bg[0]) + (0.587 * bg[1]) + (0.114 * bg[2])) / 255 < 0.5;
  const fg = toRgb(isDark ? '#fff' : PLOT.text);
  const series = toRgb(SERIES[0]);
  const white = toRgb('#fff');

  return {
    // the blue is lightened on a dark background, so it stands out
    color: isDark ? mix(series, white, 0.75) : SERIES[0],
    needleColor: isDark ? mix(series, white, 0.5) : SERIES[0],
    trackColor: mix(fg, bg, isDark ? 0.16 : 0.1),
    originColor: mix(fg, bg, 1),
    dotColor: mix(fg, bg, isDark ? 0.25 : 0.22),
    markerColor: mix(fg, bg, 0.45),
    labelColor: mix(fg, bg, isDark ? 0.8 : 0.7),
    mutedColor: mix(fg, bg, 0.55),
    textColor: mix(fg, bg, 1),
    targetColor: mix(fg, bg, 1),
    background,
    areaOpacity: isDark ? 0.16 : 0.1,
  };
};

type Box = { x1: number, x2: number, y1: number, y2: number };

const overlaps = (a: Box, b: Box) =>
  a.x1 < b.x2 && b.x1 < a.x2 && a.y1 < b.y2 && b.y1 < a.y2;

/** approximate text width (no DOM measuring: the chart is also rendered on the server) */
const textWidth = (text: string, size: number) => text.length * size * 0.56;


/* !- Elements */

/**
 * The whole gauge, drawn once (on the first point): ticks, area, origin mark,
 * dotted ring, needle, markers (labels stacked upwards when they collide),
 * axis labels, the big value and the caption.
 */
const GaugeSeries = ({
  canvas,
  value,
  min,
  max,
  origin,
  markers,
  target,
  markerValues,
  ticks,
  valueFormat,
  caption,
  axisLabels,
  colors,
}) =>
{
  const c: Required<GaugeColors> = colors;
  const cx = canvas.x + (canvas.width / 2);
  const cy = canvas.y + TOP + R;

  const range = (max - min) || 1;
  const clamp = (v: number) => Math.min(max, Math.max(min, v));
  // left end: π, right end: 0 (over the top)
  const toAngle = (v: number) => Math.PI * (1 - ((clamp(v) - min) / range));
  const toPoint = (v: number, r: number) =>
  {
    const angle = toAngle(v);
    return { x: cx + (r * Math.cos(angle)), y: cy - (r * Math.sin(angle)) };
  };

  const from = clamp(origin);
  const to = clamp(value);
  const distance = Math.abs(to - from) || 1;
  const step = range / (ticks - 1);

  // area: circle sector between the origin and the value
  const areaFrom = toPoint(from, AREA);
  const areaTo = toPoint(to, AREA);
  const area = `M${cx},${cy} L${areaFrom.x},${areaFrom.y} A${AREA},${AREA} 0 0 ${to > from ? 1 : 0} ${areaTo.x},${areaTo.y} Z`;

  const needleFrom = toPoint(to, DOTS);
  const needleTo = toPoint(to, NEEDLE_RING - NEEDLE_RING_R);
  const needleRing = toPoint(to, NEEDLE_RING);

  const originFrom = toPoint(from, TICK_INNER - 2);
  const originTo = toPoint(from, R + 2);

  // markers + target: label positions, collisions pushed upwards
  const placed: Box[] = [];
  const labels = [
    ...(markers || []).map(marker => ({ ...marker, isTarget: false })),
    ...(target ? [{ ...target, isTarget: true }] : []),
  ]
    .sort((a, b) => Math.abs(a.value - from) - Math.abs(b.value - from))
    .map((marker) =>
    {
      const angle = toAngle(marker.value);
      const cos = Math.cos(angle);
      const point = toPoint(marker.value, MARKER_LABEL);
      const valueText = markerValues ? ` ${valueFormat(marker.value)}` : '';
      const width = textWidth(marker.label + valueText, LABEL_SIZE);
      // side labels are vertically centred to their tick, the top ones sit on it
      let y = point.y + (Math.abs(cos) > 0.25 ? LABEL_SIZE / 3 : 0);

      const toBox = (anchor: string): Box =>
      {
        const x = anchor === 'start' ? point.x : (anchor === 'end' ? point.x - width : point.x - (width / 2));
        // kept inside the drawing
        const x1 = Math.max(canvas.x, Math.min(x, canvas.x + canvas.width - width));
        return { x1, x2: x1 + width, y1: y - LABEL_SIZE, y2: y + 3 };
      };
      const isFree = (anchor: string) => !placed.some(box => overlaps(box, toBox(anchor)));

      // collision: first try to align the label away from the others, then push it upwards
      const outwards = marker.value >= from ? 'start' : 'end';
      const anchors = cos > 0.25 ? ['start'] : (cos < -0.25 ? ['end'] : ['middle', outwards]);
      let anchor = anchors.find(isFree);

      if (!anchor)
      {
        anchor = anchors[0];

        while (!isFree(anchor))
        {
          y -= LABEL_SIZE + 3;
        }
      }

      const box = toBox(anchor);

      placed.push(box);

      return {
        ...marker,
        tickFrom: toPoint(marker.value, MARKER_FROM),
        tickTo: toPoint(marker.value, MARKER_TO),
        x: box.x1,
        y,
        valueText,
      };
    });

  const minPoint = toPoint(min, (TICK_INNER + R) / 2);
  const maxPoint = toPoint(max, (TICK_INNER + R) / 2);
  const originLabel = toPoint(from, DOTS - 22);

  return (
    <g className="gauge-series">
      <path className="gauge-area" d={area} fill={c.color} fillOpacity={c.areaOpacity} />

      <g className="gauge-ticks">
        { Array.from({ length: ticks }, (_, index) =>
        {
          const tick = min + (index * step);

          // the origin has its own mark
          if (Math.abs(tick - from) < step / 2)
          {
            return null;
          }

          const isActive = (tick - from) * (to - from) > 0 && Math.abs(tick - from) <= Math.abs(to - from);
          const a = toPoint(tick, TICK_INNER);
          const b = toPoint(tick, R);

          return (
            <line
              key={index}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke={isActive ? c.color : c.trackColor}
              // lighter at the origin, stronger towards the value
              strokeOpacity={isActive ? 0.35 + (0.65 * (Math.abs(tick - from) / distance)) : 1}
              strokeWidth={TICK_WIDTH}
              strokeLinecap="round"
            />
          );
        })}
      </g>

      <path
        className="gauge-dots"
        d={`M${cx - DOTS},${cy} A${DOTS},${DOTS} 0 0 1 ${cx + DOTS},${cy}`}
        fill="none"
        stroke={c.dotColor}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeDasharray="0 9"
      />

      <line
        className="gauge-origin"
        x1={originFrom.x}
        y1={originFrom.y}
        x2={originTo.x}
        y2={originTo.y}
        stroke={c.originColor}
        strokeWidth={4}
      />

      { labels.map((marker, index) =>
      {
        const color = marker.isTarget ? c.targetColor : (marker.color || c.markerColor);

        return (
          <g key={index} className={marker.isTarget ? 'gauge-target' : 'gauge-marker'}>
            <line
              x1={marker.tickFrom.x}
              y1={marker.tickFrom.y}
              x2={marker.tickTo.x}
              y2={marker.tickTo.y}
              stroke={color}
              strokeWidth={3}
              strokeLinecap="round"
            />
            <text
              x={marker.x}
              y={marker.y}
              fontSize={LABEL_SIZE}
              style={{ fill: c.mutedColor }}
            >
              <tspan fontWeight={700} style={{ fill: marker.isTarget ? c.targetColor : c.labelColor }}>
                {marker.label}
              </tspan>
              {marker.valueText}
            </text>
          </g>
        );
      })}

      <g className="gauge-needle">
        <line
          x1={needleFrom.x}
          y1={needleFrom.y}
          x2={needleTo.x}
          y2={needleTo.y}
          stroke={c.needleColor}
          strokeWidth={4}
          strokeLinecap="round"
        />
        <circle
          cx={needleRing.x}
          cy={needleRing.y}
          r={NEEDLE_RING_R}
          strokeWidth={4}
          style={{ fill: c.background, stroke: c.needleColor }}
        />
      </g>

      { axisLabels &&
      <g className="gauge-axis" fontSize={AXIS_SIZE} textAnchor="middle">
        <text x={minPoint.x} y={cy + BOTTOM - 10} style={{ fill: c.mutedColor }}>{valueFormat(min)}</text>
        <text x={maxPoint.x} y={cy + BOTTOM - 10} style={{ fill: c.mutedColor }}>{valueFormat(max)}</text>
        { from > min && from < max &&
        <text x={originLabel.x} y={originLabel.y} fontWeight={700} style={{ fill: c.textColor }}>
          {valueFormat(from)}
        </text>
        }
      </g>
      }

      <text
        className="gauge-value"
        x={cx}
        y={cy - (caption ? 34 : 6)}
        textAnchor="middle"
        fontSize={VALUE_SIZE}
        fontWeight={700}
        style={{ fill: c.textColor }}
      >
        {valueFormat(value)}
      </text>

      { caption &&
      <text
        className="gauge-caption"
        x={cx}
        y={cy - 2}
        textAnchor="middle"
        fontSize={CAPTION_SIZE}
        style={{ fill: c.mutedColor }}
      >
        {caption}
      </text>
      }
    </g>
  );
};

export const Dial = options => (props) =>
{
  if (props.index !== props.data[0].index)
  {
    return null;
  }

  return <GaugeSeries {...props} {...options} />;
};


/**
 * Gauge (potméter): a half circle of ticks from `min` to `max`, the ticks between the
 * `origin` and the value are active, a needle points to the value; reference markers
 * (yearly average, last month …) and a target outside the arc, the value in the middle.
 *
 * @example
 * <Gauge
 *   value={34}
 *   markers={[{ label: 'Idei átlag', value: 12 }, { label: 'Múlt hó', value: 21 }]}
 *   target={{ label: 'Cél', value: 50 }}
 *   caption="16 ponttal a cél alatt"
 *   responsive
 * />
 *
 * @example
 * // on a dark card: the colours follow the background
 * <ChartCard color="#121418" chart={() => <Gauge value={34} background="#121418" responsive />} />
 */
const Gauge: React.FC<PropTypes> = (
{
  value,
  min = -100,
  max = 100,
  origin = 0,
  markers = [],
  target,
  markerValues = true,
  ticks = 51,
  valueFormat = signedFormat,
  caption,
  axisLabels = true,
  width = (2 * R) + (2 * SIDE),
  responsive,
  className = 'chart gauge',
  background,
  ...colors
}) =>
{
  const height = TOP + R + BOTTOM;
  const derived = toGaugeColors(background);

  const element = Dial({
    value,
    min,
    max,
    origin,
    markers,
    target,
    markerValues,
    ticks,
    valueFormat,
    caption,
    axisLabels,
    colors: {
      ...derived,
      // a given `color` is the needle's colour too
      needleColor: colors.color ?? derived.needleColor,
      ...Object.fromEntries(Object.entries(colors).filter(([, color]) => color !== undefined)),
    },
  });

  return (
    <Coordinate
      id="gauge"
      className={className}
      data={{ gauge: [{ x: 0, y: 0, element }] }}
      width={width}
      height={height}
      margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
      responsive={responsive}
      // keep the ratio: the height follows the width, no distortion
      preserveAspectRatio="xMidYMid meet"
      xAxisValueMin={0}
      xAxisValueMax={1}
      yAxisValueMin={0}
      yAxisValueMax={1}
      xGrid={false}
      yGrid={false}
      xAxis={false}
      yAxis={false}
    />
  );
};


export default Gauge;
