import React from "react";
import Coordinate from "./coordinate";

/* !- Constants */

const COLORS = ["#2f5ca8", "#d4803c", "#55b45f", "#9b5de5"];

const TEXT_COLOR = "#14161c";
const MUTED_COLOR = "#5f6470";

/* !- Types */

export interface IFunnelStep {
  label: string;
  value: number;
  color?: string;
}

export interface PropTypes {
  data: IFunnelStep[];
  // 100% width value (default: the largest step)
  max?: number;
  valueFormat?: (value: number) => React.ReactNode;
  // text of the connector between two steps
  dropFormat?: (prev: IFunnelStep, next: IFunnelStep) => React.ReactNode;
  // narrower bars print value + label beside the bar, not inside
  insideMinWidth?: number;
  barHeight?: number;
  radius?: number;
  minBarWidth?: number;
  connectorColor?: string;
  // space between a bar and the connector (px); the connector ends are inset by the corner radius
  connectorGap?: number;
  width?: number;
  height?: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  // scales to the wrapper width keeping the width / height ratio
  responsive?: boolean;
  className?: string;
}

/* !- Elements */

/**
 * Every step of the funnel. Drawn once (on the first point): bar width ∝ value,
 * bars centered under each other, a trapezoid connector with the drop between.
 */
const FunnelSeries = ({
  data,
  canvas,
  max,
  valueFormat,
  dropFormat,
  insideMinWidth,
  barHeight,
  radius,
  minBarWidth,
  connectorColor,
  connectorGap,
}) => {
  const steps: IFunnelStep[] = data.map(({ value }) => value.step);
  const center = canvas.x + canvas.width / 2;
  const height = Math.min(barHeight, canvas.height / steps.length);
  const gap =
    steps.length > 1
      ? (canvas.height - height * steps.length) / (steps.length - 1)
      : 0;

  const bars = steps.map((step, index) => {
    const width = Math.max(
      minBarWidth,
      canvas.width * (max ? step.value / max : 0),
    );
    const x = center - width / 2;
    const y = canvas.y + index * (height + gap);

    return {
      step,
      index,
      x,
      y,
      width,
      color: step.color || COLORS[index % COLORS.length],
      inside: width >= insideMinWidth,
    };
  });

  return (
    <g className="funnel-series">
      {/* connectors under the bars */}
      {bars.slice(1).map((next, i) => {
        const prev = bars[i];
        const top = prev.y + height + connectorGap;
        const bottom = next.y - connectorGap;
        // inset by the corner radius: the connector starts where the rounded corner ends
        const prevInset = Math.min(radius, prev.width / 4);
        const nextInset = Math.min(radius, next.width / 4);

        return (
          <g key={`connector-${next.index}`} className="funnel-connector">
            <polygon
              points={[
                `${prev.x + prevInset},${top}`,
                `${prev.x + prev.width - prevInset},${top}`,
                `${next.x + next.width - nextInset},${bottom}`,
                `${next.x + nextInset},${bottom}`,
              ].join(" ")}
              fill={connectorColor}
            />
            <text
              x={center}
              y={(top + bottom) / 2}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={17}
              fill={MUTED_COLOR}
            >
              {dropFormat(prev.step, next.step)}
            </text>
          </g>
        );
      })}

      {bars.map((bar) => (
        <g key={bar.index} className="funnel-step">
          <rect
            x={bar.x}
            y={bar.y}
            width={bar.width}
            height={height}
            rx={Math.min(radius, bar.width / 2, height / 2)}
            fill={bar.color}
          />

          {bar.inside ? (
            <>
              <text
                x={bar.x + 24}
                y={bar.y + height / 2}
                dominantBaseline="central"
                fontSize={20}
                fill="#fff"
              >
                {bar.step.label}
              </text>
              <text
                x={bar.x + bar.width - 24}
                y={bar.y + height / 2}
                textAnchor="end"
                dominantBaseline="central"
                fontSize={24}
                fontWeight={700}
                fill="#fff"
              >
                {valueFormat(bar.step.value)}
              </text>
            </>
          ) : (
            <>
              <text
                x={bar.x + bar.width + 20}
                y={bar.y + height * 0.36}
                dominantBaseline="central"
                fontSize={24}
                fontWeight={700}
                fill={TEXT_COLOR}
              >
                {valueFormat(bar.step.value)}
              </text>
              <text
                x={bar.x + bar.width + 20}
                y={bar.y + height * 0.72}
                dominantBaseline="central"
                fontSize={17}
                fill={MUTED_COLOR}
              >
                {bar.step.label}
              </text>
            </>
          )}
        </g>
      ))}
    </g>
  );
};

export const Step = (options) => (props) => {
  if (props.index !== props.data[0].index) {
    return null;
  }

  return <FunnelSeries {...props} {...options} />;
};

/**
 * Funnel Chart
 *
 * Conversion steps stacked vertically, bar width proportional to the value,
 * the drop-off printed on the connector between two steps.
 */
const Funnel: React.FC<PropTypes> = (props) => {
  const {
    data = [],
    max = Math.max(0, ...data.map((step) => step.value)),
    valueFormat = (value: number) => value,
    dropFormat = (prev: IFunnelStep, next: IFunnelStep) =>
      `−${prev.value - next.value}`,
    insideMinWidth = 220,
    barHeight = 78,
    radius = 16,
    minBarWidth = 8,
    connectorColor = "#eff0f4",
    connectorGap = 6,
    width = 620,
    height = 340,
    margin = {
      top: 24,
      right: 36,
      bottom: 24,
      left: 36,
    },
    responsive,
    className = "chart funnel",
  } = props;

  const element = Step({
    max,
    valueFormat,
    dropFormat,
    insideMinWidth,
    barHeight,
    radius,
    minBarWidth,
    connectorColor,
    connectorGap,
  });

  const points = data.map((step, index) => ({
    x: 0,
    y: index,
    step,
    element,
  }));

  return (
    <Coordinate
      className={className}
      data={{ funnel: points }}
      width={width}
      height={height}
      margin={margin}
      responsive={responsive}
      // keep the ratio: the height follows the width, no distortion
      preserveAspectRatio="xMidYMid meet"
      xAxisValueMin={0}
      xAxisValueMax={1}
      yAxisValueMin={0}
      yAxisValueMax={Math.max(1, data.length - 1)}
      xGrid={false}
      yGrid={false}
      xAxis={false}
      yAxis={false}
    />
  );
};

export default Funnel;
