
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import reduce from 'lodash/reduce';
import { connect } from 'react-redux';
import classNames from 'classnames';
import isEqual from 'lodash/isEqual';
import ReactList from 'react-list';


/* !- React Actions */

import { setValues, unsetValues } from '../../form/actions';


/* !- Constants */

import { FORM_PREFIX } from '../constants';


/**
* Grid Component
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
*     order:
*     {
*       column: 'name',
*       order: 'desc'
*     }
*   };
* <Grid
*   data={gridData}
*   hook={gridSettings.hook}
*   helper={gridSettings.helper}
* />
*/
class Grid extends Component
{
  constructor(props, context)
  {
    super(props);

    /**
     * Grid props which store in redux Form with this key
     * @type {string}
     */
    this.gridId = props.id || context.grid || '';

    /**
     * Grid props which store in redux Form with this key
     * @type {string}
     */
    this.formId = FORM_PREFIX + this.gridId;

    /**
     * Rows of table is clickable
     * @type {Boolean}
     */
    this.isClickRows =
      props.selectable || props.onClickCell.toString() !== Grid.defaultProps.onClickCell.toString();

    this.state =
    {
      focus: true,
    };
  }

  componentDidMount()
  {
    if (this.context.addListener)
    {
      this.context.addListener('click', this.onClickGridHandler);
      this.addShortcuts();
    }
  }

  componentWillUnmount()
  {
    if (this.context.removeListener)
    {
      this.context.removeListener(this.onClickGridHandler);
      this.context.removeShortcuts('gridCollection');
    }
  }

  /**
   * Handling the grid is on focus
   * If it is focus enable shortcuts
   */
  onClickGridHandler = (event) =>
  {
    const isFocus = document.querySelector('div[data-view="list"] .tbody').contains(event.target);

    if (this.state.focus !== isFocus)
    {
      this.setState({ focus: isFocus });

      if (isFocus)
      {
        this.addShortcuts();
      }
      else
      {
        this.context.removeShortcuts('gridCollection');
      }
    }
  }


  /**
   * Handling KeyDown Arrow Up and down
   * @param  {integer} direction +1 or -1
   * @return {function}           handler
   */
  onKeyArrowHandler = direction => () =>
  {
    const state = this.context.store.getState();
    const grid = state.grid[this.context.grid];

    const activeRecords = state.form[this.formId];

    let nextActiveRecord;

    if (!activeRecords || activeRecords.length === 0)
    {
      nextActiveRecord = grid.data[0];
    }
    else
    {
      const lastRecordIndex =
        grid.data.findIndex(({ id }) => id === activeRecords[activeRecords.length - 1]);

      const nextRecordIndex = lastRecordIndex + direction;

      if (nextRecordIndex < 0 || nextRecordIndex >= grid.data.length)
      {
        return false;
      }

      nextActiveRecord = grid.data[nextRecordIndex];
    }

    this.setActiveRecords(nextActiveRecord);

    return true;
  };

  onKeySelectAllHandler = () =>
  {
    const grid = this.context.store.getState().grid[this.context.grid];

    if (grid)
    {
      this.setActiveRecords(grid.data);
    }
  }

  setActiveRecords = (records) =>
  {
    // document.querySelector('div[data-view="list"] .scroll-y').scrollTop = 1000;

    this.context.store.dispatch(setValues({
      id: this.formId,
      value: Array.isArray(records) ? records.map(({ id }) => id) : [records.id],
    }));
  }

  /**
  * Figure out which columns are displayed and show only those
  * @return {array} array of columns
  * @example
  * // => [id, title, status]
  */
  getColumns = () =>
  {
    if (this.props.hook && Object.keys(this.props.hook).length > 0)
    {
      return reduce(
        this.props.hook,
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

    if (this.props.data.length)
    {
      return Object.keys(this.props.data[0]);
    }

    return [];
  };


  /**
   * Add necessary keyboard shortcuts
   */
  addShortcuts = () =>
  {
    if (this.context.addShortcuts)
    {
      this.context.addShortcuts(
        [
          {
            keyCode: 'ArrowUp',
            handler: this.onKeyArrowHandler(-1),
            description: 'Grid Arrow Up',
          },
          {
            keyCode: 'ArrowDown',
            handler: this.onKeyArrowHandler(+1),
            description: 'Grid Arrow Down',
          },
          {
            keyCode: 'CTRL+A',
            handler: this.onKeySelectAllHandler,
            description: 'Grid Select All',
          },
          {
            keyCode: 'META+A',
            handler: this.onKeySelectAllHandler,
            description: 'Grid Select All',
          },
        ],
        'gridCollection',
      );
    }
  }

  /* !- Elements */

  /**
  * Render the Table Header Order direction indicator
  * @private
  * @return {ReactElement} SVG icon
  */
  renderOrderArrow = () =>
  {
    const direction = this.props.orderDirection;

    if (direction === 'asc')
    {
      return <div className="up" />;
    }

    else if (direction === 'desc')
    {
      return <div className="down" />;
    }

    return null;
  };

  /**
  * Render the title row of table
  * @private
  * @return {ReactElement} TableRow dom node
  */
  renderHeaders = () =>
  {
    const {
      hook,
      orderColumn,
      onChangeOrder,
      headClassName,
      selectable,
      checkboxSelect,
    } = this.props;

    const {
      store,
    } = this.context;

    const nodeTableHeaderColumns = this.getColumns().map((column) =>
    {
      let title = column;
      let columnHook = {};

      if (Object.keys(hook).length > 0)
      {
        columnHook = hook[column] || {};

        if (typeof columnHook.title !== 'undefined')
        {
          title = columnHook.title;

          // if (typeof columnHook.tooltip === 'function')
          // {
          //   title = (
          //     <Cell
          //       badge={
          //         <IconHelp
          //           data-id="category"
          //           color={grey300}
          //           viewBox="0 -16 48 48"
          //           onClick={(event) =>
          //           {
          //             columnHook.tooltip(event.currentTarget.dataset.id);
          //             event.stopPropagation();
          //           }}
          //         />
          //       }
          //       value="Category"
          //     />
          //   );
          // }
        }
        else
        {
          title = columnHook;
        }
      }

      return (
        <div
          key={column}
          onClick={() => onChangeOrder(column)}
          style={{
            width: (typeof columnHook.width !== 'undefined') ?
              columnHook.width : `${Math.floor(100 / Object.keys(hook).length)}%`,
          }}
          className={orderColumn === column ? 'active' : ''}
        >
          <div>{title}</div>
          {orderColumn === column && this.renderOrderArrow()}
        </div>
      );
    });

    // insert checkbox first row
    if (selectable && checkboxSelect)
    {
      // onClick header checkbox
      const onClickHeaderCheckboxHandler = () =>
      {
        const state = store.getState();
        const form = state.form[this.formId] || [];

        if (form.length)
        {
          store.dispatch(unsetValues({ id: this.formId }));
        }
        else
        {
          const data = state.grid[this.gridId] ? state.grid[this.gridId].data : this.props.data;

          store.dispatch(setValues({
            id: this.formId,
            value: data.map(({ id }) => id),
          }));
        }
      };

      const Checkbox = connect(
        ({ grid, form }) =>
        {
          const formLength = form[this.formId] ? form[this.formId].length : 0;
          const gridLength = grid[this.gridId] ? grid[this.gridId].data.length : 0;

          return ({
            status: formLength && Math.floor((formLength + gridLength) / gridLength),
          });
        },
      )(({ status }) => (
        <div
          className={`checkbox ${['empty', 'fragment', 'full'][status]}`}
          onClick={onClickHeaderCheckboxHandler}
        />
      ));


      nodeTableHeaderColumns.unshift(<Checkbox />);
    }

    return (
      <div
        className={headClassName}
      >
        <div>
          { nodeTableHeaderColumns }
        </div>
      </div>
    );
  };


  renderCell = (record, index, column) =>
  {
    const {
      onClickCell,
      data,
      helper,
      hook,
    } = this.props;

    let value = record[column];
    const columnHook = hook[column] || {};

    // format value of field
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
      <div
        key={column}
        onClick={() => onClickCell(record, column)}
        style={{
          textAlign: (typeof columnHook.align !== 'undefined') ?
            columnHook.align : 'center',
          width: (typeof columnHook.width !== 'undefined') ?
            columnHook.width : `${Math.floor(100 / Object.keys(hook).length)}%`,
          cursor: this.isClickRows ? 'pointer' : 'default',
        }}
      >
        {value}
      </div>
    );
  }

  renderRow = (record, index, columns) =>
  {
    const {
      selectable,
      checkboxSelect,
      rowElement,
      onClickCell,
      multipleSelect,
      expandSelect,
    } = this.props;

    const {
      store,
    } = this.context;

    /**
     * All cell of row
     * (all field of record)
     * @type {ReactElement}
     */
    const nodeTableRowColumns = columns.map(column => this.renderCell(record, index, column));


    // insert checkbox first row
    if (selectable && checkboxSelect)
    {
      nodeTableRowColumns.unshift(<div className="checkbox" />);
    }

    /**
     * Handling Grid selectable function
     * @param  {Function} selectable if the grid is selectable
     * @return {Function}            [description]
     */
    const onClickTableRowHandler = (!selectable) ? false : (event) =>
    {
      const form = store.getState().form[this.formId] || [];
      let value = [record.id];

      /**
      * IF multipleSelect = expand or reduce width new value (reduce if it is exist yet)
      * ELSE always contain the selected value
      */
      const isExpandable =
        multipleSelect && (expandSelect || (event.ctrlKey || event.metaKey) || event.shiftKey);

      if (isExpandable)
      {
        const isNewItem = form.indexOf(record.id) === -1;

        if (event.shiftKey)
        {
          const grid = store.getState().grid[this.gridId];
          const data = grid ? grid.rawData : this.props.data;

          if (isNewItem)
          {
            data.some(({ id }) =>
            {
              // this item selected yet
              if (form.indexOf(id) !== -1)
              {
                value = [];
              }
              else
              {
                value.push(id);
              }

              return (record.id === id);
            });

            value = form.concat(value);
          }
          else
          {
            // if the selected item found
            let found = false;

            data.some(({ id }) =>
            {
              // end of iterate, current item selected yet
              if (found && form.indexOf(id) === -1)
              {
                return true;
              }
              // current item selected yet.
              else if (found && form.indexOf(id) !== -1)
              {
                value.push(id);
              }
              // found clicked item
              else if (!found && record.id === id)
              {
                value = [];
                found = true;
              }

              return false;
            });

            value = form.filter(x => value.indexOf(x) === -1);
          }
        }
        else
        {
          value = isNewItem ? form.concat(value) : form.filter(i => i !== record.id);
        }
      }

      if (!isEqual(form, value))
      {
        store.dispatch(setValues({
          id: this.formId,
          value,
        }));
      }
    };

    // if the grid selectable use connected rowElement componet
    return React.createElement(
      selectable ?
        connect(
          ({ form }) =>
          ({
            className: (form[this.formId] || []).indexOf(record.id) !== -1 ? 'active' : '',
          }),
        )(rowElement)
        :
        rowElement,
      {
        key: record.id,
        data: record,
        columns,
        onClickCell,
        onClick: onClickTableRowHandler,
      },
      nodeTableRowColumns,
    );
  }

  /**
  * Render the rows of table
  * @private
  * @return {ReactElement} Table Row dom node
  */
  renderRows = () =>
  {
    const {
      data,
      bodyClassName,
      freezeHeader,
      infinity,
      noResults,
    } = this.props;

    if (Array.isArray(data) && data.length)
    {
      const columns = this.getColumns();
      let nodeTableRows;

      if (infinity)
      {
        nodeTableRows = (
          <ReactList
            length={data.length}
            itemRenderer={index => this.renderRow(data[index], index, columns)}
            type="uniform"
          />
        );
      }
      else
      {
        nodeTableRows = data.map((record, index) => this.renderRow(record, index, columns));
      }

      const bodyClasses = classNames({
        [bodyClassName]: bodyClassName,
        'scroll-y': freezeHeader,
        infinity,
      });

      return (
        <div className={bodyClasses}>{nodeTableRows}</div>
      );
    }

    return (
      <div className="noResults">
        { noResults }
      </div>
    );
  };

  render()
  {
    const {
      className,
      freezeHeader,
      height,
      showHeader,
    } = this.props;

    const gridClassName = classNames({
      [className]: true,
      column: freezeHeader,
      scroll: !!height,
      'not-focus': !this.state.focus,
    });

    return (
      <div
        className={gridClassName}
        style={{ height }}
      >
        { showHeader === true && this.renderHeaders() }
        { this.renderRows() }
      </div>
    );
  }
}


Grid.propTypes =
{
  id: PropTypes.string,
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
      PropTypes.object,
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
  /**
   * Column title indicator, which shows ordered column
   * Order direction will show in this column title
   */
  orderColumn: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
  ]),
  /**
   * Column title indicator, which shows order direction
   */
  orderDirection: PropTypes.oneOf(['asc', 'desc', '']),
  /**
   * This text appear when data props is empty
   */
  noResults: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
  ]),
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
  rowElement: PropTypes.func,
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
  /**
   * Determine visiblity of table's header
   */
  showHeader: PropTypes.bool,
  /**
  * Enable select one item from grid
  */
  selectable: PropTypes.bool,
  /**
   * Enable select more than one item from grid
   */
  multipleSelect: PropTypes.bool,
  /**
   * When select a new record it is automatically expand the selection list
   */
  expandSelect: PropTypes.bool,
  checkboxSelect: PropTypes.bool,
  className: PropTypes.string,
  headClassName: PropTypes.string,
  bodyClassName: PropTypes.string,
  height: PropTypes.string,
  /**
   * Always visible header, you must set height
   */
  freezeHeader: PropTypes.bool,
  /**
   * Enable infinity scroll (ReactList)
   * UITableView Inspired
   * https://github.com/coderiety/react-list
   */
  infinity: PropTypes.bool,
};

/**
 * @type {Object}
 */
Grid.defaultProps =
{
  id: '',
  data: [],
  showHeader: true,
  selectable: false,
  expandSelect: false,
  multipleSelect: true,
  checkboxSelect: false,
  hook: {},
  helper: {},
  orderDirection: '',
  orderColumn: '',
  noResults: 'No Results.',
  rowElement: ({ children, onClick, data, className }) =>
    <div className={className} onClick={onClick}>{children}</div>,
  onClickCell()
  {},
  onChangeOrder()
  {},
  className: 'grid',
  headClassName: 'thead',
  bodyClassName: 'tbody',
  height: '',
  freezeHeader: false,
  infinity: false,
};

Grid.contextTypes =
{
  store: PropTypes.object,
  grid: PropTypes.string,
  addListener: PropTypes.func,
  removeListener: PropTypes.func,
  addShortcuts: PropTypes.func,
  removeShortcuts: PropTypes.func,
};

export default Grid;
