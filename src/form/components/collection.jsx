import React from 'react';
import PropTypes from 'prop-types';
import { arrayMoveImmutable } from '@1studio/utils/array/move';
import { bindFormContexts } from '../context';



/* !- React Elements */

import Field from '../../form/formField';
import IconAdd from '../../icon/mui/content/add_circle_outline';
import IconRemove from '../../icon/mui/content/remove_circle_outline';
import Sortable from '../../dragAndDrop/dnd-sortable';


const CollectionItem = ({
  record,
  onChange,
}) =>
{
  const columns = Object.keys(record);

  return (
    <div className="grid-2 mb-2">
      {
        columns.map(column => (
          <div
            key={column}
            style={{ width: `${100 / columns.length}%` }}
          >
            {record[column]}
          </div>
        ))
      }
    </div>
  );
};


/**
* Extended Field component.
*
* @extends Field
* @example
*
* <Collection
*   id="city"
*   label="City"
*   data={[{ foo, bar }, ...]}
* />
*/
class Collection extends Field
{
  onChangeItemListener = (record, index, options) =>
  {
    const { dataType } = options;
    const isArray = dataType === 'array' || !dataType && Array.isArray(this.state.value) && typeof this.state.value[0] === 'string'

    // simple Array
    if (isArray)
    {
      const value = [...this.state.value];
      value[index] = record.value;

      this.onChangeHandler(value, null, options);
    }
    // nested collection empty array
    else if (Array.isArray(record) && !record.length)
    {
      this.onChangeHandler(this.state.value.filter((v, i) => i !== index), null, options);
    }
    else
    {
      this.onChangeHandler(this.state.value.map((v, i) => i === index ? record : v), null, options);
    }
  }

  onClickRemoveHandler = (event, index) =>
  {
    event.preventDefault();
    event.stopPropagation();

    this.onChangeHandler(this.state.value.filter((v, i) => i !== index));
  }

  onClickAddHandler = (event) =>
  {
    event.preventDefault();

    let item;

    const def = this.props.value || this.state.value;

    if (Array.isArray(def) && typeof def[0] === 'string')
    {
      item = '';
    }
    // nested collection add new array
    else if (Array.isArray(def[0]))
    {
      item = def[0];
    }
    else
    {
      item = {};

      const keys = this.state.value.length ? this.state.value[0] : def[0];

      Object.keys(keys).forEach((key) =>
      {
        if (key === 'id')
        {
          item.id = this.state.value.length + 1;
        }
        else
        {
          item[key] = (def.length && typeof def[0][key] !== 'undefined') ?
            def[0][key] : keys[key];
        }
      });
    }

    this.onChangeHandler([...this.state.value, item]);
  }

  onDragEndHandler = ({ newIndex, oldIndex, event, delta }) =>
  {
    if (oldIndex !== newIndex) {
      this.onChangeHandler(arrayMoveImmutable(this.state.value, oldIndex, newIndex));
    }
  }

  renderElement = (record, index) =>
  {
    const UI = this.props.UI;

    return (
      <div className="v-center" key={record.id || index}>
        <UI
          {...this.props.uiProps}
          record={record}
          stateFormat={(value) => value[index] || ''}
          index={index}
          id={this.props.id}
          onChange={
            (record, options = {}) =>
              this.onChangeItemListener(
                record,
                index,
                { ...options, dataType: (this.props.uiProps || {}).dataType, index }
            )}
        />
        <div className="button action" onMouseDown={e => {
          e.stopPropagation();
          this.onClickRemoveHandler(e, index);
        }}><IconRemove className="no-events" /></div>
      </div>
    );
  }

  /**
   * This method is called when render the Component instance.
   * @override
   * @return {ReactElement}
   */
  render()
  {
    return super.render() || (
      <div className={this.getClasses('collection')}>

        { this.label }

        { Array.isArray(this.state.value) && this.props.draggable && this.state.value.length > 1 &&
          <Sortable
            value={this.state.value}
            elements={this.state.value.map((record, index) => this.renderElement(record, index))}
            onDragEnd={this.onDragEndHandler}
          />
        }

        { Array.isArray(this.state.value) && (!this.props.draggable || this.state.value.length < 2) && this.state.value.map((record, index) =>
          this.renderElement(record, index)
        )}

        { (this.state.value.length > 0 || this.props.value) &&
          <button className="initial h-center bg-green rounded-l fill-white text-white p-1/4 px-1/2 pr-1 text-xs pointer" onClick={this.onClickAddHandler} style={{ width: 'auto' }}>
            <IconAdd className="w-2 h-2 mr-1/2 no-events" />
            <div className="no-events">{Array.isArray(this.state.value?.[0]) ? 'VAGY': 'ÉS'}</div>
          </button>
        }

        { this.state.error &&
          <div className="error">{this.state.error}</div>
        }
      </div>
    );
  }
}

/**
 * propTypes
 * @override
 * @type {Object}
 */
Collection.propTypes =
{
  ...Collection.propTypes,
  draggable: PropTypes.bool,
  UI: PropTypes.func,
  value: PropTypes.array,
};

/**
 * defaultProps
 * @type {Object}
 */
Collection.defaultProps =
{
  ...Collection.defaultProps,
  draggable: false,
  UI: CollectionItem,
};

export default bindFormContexts(Collection);
