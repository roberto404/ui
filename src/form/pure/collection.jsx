import React from 'react';
import PropTypes from 'prop-types';


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
    this.onChangeHandler(this.state.value.map((v, i) => i === index ? record : v));
  }

  onClickRemoveHandler = (event, index) =>
  {
    event.preventDefault();

    this.onChangeHandler(this.state.value.filter((v, i) => i !== index));
  }

  onClickAddHandler = (event) =>
  {
    event.preventDefault();

    const item = {};

    Object.keys(this.state.value[0]).forEach((key) =>
    {
      if (key === 'id')
      {
        item.id = this.state.value.length + 1;
      }
      else
      {
        item[key] = undefined;
      }
    });

    this.onChangeHandler([...this.state.value, item]);
  }

  /**
   * This method is called when render the Component instance.
   * @override
   * @return {ReactElement}
   */
  render()
  {
    const UI = this.props.UI;

    return super.render() || (
      <div className={this.getClasses('collection')}>

        { this.label }

        { this.state.value.map((record, index) =>
          (
            <div key={index} className="flex v-center">
              <UI record={record} onChange={record => this.onChangeItemListener(record, index)} />
              <button className="action" onClick={e => this.onClickRemoveHandler(e, index)}><IconRemove /></button>
            </div>
          ))
         }

        { this.state.value.length > 0 &&
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
  /**
   */
  // data: PropTypes.oneOfType([
  //   PropTypes.func,
  //   PropTypes.arrayOf(PropTypes.shape({
  //     id: PropTypes.string.isRequired,
  //     title: PropTypes.string.isRequired,
  //   })),
  // ]),
  UI: PropTypes.func,
};

/**
 * defaultProps
 * @type {Object}
 */
Collection.defaultProps =
{
  ...Collection.defaultProps,
  UI: CollectionItem,
};

export default Collection;
