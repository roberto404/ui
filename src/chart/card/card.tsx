import React from "react";
import classNames from "classnames";

import CardTitle from "./parts/title";
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

export type CardSlot = React.ReactNode | ((api: CardApi) => React.ReactNode);

export const defaultProps = {
  className: "bg-white-light rounded-xl shadow-outer-10",
  ratio: "16 / 9",
  filters: [] as FilterRegistration[],
  // extra class of the active (e.g. selected filter) card
  activeClassName: "",
};

export type ChartCardProps = Partial<typeof defaultProps> & {
  // redux grid id — one per card (required: all card state lives in redux)
  id: string;
  // series of the card; charts without series (funnel, pie, bullet …) may omit it
  data?: Series[];
  // string / number gets default headline styling; a node or render-prop is drawn as-is
  title?: CardSlot;
  // description after the title: (i) icon with a tooltip
  hint?: React.ReactNode;
  // top-right slot (period selector, search, big value …)
  header?: CardSlot;
  // bottom slot (summaries)
  footer?: CardSlot;
  // the chart itself, e.g. (api) => <ChartLine data={api.series} color={api.theme.fg} … />
  chart: (api: CardApi) => React.ReactNode;
  // stack header above the chart (vertical), beside it (minimal / horizontal) or
  // everything centered in one column, the chart at its natural size (centered)
  layout?: "vertical" | "horizontal" | "centered";
  // chart area first, then the header (horizontal: chart on the left, vertical: chart on top)
  reverse?: boolean;
  // vertical alignment of the title vs. the header slot
  headerAlign?: "center" | "flex-start";
  // theme / background colour; cascades to the text and (via api.theme) the chart
  color?: string;
  style?: React.CSSProperties;
  // makes the whole card clickable (e.g. applies a grid filter)
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  // gets `activeClassName`
  active?: boolean;
  // empty state: when set, shown in place of the chart (the footer is hidden)
  empty?: React.ReactNode;
};

/* !- Constants */

// stable reference for the cards without series
const NO_DATA: Series[] = [];

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
  data = NO_DATA,
  title,
  hint,
  header,
  footer,
  chart,
  className = defaultProps.className,
  ratio = defaultProps.ratio,
  filters = defaultProps.filters,
  layout = "vertical",
  reverse = false,
  headerAlign = "flex-start",
  color,
  style,
  onClick,
  active = false,
  activeClassName = defaultProps.activeClassName,
  empty,
}: ChartCardProps) => {
  const isEmpty = empty !== undefined && empty !== null && empty !== false;

  const api = useSeriesGrid(id, data, filters);

  // on a coloured card: white primary text/chart, a light tint of the colour for muted text
  const theme: CardTheme = {
    color: color || null,
    fg: color ? "#fff" : "currentColor",
    fgMuted: color ? `color-mix(in srgb, ${color}, #fff 62%)` : undefined,
  };

  const cardApi: CardApi = { ...api, theme };

  const isHorizontal = layout === "horizontal";
  const isCentered = layout === "centered";

  const title$ = renderSlot(title, cardApi);
  const header$ = renderSlot(header, cardApi);
  const footer$ = isEmpty ? null : renderSlot(footer, cardApi);

  const head = (title$ || header$) && (
    <div
      id="header"
      style={{
        display: "flex",
        alignItems: isCentered
          ? "center"
          : isHorizontal
            ? "flex-start"
            : headerAlign,
        justifyContent: isCentered ? "center" : "space-between",
        gap: "1rem",
        flexDirection: isHorizontal || isCentered ? "column" : "row",
        textAlign: isCentered ? "center" : undefined,
      }}
    >
      {title$ && (
        // chart first (beside the chart) or centered: the text may wrap
        <div
          id="title"
          className={classNames("medium", {
            nowrap: !(isHorizontal && reverse) && !isCentered,
          })}
        >
          <CardTitle
            title={
              typeof title === "string" || typeof title === "number" ? (
                <span className="text-gray-dark text-s">{title$}</span>
              ) : (
                title$
              )
            }
            hint={hint}
          />
        </div>
      )}
      {header$ && <div>{header$}</div>}
    </div>
  );

  const chartArea = (
    // `aspectRatio` only applies with a definite width: full width when stacked,
    // the remaining flex space (basis 0, so the svg can't inflate it) beside the header
    // centered: the chart (icon, donut …) keeps its own size
    <div
      id="chart-area"
      className={classNames({
        "w-full": !isHorizontal && !isCentered,
        "flex v-center": isCentered,
      })}
      style={isCentered || isEmpty ? undefined : { aspectRatio: ratio }}
    >
      {isEmpty ? (
        <div className="py-2 text-center text-gray">{empty}</div>
      ) : (
        chart(cardApi)
      )}
    </div>
  );

  return (
    <div
      id="chart-card"
      className={classNames(
        "chart-card column p-2 w-full",
        { "on-color": !!color, pointer: !!onClick },
        className,
        active && activeClassName,
      )}
      onClick={onClick}
      style={{
        boxSizing: "border-box",
        breakInside: "avoid",
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
          "column h-center gap-1": isCentered,
          "h-bottom v-justify gap-2": isHorizontal && !reverse,
          // chart first: the header right next to it, vertically centered
          "h-center gap-2": isHorizontal && reverse,
        })}
      >
        {reverse ? chartArea : head}
        {reverse ? head : chartArea}
      </div>
      {footer$ && <div id="footer">{footer$}</div>}
    </div>
  );
};

export default ChartCard;
