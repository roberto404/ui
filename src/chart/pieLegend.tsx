import React from "react";

import { DEFAULT_COLORS } from "./pie";

/* !- Types */

export interface IPieLegendItem {
  label: React.ReactNode;
  // share of the whole, 0–100
  percent: number;
  // same colour as the segment; default: the Pie palette by index
  color?: string;
  // second line, eg. "4,5 M Ft · 9 db"
  caption?: React.ReactNode;
}

export interface PropTypes {
  items: IPieLegendItem[];
  className?: string;
}

/**
 * Legend of a Pie: colour dot, bold "label percent %" and an optional caption line
 */
const PieLegend: React.FC<PropTypes> = ({ items, className = "text-s text-line-xl" }) => (
  <div className={`column gap-1 ${className}`}>
    {items.map(({ label, percent, color, caption }, index) => (
      <div key={index} className="flex gap-1">
        {/* the colour comes from the data */}
        <span
          className="circle w-1 h-1 shrink-0 mt-1/2"
          style={{
            background: color || DEFAULT_COLORS[index % DEFAULT_COLORS.length],
          }}
        />
        <span className="column">
          <span className="text-m bold">
            {label} {Math.round(percent)} %
          </span>
          {caption && <span className="text-gray-dark">{caption}</span>}
        </span>
      </div>
    ))}
  </div>
);

export default PieLegend;
