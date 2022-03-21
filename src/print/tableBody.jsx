import React from 'react';
import PropTypes from 'prop-types';


/* !- Constants */

// landscape format
import { WIDTH as HEIGHT, HEIGHT as WIDTH, MARGIN } from './const';




const TableBody = (props) =>
{
  const {
    data,
    paddingTop,
    paddingLeft,
    paddingRight,
    rowHeight,
    titleColWidth,
    textProps,
    onClick,
  } = props;

  /**
   * Split col is value is array
   */
  const getValueCol = (value, props) =>
  {
    const { x, y, width, textProps } = props;

    if (Array.isArray(value))
    {
      const dx = Math.floor(width / value.length);

      return value.map((v, i) => 
        getValueCol(v, { ...props, x: x + (dx * i), width: dx })
      );
    }

    if (typeof value === 'function')
    {
      return React.createElement(value, props);
    }

    return <text y={y} x={x + width / 2} textAnchor="middle" {...textProps}>{value}</text>
  }

  const width = props.width || (WIDTH - paddingLeft - paddingRight);

  const fontSize = 16;
  const titleColPadding = (rowHeight - fontSize) / 2;

  /**
   * Children add extra y shift
   */
  let dy = 0;
  let y = 0;
  let yBottom = 0;

  const rows = 
    data.map((row, i) =>
    {
      y = i * rowHeight + dy;
      yBottom = rowHeight;

      let children = row.children;

      /**
       * If row contains children {1,2,3... children:{}} => slice only data
       */
      if (row.children)
      {
        row = Object.keys(row).filter(key => !isNaN(key)).map(key => row[key]);
      }

      /**
       * childen is same data like parent => create table element
       */
      if (children)
      {
        if (!React.isValidElement(children))
        {
          children = React.createElement(
            typeof children === 'function' ? children : TableBody,
            {
              data: children,
              paddingLeft: 0,
              width,
              rowHeight: rowHeight * 0.8,
              textProps: {
                fill: 'gray',
              },
            }
          )
        }

        const childrenHeight = parseInt(children.props.height || (children.props.rowHeight || 0) * children.props.data.length);

        yBottom += childrenHeight;
        dy += childrenHeight;
      }
      else
      {
        children = (
          <g className="hover:fill-blue-light" onClick={onClick(row)}>
            <polygon points={`0,0 ${width},0 ${width},${-rowHeight} 0,${-rowHeight}`} fill={i%2 ? 'rgba(0,0,0,0)' : 'rgba(249,249,249,1)'} />;
          </g>
        );
      }

      return (
        <g key={i} transform={`translate(0, ${y})`}>

          { children &&
          <g transform={`translate(0, ${rowHeight})`}>
            { children }
          </g>
          }

          <g
            className="no-events"
            // x={10}
            // y={titleColPadding + fontSize}
            // style={{ fontSize }}
            // {...textProps} 
          >
            <text x={10} y={titleColPadding + fontSize} {...textProps}>{row[0]}</text>
            {
              getValueCol(
                row.slice(1),
                {
                  x: titleColWidth,
                  width: width - titleColWidth,
                  y: titleColPadding + fontSize,
                  textProps,
                },
              )}
          </g>
        </g>
      );
    })
  
  return (
    <g height={y + yBottom} transform={`translate(${paddingLeft}, ${paddingTop})`}>
      {rows}
    </g>
  );
}

TableBody.defaultProps =
{
  paddingTop: 0,
  paddingRight: MARGIN,
  paddingLeft: MARGIN,
  rowHeight: 40,
  titleColWidth: Math.floor(WIDTH * 0.33),
  textProps: {
    fontWeight: 'bold',
    fontSize: '120%',
  },
  onClick: () => {},
};

export default TableBody;