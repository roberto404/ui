import React from "react";
import classNames from "classnames";

import Info from "../../../layer/info";

/* !- Types */

export type CardTitleProps = {
  title: React.ReactNode;
  // description shown in a tooltip of an (i) icon after the title
  hint?: React.ReactNode;
  className?: string;
};

/**
 * Card title with an optional hint: `Title (i)`, the hint in a tooltip.
 */
const CardTitle = ({ title, hint, className }: CardTitleProps) => (
  <div className={classNames("h-center", className)}>
    {title}
    {hint && <Info title={hint} />}
  </div>
);

export default CardTitle;
