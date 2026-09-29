import React from 'react';
import { Meta, StoryObj } from '@storybook/react';

require('../../../assets/style/index.scss');


/* !- Compontents */

import ChartBar from '../../chart/bar';
import ChartGroup from '../../chart/group';
import ChartLine from '../../chart/line';


/* !- Constants */

const data = [
  {
    id: 's1',
    label: 'store1',
    values: [100, 200, 50],
    xAxis: ['Lorem', 'ipsum', 'dolor'],
  },
  {
    id: 's2',
    label: 'store2',
    values: [20, 30, 10],
    xAxis: ['RS1', 'RS2', 'RS3'],
  },
];


/* perceived-luminance check, to flip the label colour on light / dark fills */
const isDark = (hex: string): boolean => {
  const c = hex.replace('#', '');
  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);
  return (r * 0.299) + (g * 0.587) + (b * 0.114) < 150;
};


/* !- Stories */

const meta = {
  title: 'Chart/Bar',
  component: ChartBar,
  argTypes: {
    color: { control: 'color' },
    activeColor: { control: 'color' },
  },
} satisfies Meta<typeof ChartBar>;

export default meta;


type Story = StoryObj<typeof meta>;


/* !- Basic Bar */

export const Bar1: Story = {
  args: {
    data: [data[0]],
    width: 800,
    height: 250,
  },
};

Bar1.storyName = 'Basic';


/* !- Negative Bar */

export const Bar2: Story = {
  args: {
    data: [
      {
        id: 'negative',
        label: 'Negative',
        values: [10, -30, 25, -5],
      },
    ],
    width: 800,
    height: 250,
  },
};

Bar2.storyName = 'Negative';


/* !- Double Bar (colour per series) */

export const Bar3: Story = {
  args: {
    data: [
      { ...data[0], color: '#ffab2b' },
      { ...data[1], color: '#252631' },
    ],
    width: 800,
    height: 250,
  },
};

Bar3.storyName = 'Double bar';


/* !- Bar + Line to compare */

export const Bar4: Story = {
  render: () => (
    <ChartGroup
      width={800}
      height={250}
      data={data}
    >
      <ChartBar />
      <ChartLine
        xGrid={false}
        xAxis={false}
        yAxis={false}
        y2Axis={true}
      />
    </ChartGroup>
  ),
};

Bar4.storyName = 'Bar + Line to compare';


/* !- Weekly: highlight the max, reveal the hovered bar
   ------------------------------------------------------------------
   Muted bars; the largest is highlighted (blue) with its value shown and its
   label coloured. Hovering reveals only the bar under the cursor instead — the
   default value + highlight (no custom render-prop needed). */

export const Weekly: Story = {
  args: {
    data: [
      {
        id: 'week',
        values: [5200, 4300, 8162, 3600, 2900, 6100, 6400],
        xAxis: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      },
    ],
    color: '#eceef1',
    activeColor: '#186eff',
    highlight: 'max',
    hover: true,
    showValue: 'active',
    roundBottom: true,
    barLabels: true,
    valueFormat: (v: number) => v.toLocaleString('en-US'),
    xAxis: false,
    yAxis: false,
    xGrid: false,
    yAxisValueMin: 0,
    width: 560,
    height: 280,
    margin: {
      top: 52,
      right: 20,
      bottom: 44,
      left: 20,
    },
  },
};

Weekly.storyName = 'Weekly (highlight max + hover)';


/* !- Custom hover value: a floating pill tooltip
   ------------------------------------------------------------------
   Same interaction, but the value display is fully custom through the `tooltip`
   render-prop (the generalised "current value" seam, same idea as the line
   chart). Here: an orange active bar with a black rounded pill above it. */

const pillTooltip = ({ value, x, y }: any) => {
  const label = `$${value.toFixed(2)}`;
  const fontSize = 15;
  const boxW = (label.length * fontSize * 0.6) + 24;
  const boxH = fontSize + 16;
  const boxY = Math.max(4, y - boxH - 12);

  return (
    <g>
      <rect x={x - (boxW / 2)} y={boxY} width={boxW} height={boxH} rx={boxH / 2} ry={boxH / 2} fill="#1c1c22" />
      <text
        x={x}
        y={boxY + (boxH / 2)}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={fontSize}
        fontWeight={700}
        fill="#fff"
      >
        {label}
      </text>
    </g>
  );
};

export const CustomTooltip: Story = {
  args: {
    data: [
      {
        id: 'sales',
        values: [78.4, 114.79, 96.2, 61.5, 88.1, 103.4, 72.9],
        xAxis: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      },
    ],
    color: '#edeff1',
    activeColor: '#f2802a',
    highlight: 'max',
    hover: true,
    showValue: 'active',
    roundBottom: true,
    tooltip: pillTooltip,
    barLabels: true,
    xAxis: false,
    yAxis: false,
    xGrid: false,
    yAxisValueMin: 0,
    width: 560,
    height: 300,
    margin: {
      top: 64,
      right: 20,
      bottom: 44,
      left: 20,
    },
  },
};

CustomTooltip.storyName = 'Custom hover value (pill tooltip)';


/* !- Progress: 100% track + fixed labels + per-bar decoration
   ------------------------------------------------------------------
   The fully custom look: a striped 100% background track (`track="hatch"`,
   styled from the outside), per-bar fill colours, always-on value labels drawn
   inside via `tooltip`, and a per-bar target tick via the `marker` render-prop. */

const greens = ['#55b45f', '#d3ecbb', '#e8f3db'];

const progressValue = ({ value, x, y, width, color }: any) => (
  <text
    x={x - (width / 2) + 18}
    y={y + 32}
    fontSize={22}
    fontWeight={700}
    fill={isDark(color) ? '#ffffff' : '#3c4a2e'}
  >
    {`${value}%`}
  </text>
);

const targetTick = ({ x, y, width }: any) => (
  <line
    x1={x - (width * 0.16)}
    y1={y}
    x2={x + (width * 0.16)}
    y2={y}
    stroke="#14161c"
    strokeWidth={4}
    strokeLinecap="round"
  />
);

export const Progress: Story = {
  args: {
    data: [
      {
        id: 'progress',
        values: [64, 52, 46],
        xAxis: ['Mon', 'Tue', 'Wed'],
      },
    ],
    color: (_value: number, index: number) => greens[index],
    track: 'hatch',
    trackColor: '#e6eaef',
    radius: 18,
    roundBottom: true,
    gap: 0.3,
    showValue: 'always',
    tooltip: progressValue,
    marker: targetTick,
    barLabels: true,
    valueFormat: (v: number) => `${v}%`,
    xAxis: false,
    yAxis: false,
    xGrid: false,
    yAxisValueMin: 0,
    yAxisValueMax: 100,
    width: 560,
    height: 340,
    margin: {
      top: 24,
      right: 16,
      bottom: 44,
      left: 16,
    },
  },
};

Progress.storyName = 'Progress (100% track + fixed labels)';
