import React from "react";

const SCROLL_BAR_WIDTH = 60;

const ScrollBar = ({ scroll }) => {

  const {
    canvas,
    percent,
  } = scroll;

  const left = (canvas - SCROLL_BAR_WIDTH) * percent;


  return (
    <div className="w-full rounded h-1/2 bg-gray-light my-2">
      <div className="h-full rounded bg-gray" style={{ marginLeft: left, width: SCROLL_BAR_WIDTH }} />
    </div>
  )
}

export default ScrollBar;