import React from "react";
import classNames from "classnames";

import IconTrending from "../../../icon/mui/trending_up";

/* !- Types */

export type TrendIconProps = {
  // signed change; the sign picks the colour and the arrow direction
  change: number;
  className?: string;
};

/**
 * Trend arrow in a double circle: a light halo + a solid circle with a white arrow.
 * Green up / red down (flipped arrow) / grey flat.
 */
const TrendIcon = ({ change, className }: TrendIconProps) => (
  <span
    className={classNames("circle p-1 inline-block", className, {
      "bg-green-light": change > 0,
      "bg-red-light": change < 0,
      "bg-gray-light": change === 0,
    })}
  >
    <span
      className={classNames(
        "circle fill-white w-4 h-4 flex h-center v-center",
        {
          "bg-green-dark": change > 0,
          "bg-red": change < 0,
          "bg-gray": change === 0,
        },
      )}
    >
      <IconTrending
        className={classNames("w-2 h-2", { "flip-y": change < 0 })}
      />
    </span>
  </span>
);

export default TrendIcon;
