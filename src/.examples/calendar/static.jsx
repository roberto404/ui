import React from 'react';


/* !- React Elements */

import CalendarMonth from '../../calendar/month';
import CalendarDay from '../../calendar/day';

/* !- Constants */

const fixWidth = {
  width: '200px',
};

/**
 * Calendar Example
 */
const Example = () =>
(
  <div className="p-2">
    <h1>Static Calendar Components</h1>
    <h2>Month</h2>
    <div style={fixWidth}>
      <CalendarMonth />
    </div>
    <h2>Month props</h2>
    <div style={fixWidth}>
      <CalendarMonth
        year="2019"
        month="5"
        width="350"
        onClick={({ date, className }) => console.log(new Date(date), className)}
        disableTitle={false}
        className={{
          active: [5, 6, 7],
          inactive: [2, 3, 4],
          custom: [24],
        }}
      />
    </div>
    <h2>Month Custom content</h2>
    <div style={fixWidth}>
      <CalendarMonth
        UI={({ rectangle, text, className, x, y, colWidth, rowHeight, isThisMonth, day }) => (
          <g className={className}>
            {rectangle}
            <circle
              cx={x + (colWidth / 2)}
              cy={y + (colWidth / 2)}
              r={colWidth / 2}
              fill="#d6d6d6"
            />
            {text}
            { isThisMonth && day > 18 && day < 24 &&
            <circle
              cx={x + colWidth - (colWidth / 5)}
              cy={y + rowHeight - (colWidth / 5)}
              r={colWidth / 10}
              fill="#2196f3"
            />
            }
          </g>
        )}
      />
    </div>
    <h2>Week</h2>
    <div>
      <CalendarDay
        id="example"
        height={800}
        start="2019-05-06"
        end="2019-05-12"
      />
    </div>
    <h2>Day</h2>
    <div>
      <CalendarDay
        id="example"
        width={400}
        height={800}
        start="2019-05-01"
        end="2019-05-01"
      />
    </div>
  </div>
);

export default Example;
