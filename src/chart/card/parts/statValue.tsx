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
  size?: keyof typeof SIZE_CLASS | "";
  align?: "left" | "right" | "center";
  // change under the value (stacked) or next to it (inline)
  changePosition?: "below" | "inline";
  // change badge on a light, sign-coloured pill background
  changePill?: boolean;
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
 * `pill`: on a light background of the same colour (green / red / grey).
 */
export const ChangeBadge = ({
  change,
  format = (value) => `${roundDecimal(Math.abs(value), 100)}%`,
  className,
  pill = false,
}: {
  change: number;
  format?: (change: number) => React.ReactNode;
  className?: string;
  pill?: boolean;
}) => (
  <span
    className={classNames("h-center nowrap medium gap-1/2", className, {
      "text-green-dark fill-green-dark": change > 0,
      "text-red fill-red": change < 0,
      "text-gray fill-gray": change === 0,
      "rounded-xl px-1 py-1/2": pill,
      "bg-green-light": pill && change > 0,
      "bg-red-light": pill && change < 0,
      "bg-gray-light": pill && change === 0,
    })}
  >
    {change !== 0 && (
      <IconTrending
        className={classNames({ "w-em h-em": true, "flip-y": change < 0 })}
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
  // size = "xl",
  size = "",
  align = "right",
  changePosition = "below",
  changePill = false,
  format = (number) => number.toLocaleString(),
  changeFormat,
}: StatValueProps) => {
  const inline = changePosition === "inline";

  return (
    <div
      className={classNames(
        "gap-1",
        inline ? "h-center" : "column",
        !inline &&
          { right: "h-bottom", left: "h-top", center: "h-center" }[align],
      )}
    >
      <div className={classNames("medium text-black nowrap", SIZE_CLASS[size])}>
        {format(value)}
      </div>
      {typeof change === "number" && (
        <ChangeBadge
          change={change}
          format={changeFormat}
          className={inline ? undefined : "text-m"}
          pill={changePill}
        />
      )}
    </div>
  );
};

export default StatValue;
