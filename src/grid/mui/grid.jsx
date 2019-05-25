
import React from 'react';
import PropTypes from 'prop-types';
import reduce from 'lodash/reduce';

/* !- React Elements */

import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

import IconArrowDown from 'material-ui/svg-icons/hardware/keyboard-arrow-down';
import IconArrowUp from 'material-ui/svg-icons/hardware/keyboard-arrow-up';
import IconHelp from 'material-ui/svg-icons/action/help';

import { grey300 } from 'material-ui/styles/colors';

import Cell from './gridCell';

/**
* Grid Stateless Component
*
* @example
* import Grid from '@1studio/ui/grid/grid'
* const gridData = [
*   { id: 1, name: 'Megan J. Cushman', gender: 1, visits: '2017-07-23' },
*   { id: 2, name: 'Taylor R. Fallin', gender: 2, visits: '2017-07-22' },
*   { id: 3, name: 'Jose C. Rosado', gender: 1, visits: '2017-07-20' },
*   { id: 4, name: 'Sammy C. Brandt', gender: 1, visits: '2017-07-10' },
* ];
*
* <Grid data={gridData} />
*
* @example
* const gridData = [
*   { id: 1, name: 'Megan J. Cushman', gender: 1, visits: '2017-07-23' },
*   { id: 2, name: 'Taylor R. Fallin', gender: 2, visits: '2017-07-22' },
*   { id: 3, name: 'Jose C. Rosado', gender: 1, visits: '2017-07-20' },
*   { id: 4, name: 'Sammy C. Brandt', gender: 1, visits: '2017-07-10' },
* ];
* const gridSettings =
*   {
*     hook:
*     {
*       name: 'Name',
*       visits:
*       {
*         title: 'Visits',
*         format: ({ value }) => new Date(value).toLocaleDateString(),
*       },
*       gender:
*       {
*         title: 'Gender',
*         format: ({ value, config }) => config.gender[value],
*       },
*     },
*     helper:
*     {
*       gender: { 1: 'male', 2: 'female' },
*     },
*     defaultOrder:
*     {
*       column: 'name',
*       direction: 'desc'
*     }
*   };
* <Grid
*   data={gridData}
*   hook={gridSettings.hook}
*   helper={gridSettings.helper}
* />
*/
const Grid = ({
  data,
  hook,
  helper,
  orderColumn,
  orderDirection,
  noResultsText,
  rowElement,
  onClickCell,
  onChangeOrder,
}) =>
{
  /* !- Handlers */

  /**
   * @private
   * @param  {SytheticEvent} event
   * @return {void}
   */
  const onClickHeaderHandler = (event) => // event, rowIndex, columnIndex
  {
    const columnId = event.currentTarget.dataset.column;
    onChangeOrder(columnId);
  };

  /**
  * Figure out which columns are displayed and show only those
  * @return {array} columns
  */
  const getColumns = () =>
  {
    if (Object.keys(hook).length > 0)
    {
      return reduce(
        hook,
        (result, value, index) =>
        {
          if (
            typeof value === 'string' ||
            value.status !== 0
          )
          {
            return [...result, index];
          }
          return result;
        },
        [],
      );
    }

    if (data.length)
    {
      return Object.keys(data[0]);
    }

    return [];
  };

  /* !- Elements */

  /**
  * Render the Table Header Order direction indicator
  * @private
  * @return {ReactElement} SVG icon
  */
  const renderOrderArrow = () =>
  {
    const direction = orderDirection;
    const style = { height: '15px' };

    if (direction === 'asc')
    {
      return <IconArrowUp style={style} />;
    }

    else if (direction === 'desc')
    {
      return <IconArrowDown style={style} />;
    }

    return null;
  };

  /**
  * Render the title row of table
  * @private
  * @return {ReactElement} TableRow dom node
  */
  const renderHeaders = () =>
  {
    const nodeTableHeaderColumns = getColumns().map((column) =>
    {
      let title = column;
      let columnHook = {};

      if (Object.keys(hook).length > 0)
      {
        columnHook = hook[column] || {};

        if (typeof columnHook.title !== 'undefined')
        {
          title = columnHook.title;

          if (typeof columnHook.tooltip === 'function')
          {
            title = (
              <Cell
                badge={
                  <IconHelp
                    data-id="category"
                    color={grey300}
                    viewBox="0 -16 48 48"
                    onClick={(event) =>
                    {
                      columnHook.tooltip(event.currentTarget.dataset.id);
                      event.stopPropagation();
                    }}
                  />
                }
                value="Category"
              />
            );
          }
        }
        else
        {
          title = columnHook;
        }
      }

      return (

        <TableHeaderColumn
          key={column}
          data-column={column}
          style={{
            cursor: 'pointer',
            width: (typeof columnHook.width !== 'undefined') ? columnHook.width : 'auto',
          }}
        >

          {title}

          { orderColumn === column && renderOrderArrow() }

        </TableHeaderColumn>
      );
    });

    return (
      <TableRow onCellClick={onClickHeaderHandler}>
        { nodeTableHeaderColumns }
      </TableRow>
    );
  };

  /**
  * Render the rows of table
  * @private
  * @return {ReactElement} Table Row dom node
  */
  const renderRows = () =>
  {
    const columns = getColumns();

    if (Array.isArray(data))
    {
      const RowElement = rowElement;

      const nodeTableRows = data.map((record, index) =>
      {
        if (typeof RowElement === 'function')
        {
          return (
            <RowElement data={record} columns={columns} key={record.id} />
          );
        }

        const nodeTableRowColumns = columns.map((column) =>
        {
          let value = record[column];
          const columnHook = hook[column] || {};

          if (typeof columnHook.format === 'function')
          {
            value = columnHook.format({
              value,
              helper,
              record,
              column,
              columnHook,
              index,
              data,
              last: index === (data.length - 1),
            });
          }

          return (
            <TableRowColumn
              key={column}
              style={{
                cursor: 'pointer',
                width: (typeof columnHook.width !== 'undefined') ? columnHook.width : 'auto',
              }}
            >
              {value}
            </TableRowColumn>
          );
        });

        return (

          <TableRow key={`table-row-${record.id}`} style={{ cursor: 'pointer' }}>
            {nodeTableRowColumns}
          </TableRow>
        );
      });

      if (nodeTableRows.length !== 0)
      {
        return nodeTableRows;
      }
    }

    return (
      <TableRow>
        <TableRowColumn
          style={{ textAlign: 'center', background: 'rgba(255, 235, 59, 0.15)' }}
        >
          { noResultsText }
        </TableRowColumn>
      </TableRow>
    );
  };


  /**
  * @return {ReactElement}
  */
  return (

    <Table
      onCellClick={onClickCell}
      selectable={false}
    >

      <TableHeader
        displaySelectAll={false}
        adjustForCheckbox={false}
      >

        { renderHeaders() }

      </TableHeader>


      <TableBody
        stripedRows
        showRowHover
        displayRowCheckbox={false}
      >

        { renderRows() }

      </TableBody>

    </Table>

  );
};


Grid.propTypes =
{
  /**
   * Content of the Grid
   * @example
   [
     { id: 1, name: 'Megan J. Cushman', gender: 1, visits: '2017-07-23' },
     ...,
   ];
   */
  data: PropTypes.arrayOf(PropTypes.object),
  /**
   * Determine visible column,
   * Change column title and format the columns value
   * @example
   * {
   *  name: 'Name',
   *  visits:
   *  {
   *    title: 'Visits',
   *    format: ({ value }) => new Date(value).toLocaleDateString(),
   *    status: 1,
   *    width: '50%',
   *  }
   * }
   *
   * // ->
   * @type {string}
   * title: change rawData key to custom column title.
   *
   * @type {function}
   * @param {string} column record key
   * tooltip: create help badge to title, onClick call this function
   *
   * @type {function}
   * @param {object} object {
   *  column: current record key
   *  columnHook: current column hook props
   *  helper: table helpers
   *  record: current row = data.record
   *  value: current row and column value = record key value
   *  data: current visible data = paginated data
   *  index: record index within data
   *  }
   * @return {string}
   * format: change the record value
   *
   * @type {number}
   * status: determine the visibility of columns
   *
   * @type {string}
   * width: cell relative width in percent Eg: '50%'
   */
  hook: PropTypes.objectOf(PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
  ])),
  /**
   * Serve data for hook
   *
   * @example
   * {
   *  userId: { 1: 'John', 2: 'Doe', ... },
   * }
   * or
   * {
   *  userId: [
   *    { id: 1, title: 'John' },
   *    { id: 2, title: 'Doe' },
   *  ]
   * }
   */
  helper: PropTypes.objectOf(
    PropTypes.oneOfType([
      PropTypes.objectOf(
        PropTypes.string,
      ),
      PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
          ]),
          title: PropTypes.string,
        }),
      ),
    ]),
  ),
  // helper: PropTypes.oneOfType([
  //   PropTypes.object,
  //   PropTypes.array,
  // ]),
  /**
   * Column title indicator, which shows ordered column
   * Order direction will show in this column title
   */
  orderColumn: PropTypes.string,
  /**
   * Column title indicator, which shows order direction
   */
  orderDirection: PropTypes.oneOf(['asc', 'desc', '']),
  /**
   * This text appear when data props is empty
   */
  noResultsText: PropTypes.string,
  /**
   * Custom grid row componet
   * @example
   * const Row = ({ data, columns }) => (
   *  <tr>
   *   {columns.map(column => <td key={column}>{data[column]}</td>)}
   *  </tr>
   * );
   *
   * Row.propTypes =
   * {
   *  data: PropTypes.objectOf(PropTypes.oneOfType([
   *    PropTypes.string,
   *    PropTypes.number,
   *  ])).isRequired,
   *  columns: PropTypes.arrayOf(PropTypes.string),
   * };
   *
   * Row.defaultProps =
   * {
   *  columns: [],
   * };
   *
   * <Grid
   * rowElement={Row}
   * />
   */
  rowElement: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.bool,
  ]),
  /**
   * OnClickCell handler
   * @param {int} rowIndex number of row
   * @param {int} colIndex number of cell
   * @example
   <Grid
     onClickCell={(rowIndex, colIndex) => console.log(rowIndex, colIndex)}
     />
   */
  onClickCell: PropTypes.func,
  /**
   * OnChangeOrder handler
   * @param {string} columnId
   * @example
   <Grid
     onChangeOrder={columnId => console.log(columnId)}
     />
   */
  onChangeOrder: PropTypes.func,
};

/**
 * @type {Object}
 */
Grid.defaultProps =
{
  data: [],
  hook: {},
  helper: {},
  orderDirection: '',
  orderColumn: '',
  noResultsText: 'No Results.',
  rowElement: false,
  onClickCell()
  {},
  onChangeOrder()
  {},
};

export default Grid;
