import React from "react";
import classNames from "classnames";

import useSeriesGrid, {
  Series,
  FilterRegistration,
  SeriesGridApi,
} from "./hooks/useSeriesGrid";

/* !- Types */

export type CardTheme = {
  color: string | null;
  // primary (value / chart) colour on a coloured card
  fg: string;
  // muted (labels / axis) colour on a coloured card
  fgMuted?: string;
};

// grid api handed to the render-props + the resolved card theme
export type CardApi = SeriesGridApi & { theme: CardTheme };

export type CardSlot =
  | React.ReactNode
  | ((api: CardApi) => React.ReactNode);

const defaultProps = {
  className: "bg-white-light rounded-xl shadow-outer-10",
  ratio: "16 / 9",
  filters: [] as FilterRegistration[],
};

export type ChartCardProps = Partial<typeof defaultProps> & {
  // redux grid id — one per card (required: all card state lives in redux)
  id: string;
  data: Series[];
  // string / number gets default headline styling; a node or render-prop is drawn as-is
  title?: CardSlot;
  // top-right slot (period selector, search, big value …)
  header?: CardSlot;
  // bottom slot (summaries)
  footer?: CardSlot;
  // the chart itself, e.g. (api) => <ChartLine data={api.series} color={api.theme.fg} … />
  chart: (api: CardApi) => React.ReactNode;
  // stack header above the chart (vertical) or beside it (minimal / horizontal)
  layout?: "vertical" | "horizontal";
  // vertical alignment of the title vs. the header slot
  headerAlign?: "center" | "flex-start";
  // theme / background colour; cascades to the text and (via api.theme) the chart
  color?: string;
  style?: React.CSSProperties;
};

/* !- Helpers */

const renderSlot = (
  slot: CardSlot | undefined,
  api: CardApi,
): React.ReactNode =>
  typeof slot === "function"
    ? (slot as (a: CardApi) => React.ReactNode)(api)
    : slot;

/**
 * Generic chart card.
 *
 * A rounded, shadowed panel that binds its `data` to a Redux grid (`id`) and
 * lays out three slots around a responsive chart: a header (title + actions), the
 * chart area (fixed aspect-ratio, scales with the wrapper) and a footer.
 *
 * `header`, `footer` and `chart` may be render-props receiving the grid api
 * (`series`, `points`, filter helpers) so every part reacts to the same filtered
 * / ordered data. The named templates (FilterCard, DateFilterCard, MinimalCard)
 * are thin compositions over this component.
 */
const ChartCard = ({
  id,
  data,
  title,
  header,
  footer,
  chart,
  className = defaultProps.className,
  ratio = defaultProps.ratio,
  filters = defaultProps.filters,
  layout = "vertical",
  headerAlign = "flex-start",
  color,
  style,
}: ChartCardProps) => {
  const api = useSeriesGrid(id, data, filters);

  // on a coloured card: white primary text/chart, a light tint of the colour for muted text
  const theme: CardTheme = {
    color: color || null,
    fg: color ? "#fff" : "currentColor",
    fgMuted: color ? `color-mix(in srgb, ${color}, #fff 62%)` : undefined,
  };

  const cardApi: CardApi = { ...api, theme };

  const isHorizontal = layout === "horizontal";

  const title$ = renderSlot(title, cardApi);
  const header$ = renderSlot(header, cardApi);
  const footer$ = renderSlot(footer, cardApi);

  const head = (title$ || header$) && (
    <div
      id="header"
      style={{
        display: "flex",
        alignItems: isHorizontal ? "flex-start" : headerAlign,
        justifyContent: "space-between",
        gap: "1rem",
        flexDirection: isHorizontal ? "column" : "row",
      }}
    >
      {title$ && (
        <div id="title">
          {typeof title === "string" || typeof title === "number" ? (
            <span className="text-gray-dark text-s">{title$}</span>
          ) : (
            title$
          )}
        </div>
      )}
      {header$ && <div>{header$}</div>}
    </div>
  );

  const chartArea = (
    <div
      id="chart-area"
      className="2w-full"
      style={{
        aspectRatio: ratio,
      }}
    >
      {chart(cardApi)}
    </div>
  );

  return (
    <div
      id="chart-card"
      className={classNames("chart-card column p-2 w-full", { "on-color": !!color }, className)}
      style={{
        boxSizing: "border-box",
        ...(color
          ? ({
              background: color,
              "--card-fg": theme.fg,
              "--card-fg-muted": theme.fgMuted,
            } as React.CSSProperties)
          : null),
        ...style,
      }}
    >
      <div
        className={classNames({
          "h-bottom v-justify gap-2": isHorizontal,
        })}
      >
        {head}
        {chartArea}
      </div>
      {footer$ && <div id="footer">{footer$}</div>}
    </div>
  );
};

export default ChartCard;
