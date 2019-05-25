
import React from 'react';
import PropTypes from 'prop-types';
import map from 'lodash/map';

/* !- React Elements */

import Label from './xaxisLabel';


/**
 * x-Axis component
 */
const xAxis = (
props,
{
  rowHeight,
  rows,
  data,
  calendarCoord,
  onClickXaxis,
},
) =>
{
  let i = -1;
  let labels = [];

  if (rows)
  {
    labels = map(rows, (item, i) => (
      <Label {...{
        ...item,
        coord:
        {
          top: calendarCoord.y + (rowHeight * i),
          left: 0,
          bottom: calendarCoord.y + (rowHeight * (i + 1)),
          right: calendarCoord.x,
        },
        key: i,
        onClick: onClickXaxis,
      }}
      />
    ))
  }
  else
  {
    labels = map(data, (item, title) =>
    {
      i++;
      return (
        <Label {...{
          title,
          coord:
          {
            top: calendarCoord.y + (rowHeight * i),
            left: 0,
            bottom: calendarCoord.y + (rowHeight * (i + 1)),
            right: calendarCoord.x,
          },
          key: i,
        }}
        />
      );
    });
  }



  return (
    <g id="xaxis">
      { labels }
    </g>
  );
};

/**
 * propTypes
 * @type {Object}
 */
xAxis.propTypes =
{
  // style: PropTypes.shape({
  //   fill: PropTypes.string,
  //   fontSize: PropTypes.number,
  //   fontFamily: PropTypes.string,
  // }),
};

/**
 * defaultProps
 * @type {Object}
 */
xAxis.defaultProps =
{
  // style: {},
};

xAxis.contextTypes =
{
  calendarCoord: PropTypes.shape({ x: PropTypes.number, y: PropTypes.number }).isRequired,
  data: PropTypes.object.isRequired,
  rows: PropTypes.array,
  rowHeight: PropTypes.number.isRequired,
  onClickXaxis: PropTypes.func,
};


export default xAxis;
