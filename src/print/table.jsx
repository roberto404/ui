import React from 'react';
import PropTypes from 'prop-types';


/* !- React Elements */

import TableBody from './tableBody';


/* !- Constants */

import { WIDTH as HEIGHT, HEIGHT as WIDTH } from './const';



/**
 * @param {array} data
 * [['title #1', '1', '2', '3'], [col1, col2, col3, col4]...]
 */
const TemplateTable = ({
  body,
  head,
  width,
  height,
  onClick,
  onClickCell,
  className,
  firstColWidth,
  firstRowHeight,
  headerHeight,
  rowHeight,
}) =>
{
  const defaultHeight = TemplateTable.defaultProps.height;
  const defaultWidth = TemplateTable.defaultProps.width;

  const widthSVG = height !== defaultHeight && width === defaultWidth ?
    Math.round(height * (defaultHeight / defaultWidth)) : width;

  const heightSVG = height === defaultHeight && width !== defaultWidth ?
    Math.round(width * (defaultHeight / defaultWidth)) : height;

  return (
    <svg
      id="report"
      width={widthSVG}
      height={heightSVG*2}
      viewBox={`0 0 ${WIDTH} ${HEIGHT*2}`}
      className={className}
      preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" onClick={onClick}
    >

      {/* Heading */}

      { head &&
      <TableBody
        data={head}
        paddingTop={10}
      />
      }

      { /* Rows */}

      <TableBody
        data={body}
        paddingTop={headerHeight}
        onClick={onClickCell}
        rowHeight={rowHeight}
      />

    </svg>
  );
}

TemplateTable.propTypes =
{
  body: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.string, title: PropTypes.oneOfType([ PropTypes.number, PropTypes.object])})),
  head: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.string, title: PropTypes.oneOfType([ PropTypes.number, PropTypes.object])})),
  width: PropTypes.number,
  height: PropTypes.number,
  padding: PropTypes.number,
  onClick: PropTypes.func,
  className: PropTypes.string,
  firstColWidth: PropTypes.number,
  firstRowHeight: PropTypes.number, // level 1
  headerHeight: PropTypes.number,
};

TemplateTable.defaultProps = 
{
  body: [
    ['Title of row #1', '1.1', '1.2', '1.3'],
    ['Title of row #2', '2.1', '2.2', '2.2'],
    ['Title of row #3', '3.1', '3.2', '3.2'],
  ],
  width: WIDTH / 2,
  height: HEIGHT / 2,
  onClick: () => {},
  onClickCell: () => {},
  className: 'block no-select m-auto',
  firstColWidth: Math.floor(WIDTH * 0.33),
  firstRowHeight: 80,
  headerHeight: 100,
};

export default TemplateTable;