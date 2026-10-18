import React from "react";

/* !- Types */

export type NumberedTitleProps = {
  // section number, printed with two digits: 02
  index: number;
  // string / number gets the default bold styling; a node is drawn as-is
  title: React.ReactNode;
};

/**
 * Numbered card title: "02 Konverzió" — a muted number before a bold title
 */
const NumberedTitle = ({ index, title }: NumberedTitleProps) => (
  <span className="flex h-center gap-1 mb-1">
    <span className="text-gray light">
      {String(index).padStart(2, "0")}
    </span>
    {typeof title === "string" || typeof title === "number" ? (
      <span className="text-m bold text-black">{title}</span>
    ) : (
      title
    )}
  </span>
);

export default NumberedTitle;
