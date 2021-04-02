import React from 'react';
import PropTypes from 'prop-types';
import { sortableContainer, sortableElement } from 'react-sortable-hoc';
import arrayMove from 'array-move';


/* !- React Elements */

import Field from '../../form/formField';
import IconAdd from '../../icon/mui/content/add_circle_outline';
// import IconRemove from '../../icon/mui/content/clear';
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
    // nested collection empty child
    if (Array.isArray(record) && !record.length)
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

    // nested collection add new array
    if (Array.isArray(this.props.value[0]))
    {
      item = this.props.value[0]
    }
    else
    {
      item = {};

      const keys = this.state.value.length ? this.state.value[0] : this.props.value[0];

      Object.keys(keys).forEach((key) =>
      {
        if (key === 'id')
        {
          item.id = this.state.value.length + 1;
        }
        else
        {
          item[key] = (this.props.value.length && typeof this.props.value[0][key] !== 'undefined') ?
            this.props.value[0][key] : undefined;
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
          <button className="action" onClick={this.onClickAddHandler}><IconAdd /></button>
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
