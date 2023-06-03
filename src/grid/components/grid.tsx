import React, { useState, useEffect, useMemo, useRef, useContext } from 'react';
import { useSelector, useDispatch, ReactReduxContext } from 'react-redux';
import { useAppContext } from '../../context';

import PropTypes, { element } from 'prop-types';
import reduce from 'lodash/reduce';
import { connect } from 'react-redux';
import classNames from 'classnames';
import isEqual from 'lodash/isEqual';
import sum from 'lodash/sum';
import ReactList from 'react-list';
import findLastIndex from 'lodash/findLastIndex';


/* !- React Actions */

import { setValues, unsetValues } from '../../form/actions';


/* !- Constants */

import { FORM_PREFIX, SHORTCUTS_NAME } from '../constants';


/* !- React Elements */

import Sortable from '../../dragAndDrop/sortable';


/* !- Types */

type HookFormatType = {
  value: string | number,
  record: {},
  helper: {},
}

type HookType =
{
  title: string,
  format?: (a: HookFormatType) => JSX.Element | string,
  sort?: (a: {}, b: {}) => boolean,
  status?: number,
  width?: string,
}

const defaultProps =
{
  id: '',
  showHeader: true,
  selectable: false,
  expandSelect: false,
  multipleSelect: true,
  checkboxSelect: false,
  sortable: false,
  hook: {},
  helper: {},
  orderDirection: '',
  orderColumn: '',
  noResults: <div className='v-center py-1/2 text-gray'>No Results.</div>,
  rowElement: ({ children, onClick, data, className }) =>
    <div className={className} onClick={onClick}>{children}</div>,
  onClickCell()
  {},
  onDoubleClickCell()
  {},
  onContextClickCell()
  {},
  onChangeOrder()
  {},
  className: 'grid column',
  headClassName: 'thead',
  bodyClassName: 'tbody',
  style: {},
  height: '',
  freezeHeader: false,
  infinity: false,
};

type PropTypes = Partial<typeof defaultProps> & 
{
  id: string,
  /**
   * Content of the Grid
   * @example
   [
     { id: 1, name: 'Megan J. Cushman', gender: 1, visits: '2017-07-23' },
     ...,
   ];
   */
  data: { [index: string]: number | string }[],
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
  hook: { [index: string]: string | HookType }
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
  helper: {},
  /**
   * Column title indicator, which shows ordered column
   * Order direction will show in this column title
   */
  orderColumn: string | void,
  /**
   * Column title indicator, which shows order direction
   */
  orderDirection: 'asc' | 'desc' | '',
  /**
   * This text appear when data props is empty
   */
  noResults: string | JSX.Element,
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
  rowElement: React.FC<{ data?: [], columns?: [], onClickCell?: [], onClick?: [], dispatch?: void }>,
  /**
   * OnClickCell handler
   * @param {int} rowIndex number of row
   * @param {int} colIndex number of cell
   * @example
   <Grid
     onClickCell={(rowIndex, colIndex) => console.log(rowIndex, colIndex)}
     />
   */
  onClickCell: (record: {}, index: number) => void,
  /**
   * OnChangeOrder handler
   * @param {string} columnId
   * @example
   <Grid
     onChangeOrder={columnId => console.log(columnId)}
     />
   */
  onChangeOrder: (columnId: string) => void,
  /**
   * Determine visiblity of table's header
   */
  showHeader: boolean,
  /**
  * Enable select one item from grid
  */
  selectable: boolean,
  /**
   * Enable select more than one item from grid
   */
  multipleSelect: boolean,
  /**
   * When select a new record it is automatically expand the selection list
   */
  expandSelect: boolean,
  checkboxSelect: boolean,
  sortable: boolean,
  className: string,
  headClassName: string,
  bodyClassName: string,
  /**
   * Classic style
   */
  style: {},
  height: string,
  /**
   * Always visible header, you must set height
   */
  freezeHeader: boolean,
  /**
   * Enable infinity scroll (ReactList)
   * UITableView Inspired
   * https://github.com/coderiety/react-list
   */
  infinity: boolean,
};


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
export const Grid = ({
  id,
  data,
  showHeader,
  selectable,
  expandSelect,
  multipleSelect,
  checkboxSelect,
  sortable,
  onSort,
  hook,
  helper,
  orderDirection,
  orderColumn,
  noResults,
  rowElement,
  onClickCell,
  onDoubleClickCell,
  onContextClickCell,
  onChangeOrder,
  className,
  headClassName,
  bodyClassName,
  style,
  height,
  freezeHeader,
  infinity,
}: PropTypes) =>
{
  const {
    addShortcuts,
    removeShortcuts,
    addListener,
    removeListener,
  } = useAppContext();
  
  const { store } = useContext(ReactReduxContext);

  const dispatch = useDispatch();

  const element = useRef(null);
  const elementBody = useRef(null);
  const prevSelectedItemId = useRef(null);

  const [focus, setFocus] = useState(true);

  useEffect(
    () =>
    {
      if (focus)
      {
        addShortcutsListeners();
      }
      else
      {
        removeShortcuts(SHORTCUTS_NAME);
      }
    },
    [focus],
  );
  

  /**
   * Grid props which store in redux Form with this key
   * @type {string}
   */
  let gridId = id;

  /**
   * Grid props which store in redux Form with this key
   * @type {string}
   */
  let formId = FORM_PREFIX + gridId;

  /**
   * Rows of table is clickable
   * @type {Boolean}
   */
  let isClickRows = false;


  // componentWillMount => constructor
  useMemo(
    () =>
    { 
      //@todo context
      //gridId = id || context.grid || '';

      isClickRows =
        selectable || onClickCell.toString() !== defaultProps.onClickCell.toString();
    },
    [],
  );

  // componentDidMount, componentWillUnmount
  useEffect(
    () =>
    {
      // componentDidMount
      if (addListener)
      {
        addListener('click', onFocusListener);
      }

      // componentWillUnmount
      return () =>
      {
        if (removeListener)
        {
          removeListener(onFocusListener);
          removeShortcuts(SHORTCUTS_NAME);
        }
      };
    },
    [],
  );

  useSelector(
    (state) =>
    {
      const gridSelectedItemIds = state.form[formId];

      if (gridSelectedItemIds && elementBody.current)
      {
        const nextSelectedItemId = gridSelectedItemIds[gridSelectedItemIds.length - 1];
  
        if (prevSelectedItemId.current !== nextSelectedItemId)
        {
          prevSelectedItemId.current = nextSelectedItemId;
  
          const nextSelectedItemIndex = getData()
            .findIndex(({ id }) => id === nextSelectedItemId);
  
          const itemHeight = infinity ?
            elementBody.current.children[0].children[0].children[0].children[0].offsetHeight :
            elementBody.current.children[0].offsetHeight;
  
          const bodyHeight = element.current.offsetHeight;
  
          const itemScrollTop = itemHeight * nextSelectedItemIndex;
  
          if (nextSelectedItemIndex === -1)
          {
            element.current.scrollTop = 0;
          }
          else if
          (
            // out bottom
            (element.current.scrollTop + bodyHeight < itemScrollTop + itemHeight)
            // out top
            || (element.current.scrollTop > itemScrollTop)
          )
          {
            element.current.scrollTop = itemScrollTop - (bodyHeight / 2) + (itemHeight / 2);
          }
        }
      }
      // return false;
    }
  );


  /**
   * Handling the grid is on focus
   */
  const onFocusListener = (event, focus) =>
  {
    if (!elementBody.current)
    {
      return;
    }

    const isFocus = elementBody.current.contains(event.target);

    setFocus(isFocus);
  }


  /**
   * Handling KeyDown Arrow Up and down
   * @param  {integer} direction +1 or -1
   * @return {function}           handler
   */
  const onKeyArrowHandler = direction => event =>
  {
    event.preventDefault();
    const state = store.getState();
    const gridData = getData();

    const activeRecords = state.form[formId];

    let nextActiveRecord;

    if (!activeRecords || activeRecords.length === 0)
    {
      nextActiveRecord = gridData[0];
    }
    else
    {
      const lastRecordIndex =
        gridData.findIndex(({ id }) => id === activeRecords[activeRecords.length - 1]);

      const nextRecordIndex = lastRecordIndex + direction;

      if (nextRecordIndex < 0 || nextRecordIndex >= gridData.length)
      {
        return false;
      }

      nextActiveRecord = gridData[nextRecordIndex];
    }

    setActiveRecords(nextActiveRecord);

    return true;
  };

  const onKeySelectAllHandler = (event) =>
  {
    event.preventDefault();
    event.stopPropagation();

    const gridData = getData();

    if (gridData)
    {
      setActiveRecords(gridData);
    }
  }

  const setActiveRecords = (records) =>
  {
    const recordsArray = Array.isArray(records) ? records : [records];

    dispatch(setValues({
      id: formId,
      value: recordsArray.map(({ id }) => id),
    }));
  }

  const getData = () =>
  {
    return store.getState().grid?.[gridId]?.data || data;
  }

  /**
  * Figure out which columns are displayed and show only those
  * @return {array} array of columns
  * @example
  * // => [id, title, status]
  */
  const getColumns = () =>
  {
    if (hook && Object.keys(hook).length > 0)
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


  /**
   * Add necessary keyboard shortcuts
   */
  const addShortcutsListeners = () =>
  {
    if (addShortcuts)
    {
      addShortcuts(
        [
          {
            keyCode: 'ArrowUp',
            handler: onKeyArrowHandler(-1),
            description: 'Grid Arrow Up',
          },
          // {
          //   keyCode: 'ArrowLeft',
          //   handler: onKeyArrowHandler(-1),
          //   description: 'Grid Arrow Left',
          // },
          {
            keyCode: 'ArrowDown',
            handler: onKeyArrowHandler(+1),
            description: 'Grid Arrow Down',
          },
          // {
          //   keyCode: 'ArrowRight',
          //   handler: onKeyArrowHandler(+1),
          //   description: 'Grid Arrow Right',
          // },
          {
            keyCode: 'CTRL+A',
            handler: onKeySelectAllHandler,
            description: 'Grid Select All',
          },
          {
            keyCode: 'META+A',
            handler: onKeySelectAllHandler,
            description: 'Grid Select All',
          },
        ],
        SHORTCUTS_NAME,
      );
    }
  }

  /* !- Elements */

  /**
  * Render the Table Header Order direction indicator
  * @private
  * @return {ReactElement} SVG icon
  */
  const renderOrderArrow = () =>
  {
    const direction = orderDirection;

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


  const getColumnsWidthByHook = (hook) =>
    Object.keys(hook)
      .map(id => parseInt((hook[id].width || '').replace('%', '')) || 0)
      .filter(width => width > 0);

  const getRestColumnWidthByHook = (hook) =>
  {
    const colWidths = getColumnsWidthByHook(hook);
    return Math.floor((100 - sum(colWidths)) / (Object.keys(hook).length - colWidths.length))
  }

  /**
  * Render the title row of table
  * @private
  * @return {ReactElement} TableRow dom node
  */
  const renderHeaders = () =>
  {
    const getRestColumnWidth = getRestColumnWidthByHook(hook);

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
              columnHook.width : `${getRestColumnWidth}%`,
          }}
          className={orderColumn === column ? 'active' : ''}
        >
          <div>{title}</div>
          {orderColumn === column && renderOrderArrow()}
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
        const form = state.form[formId] || [];

        if (form.length)
        {
          dispatch(unsetValues({ id: formId }));
        }
        else
        {
          const gridData = getData();

          dispatch(setValues({
            id: formId,
            value: gridData.map(({ id }) => id),
          }));
        }
      };

      const Checkbox = connect(
        ({ grid, form }) =>
        {
          const formLength = form[formId] ? form[formId].length : 0;
          const gridLength = grid[gridId] ? grid[gridId].data.length : 0;

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


      nodeTableHeaderColumns.unshift(<Checkbox key="checkbox" />);
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

  const renderCell = (record, index, column) =>
  {
    let value = record[column];
    const columnHook = hook[column] || {};

    const getRestColumnWidth = getRestColumnWidthByHook(hook);

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
        onClick={event => onClickCell(record, column, event)}
        onDoubleClick={event => onDoubleClickCell(record, column, event)}
        onContextMenu={event => onContextClickCell(record, column, event)}
        style={{
          textAlign: (typeof columnHook.align !== 'undefined') ?
            columnHook.align : 'center',
          width: (typeof columnHook.width !== 'undefined') ?
            columnHook.width : `${getRestColumnWidth}%`,
          cursor: isClickRows ? 'pointer' : 'default',
        }}
      >
        {value}
      </div>
    );
  }

  const renderRow = (record, index, columns) =>
  {
    /**
     * All cell of row
     * (all field of record)
     * @type {ReactElement}
     */
    const nodeTableRowColumns = columns.map(column => renderCell(record, index, column));


    // insert checkbox first row
    if (selectable && checkboxSelect)
    {
      nodeTableRowColumns.unshift(<div className="checkbox" key="checkbox" />);
    }

    /**
     * Handling Grid selectable function
     * @param  {Function} selectable if the grid is selectable
     * @return {Function}            [description]
     */
    const onClickTableRowHandler = (!selectable) ? undefined : (event) =>
    {
      const prevSelection = store.getState().form[formId] || [];

      let nextSelection = [record.id];

      /**
      * IF multipleSelect = expand or reduce width new value (reduce if it is exist yet)
      * ELSE always contain the selected value
      */
      const isExpandable =
        multipleSelect && (expandSelect || (event.ctrlKey || event.metaKey) || event.shiftKey);

      if (isExpandable)
      {
        const isNewItem = prevSelection.indexOf(record.id) === -1;

        if (event.shiftKey)
        {
          const grid = store.getState().grid[gridId];
          const gridData = grid ? grid.data : data;
          const index = gridData.findIndex(({ id }) => id === record.id);

          const min = Math.min(
            gridData.findIndex(({ id }) => prevSelection.indexOf(id) !== -1),
            index,
          );

          const max = isNewItem ?
          Math.max(
            findLastIndex(gridData, ({ id }) => prevSelection.indexOf(id) !== -1),
            index,
          )
          : index;

          nextSelection = gridData.slice(min, max + 1).map(({ id }) => id)



          // if (isNewItem)
          // {
          //   data.some(({ id }) =>
          //   {
          //     // this item selected yet
          //     if (prevSelection.indexOf(id) !== -1)
          //     {
          //       nextSelection = [];
          //     }
          //     else
          //     {
          //       nextSelection.push(id);
          //     }
          //
          //     return (record.id === id);
          //   });
          //
          //   nextSelection = prevSelection.concat(nextSelection);
          // }
          // else
          // {
          //   // if the selected item found
          //   let found = false;
          //
          //   data.some(({ id }) =>
          //   {
          //     // end of iterate, current item selected yet
          //     if (found && prevSelection.indexOf(id) === -1)
          //     {
          //       return true;
          //     }
          //     // current item selected yet.
          //     else if (found && prevSelection.indexOf(id) !== -1)
          //     {
          //       nextSelection.push(id);
          //     }
          //     // found clicked item
          //     else if (!found && record.id === id)
          //     {
          //       nextSelection = [];
          //       found = true;
          //     }
          //
          //     return false;
          //   });
          //
          //   nextSelection = prevSelection.filter(x => nextSelection.indexOf(x) === -1);
          // }
        }
        else
        {
          nextSelection = isNewItem ? prevSelection.concat(nextSelection) : prevSelection.filter(i => i !== record.id);
        }
      }

      if (!isEqual(prevSelection, nextSelection))
      {
        dispatch(setValues({
          id: formId,
          value: nextSelection,
        }));
      }
    };

    // if the grid selectable use connected rowElement componet
    return React.createElement(
      selectable ?
        connect(
          ({ form }) =>
          {
            const isActive = (form[formId] || []).indexOf(record.id) !== -1;

            return {
              className: isActive ? 'active' : '',
            };
          },
        )(rowElement)
        :
        rowElement,
      {
        key: record.id,
        data: record,
        columns,
        onClickCell,
        onClick: onClickTableRowHandler,
        dispatch: dispatch,
      },
      nodeTableRowColumns,
    );
  }

  /**
  * Render the rows of table
  * @private
  * @return {ReactElement} Table Row dom node
  */
  const renderRows = () =>
  {
    if (Array.isArray(data) && data.length)
    {
      const columns = getColumns();
      let nodeTableRows;

      if (infinity)
      {
        nodeTableRows = (
          <ReactList
            length={data.length}
            itemRenderer={index => renderRow(data[index], index, columns)}
            type="uniform"
          />
        );
      }
      else
      {
        nodeTableRows = data.map((record, index) => renderRow(record, index, columns));
      }

      const bodyClasses = classNames({
        [bodyClassName]: bodyClassName,
        'scroll-y': freezeHeader,
        infinity,
      });

      return React.createElement(
        sortable ? Sortable : 'div',
        {
          className: bodyClasses,
          ref: elementBody,
          onChange: onSort,
        },
        nodeTableRows,
      );
    }

    return (
      <div>{ noResults }</div>
    );
  };


  const gridClassName = classNames({
    [className]: true,
    column: freezeHeader,
    scroll: !!height,
    'not-focus': !focus,
  });

  return (
    <div
      className={gridClassName}
      style={{ height, ...style }}
      ref={element}
    >
      { showHeader === true && renderHeaders() }
      { renderRows() }
    </div>
  );
}


Grid.defaultProps = defaultProps;

export default Grid;
