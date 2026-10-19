/**
 * Chart colour collection — the colours the charts use, by role.
 * The scss mirror (variables + text-chart-* / bg-chart-* classes) is
 * `assets/style/components/chartColors.scss`: change the two together.
 */

/**
 * Categorical series colours, assign them in this order (never cycled for a
 * 7th series: fold it into "other"). Validated for colour vision deficiency
 * in this order (adjacent pairs) on a white surface; the orange and the aqua
 * are below 3:1 contrast, so give them a label or a legend.
 */
export const SERIES = [
  "#186eff", // blue ($blue-dark)
  "#e8792b", // orange
  "#9b5de5", // violet
  "#14a6b8", // aqua
  "#c2410c", // rust
  "#e0569b", // magenta
];

export type StatusType = "good" | "warning" | "bad" | "neutral";

/**
 * Status colours (state, not series — never use them as a series colour):
 * `color` = mark (bubble, bar, icon), `fill` = light background (band, pill),
 * `text` = text on white or on the `fill` (≥ 4.5:1)
 */
export const STATUS: Record<StatusType, { color: string; fill: string; text: string }> = {
  good: { color: "#0bb96d", fill: "#f3f9ef", text: "#087a48" },
  warning: { color: "#ffab2b", fill: "#fef5e9", text: "#8f5208" },
  bad: { color: "#ea6c80", fill: "#fbeded", text: "#c42e4a" },
  neutral: { color: "#98a9bc", fill: "#edf0f3", text: "#5f6470" },
};

/**
 * Parts of the plot
 */
export const PLOT = {
  text: "#252631", // $black: values, point labels
  muted: "#98a9bc", // $gray: axis labels, titles
  grid: "#edf0f3",
  axis: "#98a9bc", // zero line, quadrant borders
  track: "#edf0f3", // empty part of a bar / bullet
  target: "#252631", // target mark
};

/** colour of the n-th series (the last one is repeated, not cycled) */
export const seriesColor = (index: number) =>
  SERIES[Math.min(Math.max(index, 0), SERIES.length - 1)];
