import React from "react";
import { ReactReduxContext } from "react-redux";

import { tooltip as tooltipAction, flush } from "../layer/actions";
import { PLOT } from "./colors";

/* !- Types */

/**
 * Highlighted x axis label: e.g. a month with an explanation in the tooltip
 */
export type AxisHighlightType = {
  // data index of the x label
  index: number;
  // ui layer tooltip on hover (why is it highlighted)
  tooltip?: React.ReactNode;
  // background / text colour (default: light gray, dark text)
  color?: string;
  textColor?: string;
};

/**
 * Own y axis label at any value (e.g. "átlag 123 M Ft"); the axis labels near it are hidden
 */
export type AxisMarkType = {
  value: number;
  // small first line, e.g. "átlag"
  label?: React.ReactNode;
  // the value line (default: the value formatted with `format`)
  text?: React.ReactNode;
  // ui layer tooltip on hover
  tooltip?: React.ReactNode;
  // text colour
  color?: string;
  // horizontal dashed line at the value (grid style)
  line?: boolean;
};

/* !- Constants */

// darker than the axis labels
const MARK_COLOR = "#5f6470";

// axis labels closer than this (px) to a mark are hidden
const MARK_GAP = 24;

const PAD_X = 10;
const PAD_Y = 4;

/* !- Hooks */

/**
 * Hover tooltip in the ui layer (like the other charts), without a hook-level redux
 * dependency (the chart works without a Provider, e.g. ssr preview)
 */
const useHoverTooltip = (content?: React.ReactNode) => {
  const { store } = React.useContext(ReactReduxContext) || ({} as any);
  const isOpen = React.useRef(false);

  React.useEffect(() => () => {
    if (isOpen.current) {
      store?.dispatch(flush());
    }
  }, []);

  if (!content || !store) {
    return {};
  }

  return {
    onMouseEnter: (event: React.MouseEvent) => {
      isOpen.current = true;
      store.dispatch(tooltipAction(content, event));
    },
    onMouseLeave: () => {
      isOpen.current = false;
      store.dispatch(flush());
    },
  };
};

/* !- Elements */

/**
 * Highlight of an axis label: a rounded background measured to the label (any label
 * component), dark bold text (chart.scss .axis-highlight), tooltip on hover
 */
export const AxisHighlight = ({
  tooltip,
  color = PLOT.grid,
  textColor,
  children,
}: {
  tooltip?: React.ReactNode;
  color?: string;
  textColor?: string;
  children: React.ReactNode;
}) => {
  const ref = React.useRef<SVGGElement>(null);
  const [box, setBox] = React.useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const hover = useHoverTooltip(tooltip);

  React.useLayoutEffect(() => {
    const next = ref.current?.getBBox?.();

    if (
      next &&
      (!box || box.x !== next.x || box.y !== next.y || box.width !== next.width || box.height !== next.height)
    ) {
      setBox({ x: next.x, y: next.y, width: next.width, height: next.height });
    }
  });

  return (
    <g
      className="axis-highlight"
      style={{ cursor: tooltip ? "help" : undefined, ...(textColor ? { ["--axis-highlight-color" as string]: textColor } : {}) }}
      {...hover}
    >
      {box && (
        <rect
          className="axis-highlight-bg"
          x={box.x - PAD_X}
          y={box.y - PAD_Y}
          width={box.width + PAD_X * 2}
          height={box.height + PAD_Y * 2}
          rx={(box.height + PAD_Y * 2) / 2}
          fill={color}
        />
      )}
      <g ref={ref}>{children}</g>
    </g>
  );
};

/**
 * x axis label component with highlights: the highlighted labels (by data index) get
 * the AxisHighlight, the others the base label
 *
 * @param offset the data index of the axis label index (an inset chart has an empty first label)
 */
export const withXAxisHighlights = (
  Label: React.FC<any>,
  highlights: AxisHighlightType[],
  offset = 0,
) => {
  const byIndex = highlights.reduce(
    (result, highlight) => ({ ...result, [highlight.index]: highlight }),
    {} as { [index: number]: AxisHighlightType },
  );

  const HighlightedLabel = (props: any) => {
    const highlight = byIndex[props.i - offset];

    return highlight ? (
      <AxisHighlight tooltip={highlight.tooltip} color={highlight.color} textColor={highlight.textColor}>
        <Label {...props} />
      </AxisHighlight>
    ) : (
      <Label {...props} />
    );
  };

  return HighlightedLabel;
};

/**
 * y axis label component that hides the labels near the marks
 */
export const withYAxisMarks = (Label: React.FC<any>, marks: AxisMarkType[]) => {
  const MarkedLabel = (props: any) => {
    const { value, canvas } = props;
    const near = marks.some(
      (mark) => Math.abs(mark.value - value.y) * canvas.rowHeight < MARK_GAP,
    );

    return near ? null : <Label {...props} />;
  };

  return MarkedLabel;
};

const YAxisMark = ({
  mark,
  x,
  y,
  format,
}: {
  mark: AxisMarkType;
  x: number;
  y: number;
  format: (value: number) => React.ReactNode;
}) => {
  const hover = useHoverTooltip(mark.tooltip);

  return (
    <text
      className="axis-mark"
      x={x}
      y={y}
      textAnchor="end"
      fill={mark.color || MARK_COLOR}
      fontWeight="bold"
      style={{ cursor: mark.tooltip ? "help" : undefined }}
      {...hover}
    >
      {mark.label ? (
        <>
          <tspan x={x} dy="-0.35em" fontSize={12}>
            {mark.label}
          </tspan>
          <tspan x={x} dy="1.15em" fontSize={15}>
            {mark.text ?? format(mark.value)}
          </tspan>
        </>
      ) : (
        <tspan dominantBaseline="central" fontSize={15}>
          {mark.text ?? format(mark.value)}
        </tspan>
      )}
    </text>
  );
};

/**
 * Layer (Coordinate children / underlay render-prop) of the y axis marks: the label at
 * the y axis + the optional dashed line
 */
export const renderYAxisMarks = (
  marks: AxisMarkType[],
  format: (value: number) => React.ReactNode = (value) => value,
) =>
  ({ canvas, toPix }: any) =>
    marks.map((mark, index) => {
      const { y } = toPix(0, mark.value);

      return (
        <g key={`${mark.value}-${index}`} className="axis-marks">
          {mark.line && (
            <line
              x1={canvas.x}
              y1={y}
              x2={canvas.x + canvas.width}
              y2={y}
              stroke={PLOT.grid}
              strokeWidth={1.5}
              strokeDasharray="6 6"
            />
          )}
          <YAxisMark mark={mark} x={canvas.x - 8} y={y} format={format} />
        </g>
      );
    });
