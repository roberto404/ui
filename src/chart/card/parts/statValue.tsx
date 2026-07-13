import React from "react";
import classNames from "classnames";
import { roundDecimal } from "@1studio/utils/math/round";

import IconTrending from "../../../icon/mui/trending_up";

/* !- Constants */

// size -> wrapper-relative font-size class (em / %). The value scales with the
// container's font-size — nothing here is a fixed px/rem.
const SIZE_CLASS = {
  xl: "zoom-2.5",
  l: "zoom-2",
  m: "text-l",
  s: "text-m",
};

/* !- Types */

export type StatValueProps = {
  value?: React.ReactNode;
  // signed percentage; sign drives colour + arrow direction
  change?: number;
  size?: keyof typeof SIZE_CLASS;
  align?: "left" | "right";
  // change under the value (stacked) or next to it (inline)
  changePosition?: "below" | "inline";
  // format a numeric value (thousands, currency, decimals …)
  format?: (value: number) => React.ReactNode;
  // format the change number (defaults to `12%`, sign shown via colour + arrow)
  changeFormat?: (change: number) => React.ReactNode;
};

/* !- Sub components */

/**
 * Coloured change badge: a trending arrow (flipped to point down when negative) +
 * the percentage. Green up / red down / grey flat. Colour, fill and size come
 * from utility classes, so the icon tracks the text colour and the wrapper size.
 */
export const ChangeBadge = ({
  change,
  format = (value) => `${roundDecimal(Math.abs(value), 100)}%`,
  className,
}: {
  change: number;
  format?: (change: number) => React.ReactNode;
  className?: string;
}) => (
  <span
    className={classNames("h-center nowrap medium gap-1/2", className, {
      "text-green-dark fill-green-dark": change > 0,
      "text-red fill-red": change < 0,
      "text-gray fill-gray": change === 0,
    })}
  >
    {change !== 0 && (
      <IconTrending
        className={classNames({ "flip-y": change < 0 })}
        style={{ height: "1em", width: "1em", flexShrink: 0 }}
      />
    )}
    {format(change)}
  </span>
);

/**
 * A big headline metric with an optional change badge.
 *
 * The value size is wrapper-relative (em / %), so the surrounding container
 * decides how large it renders.
 */
const StatValue = ({
  value,
  change,
  size = "xl",
  align = "right",
  changePosition = "below",
  format = (number) => number.toLocaleString(),
  changeFormat,
}: StatValueProps) => {
  const inline = changePosition === "inline";
  const rendered = typeof value === "number" ? format(value) : value;

  return (
    <div
      className={classNames(
        "gap-1",
        inline ? "h-center" : "column",
        !inline && (align === "right" ? "h-bottom" : "h-top"),
      )}
    >
      <div className={classNames("medium text-black", SIZE_CLASS[size])}>
        {rendered}
      </div>
      {typeof change === "number" && (
        <ChangeBadge
          change={change}
          format={changeFormat}
          className={inline ? undefined : "text-m"}
        />
      )}
    </div>
  );
};

export default StatValue;
