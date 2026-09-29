import React from 'react';
import { useDispatch } from 'react-redux';
import Coordinate from './coordinate';

import { tooltip, flush } from '../layer/actions';

/* !- Constants */

const MINUTE = 60000;

const COLORS = ['#55b45f', '#e8792b', '#186eff', '#9b5de5'];


/* !- Types */

export interface ITimelineItem {
  title: string,
  // ms
  duration: number,
  // 'YYYY-MM-DD HH:mm:ss' | ISO | Date
  startDateTime: string | Date,
  color?: string,
}

export interface PropTypes {
  data: ITimelineItem[],
  // x-axis origin (minute 0); defaults to the earliest startDateTime
  start?: string | Date,
  // x-axis range and division, in minutes relative to `start`
  xAxisFrom?: number,
  xAxisTo?: number,
  xAxisStep?: number,
  xAxisFormat?: (minute: number) => React.ReactNode,
  // when set, the hovered bar shows the ui (layer) tooltip with this content
  tooltipFormat?: (item: ITimelineItem, index: number) => React.ReactNode,
  // bar height in svg units (defaults to the plot height)
  barHeight?: number,
  // corner radius of every bar
  radius?: number,
  // short events still get a visible pill
  minBarWidth?: number,
  width?: number,
  height?: number,
  margin?: { top: number, right: number, bottom: number, left: number },
  responsive?: boolean,
  className?: string,
}


/* !- Helpers */

// Safari does not parse 'YYYY-MM-DD HH:mm:ss'
const toTime = (value: string | Date): number =>
  (value instanceof Date ? value : new Date(String(value).replace(' ', 'T'))).getTime();


/* !- Elements */

/**
 * Every bar of the timeline. Drawn once (on the first point) so a single
 * stateful component owns the hover.
 */
const TimelineSeries = ({ data, canvas, barHeight, radius, minBarWidth, tooltipFormat }) => {
  const dispatch = useDispatch();
  const [active, setActive] = React.useState<number | null>(null);

  const height = Math.min(barHeight || canvas.height, canvas.height);
  const top = canvas.y + ((canvas.height - height) / 2);
  const left = canvas.x;
  const right = canvas.x + canvas.width;

  const bars = data.map(({ x, value, index }) => {
    const { item } = value;
    const color = item.color || COLORS[index % COLORS.length];

    const x1 = Math.max(left, x);
    const x2 = Math.min(right, x + (canvas.colWidth * (item.duration / MINUTE)));
    const barWidth = Math.max(minBarWidth, x2 - x1);

    return { item, index, color, x: x1, width: barWidth };
  })
    // out of the visible range
    .filter(bar => bar.x < right && bar.x + bar.width > left);

  const onEnter = bar => (event) => {
    setActive(bar.index);

    if (tooltipFormat) {
      dispatch(tooltip(tooltipFormat(bar.item, bar.index), event));
    }
  };

  const onLeave = () => {
    setActive(null);

    if (tooltipFormat) {
      dispatch(flush());
    }
  };

  return (
    <g className="timeline-series">
      {bars.map(bar => (
        <rect
          key={bar.index}
          x={bar.x}
          y={top}
          width={bar.width}
          height={height}
          rx={Math.min(radius, bar.width / 2, height / 2)}
          fill={bar.color}
          fillOpacity={active === bar.index ? 0.4 : 0.2}
          stroke={bar.color}
          strokeWidth={1.5}
          onMouseEnter={onEnter(bar)}
          onMouseLeave={onLeave}
        />
      ))}
    </g>
  );
};

export const Bar = options => (props) => {
  if (props.index !== props.data[0].index) {
    return null;
  }

  return <TimelineSeries {...props} {...options} />;
};

/**
 * Timeline Chart
 *
 * Events (start + duration) as pills on one row over a minute-scaled x-axis.
 */
const Timeline: React.FC<PropTypes> = (props) => {
  const {
    data = [],
    start,
    xAxisFrom = 0,
    xAxisTo = 15,
    xAxisStep = 5,
    xAxisFormat = (minute: number) => minute,
    tooltipFormat,
    barHeight = 0,
    radius = 4,
    minBarWidth = 8,
    width = 320,
    height = 90,
    margin = {
      top: 4,
      right: 16,
      bottom: 26,
      left: 16,
    },
    responsive,
    className = 'chart timeline',
  } = props;

  const origin = start
    ? toTime(start)
    : Math.min(...data.map(item => toTime(item.startDateTime)));

  const element = Bar({ barHeight, radius, minBarWidth, tooltipFormat });

  const points = data.map(item => ({
    x: (toTime(item.startDateTime) - origin) / MINUTE,
    y: 0.5,
    item,
    element,
  }));

  const xAxisLabel = ({ value, x, y }) => (
    <text
      x={x}
      y={y + 10}
      dominantBaseline="hanging"
      textAnchor="middle"
      fontSize={13}
      fill="#6b7280"
    >
      {xAxisFormat(Number(value.x))}
    </text>
  );

  return (
    <Coordinate
      className={className}
      data={{ timeline: points }}
      width={width}
      height={height}
      margin={margin}
      responsive={responsive}
      xAxisValueMin={xAxisFrom}
      xAxisValueMax={xAxisTo}
      xAxisSteps={Math.max(1, Math.round((xAxisTo - xAxisFrom) / xAxisStep))}
      xAxisLabel={xAxisLabel}
      yAxisValueMin={0}
      yAxisValueMax={1}
      yAxisSteps={1}
      xGrid={false}
      yGrid={false}
      yAxis={false}
    />
  );
};

export default Timeline;
