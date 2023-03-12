import React from 'react';
import PropTypes from 'prop-types';
import { sortableContainer, sortableElement } from 'react-sortable-hoc';
import arrayMove from 'array-move';


/* !- React Elements */

import Field from '../../form/formField';
import IconAdd from '../../icon/mui/content/add_circle_outline';
import IconRemove from '../../icon/mui/content/remove_circle_outline';


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

const SortableItem = sortableElement(({ element }) => element);

const SortableContainer = sortableContainer(({children}) => {
  return <div>{children}</div>;
});

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
  onChangeItemListener = (record, index) =>
  {
    // simple Array
    if (Array.isArray(this.state.value) && typeof this.state.value[0] === 'string')
    {
      const value = [...this.state.value];
      value[index] = record.value;

      this.onChangeHandler(value);
    }
    // nested collection empty child
    else if (Array.isArray(record) && !record.length)
    {
      this.onChangeHandler(this.state.value.filter((v, i) => i !== index));
    }
    else
    {
      this.onChangeHandler(this.state.value.map((v, i) => i === index ? record : v));
    }
  }

  onClickRemoveHandler = (event, index) =>
  {
    event.preventDefault();

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

  onDragEndHandler = ({ collection, newIndex, oldIndex, isKeySorting, node }) =>
  {
    this.onChangeHandler(arrayMove(this.state.value, oldIndex, newIndex));
  }

  renderElement = (record, index) =>
  {
    const UI = this.props.UI;

    return (
      <div className="v-center" key={index}>
        <UI
          {...this.props.uiProps}
          record={record}
          stateFormat={(value) => value[index] || ''}
          index={index}
          id={this.props.id}
          onChange={record => this.onChangeItemListener(record, index)}
        />
        <button className="action" onClick={e => this.onClickRemoveHandler(e, index)}><IconRemove /></button>
      </div>
    )
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
          <SortableContainer onSortEnd={this.onDragEndHandler}>
            { this.state.value.map((record, index) =>
              <SortableItem key={`item-${index}`} index={index} element={this.renderElement(record, index)} />
            )}
          </SortableContainer>
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

export default Collection;
