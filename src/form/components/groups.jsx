import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';


/* !- Contexts */

import { bindFormContexts } from '../context';


/* !- React Elements */

import Field from '../formField';


/**
* Extended Field component.
*
* @extends Field
* @example
*
* <Groups
*   id="city"
*   label="City"
*   data={[{ id, title }, ...]}
* />
*/
class Groups extends Field
{
  constructor(props, context)
  {
    super(props, context);
    this.state.selection = [];
  }

  /**
   * Extends default onChangeHandler redux layer close action dispatch.
   *
   * @private
   * @override
   * @emits
   * @param  {Object} item { id, title }
   * @return {void}
   */
  onChangeGroupsHandler = () =>
  {
    const { selection, value } = this.state;

    const nextValue =
        selection
          .reduce(
            (result, id, n) =>
            {
              const groupIndex = result.findIndex(group => group.indexOf(id) !== -1);

              if (groupIndex === -1)
              {
                if (!n)
                {
                  result.push([id]);
                }
                else
                {
                  result[result.length - 1].push(id);
                }
              }
              else
              {
                const group = result[groupIndex];
                const index = group.findIndex(groupItemId => groupItemId === id);

                result[groupIndex] = [...group.slice(0, index), ...group.slice(index + 1)];
              }

              return result;

            },
            value,
          )
          .filter(group => group.length > 1);

    this.setState(
      { selection: [] },
      () =>
      {
        this.onChangeHandler(nextValue);
      },
    );
  }


  onClickItemHandler = (id, event) =>
  {
    const isShift = event.shiftKey === true;
    const isDouble = event.type === "dblclick";

    if (isDouble)
    {
      const siblings = this.getItemSiblings(id);

      const selection = isShift ? this.state.selection.filter(id => siblings.indexOf(id) === -1) : siblings;

      this.setState({ selection });
      return;
    }

    let selection = [...this.state.selection];

    const index = selection.indexOf(id);

    if (index === -1)
    {
      selection.push(id);
    }
    else
    {
      selection = [...selection.slice(0, index), ...selection.slice(index + 1)];
    }

    this.setState({ selection });
  }




  /* !- Lifecycle */

  getNonGroupedItems = () =>
  {
    const groupIds = this.state.value.flat();

    return this.data.filter(({ id }) => groupIds.indexOf(id) === -1);
  }

  getItemSiblings = (id, onlyId = true) =>
  {
    return this.state.value.find(group => group.indexOf(id) !== -1) || this.getNonGroupedItems().map((item) => (onlyId ? item.id : item));
  }

  getGroupIndex = () =>
  {
    const { selection, value } = this.state;

    return value.findIndex(group => group.length === selection.length && selection.every(id => group.indexOf(id) !== -1))
  }




  /**
   * This method is called when render the Component instance.
   * @override
   * @return {ReactElement}
   */
  render()
  {
    const dataNonGrouped = this.getNonGroupedItems();

    const dataGrouped = this.state.value.map(items => items.map(item => this.data.find(({ id }) => id === item)));

    const isGroupContainsSelection = this.state.value.flat().some(id => this.state.selection.indexOf(id) !== -1);

    const buttonLabel = this.getGroupIndex() !== -1 ? 'Szétbont' : (isGroupContainsSelection ? 'Eltávolít' : 'Csoportosít');


    return (
      <div className="field groups">

        { this.label }

        <div className='h-center'>

          <div className='h-4 h-center'>
            {
              dataGrouped.map((items, n) => (
                <div key={`group-${n}`} className="border rounded flex mx-1">
                  {
                    items.map(({ id, title }) => (
                      <div
                        key={id}
                        className={classNames({
                          'p-1/2 pointer uppercase text-xs': true,
                          'bg-blue-light': this.state.selection.indexOf(id) !== -1,
                        })}
                        onClick={(event) => this.onClickItemHandler(id, event)}
                        onDoubleClick={(event) => this.onClickItemHandler(id, event)}
                      >
                        {title}
                      </div>
                    ))
                  }
                </div>
              ))
            }

            <div className="flex" style={{ marginTop: 1, marginBottom: 1 }}>
              { dataNonGrouped.map(({ id, title }) =>
                (
                  <div
                    key={`${this.props.id}-${id}`}
                    className={classNames({
                      'p-1/2 pointer uppercase text-xs mx-1/2 rounded': true,
                      'bg-blue-light': this.state.selection.indexOf(id) !== -1,
                    })}
                    onClick={(event) => this.onClickItemHandler(id, event)}
                    onDoubleClick={(event) => this.onClickItemHandler(id, event)}
                  >
                    {
                      this.props.intl && this.props.dataTranslate ?
                        this.props.intl.formatMessage({ id: title, default: title })
                        : title
                    }
                  </div>
                ),
              )}
            </div>
          </div>

          { (this.state.selection?.length > 1 || isGroupContainsSelection) &&
          <div className="ml-2 button white w-content border shadow small" onClick={this.onChangeGroupsHandler}>{buttonLabel}</div>
          }
        </div>

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
Groups.propTypes =
{
  ...Groups.propTypes,
  /**
   */
  data: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]).isRequired,
      title: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.element,
      ]).isRequired,
    })),
  ]),
  /**
   * Radio values block classes
   * @example
   * valueClassName="col-1-4"
   */
  valueClassName: PropTypes.string,
  /**
   * Disable select options i18n translatations
   */
  dataTranslate: PropTypes.bool,
};

/**
 * defaultProps
 * @type {Object}
 */
Groups.defaultProps =
{
  ...Groups.defaultProps,
  data: [],
  value: [],
  valueClassName: '',
  dataTranslate: true,
};

export default bindFormContexts(Groups);
