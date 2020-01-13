
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';


/* !- React Elements */

import IconClose from '../../icon/mui/navigation/close';


/* !- Actions */

import { unsetValues, setValues } from '../../form/actions';


/**
* Show enabled filters
*/
class GridFilters extends Component
{
  constructor(props)
  {
    super(props);
    this.filters = [];
  }

  /* !- React Lifecycle */

  componentDidMount()
  {
    // Subscribe Redux
    if (this.context.store)
    {
      this.unsubscribe = this.context.store.subscribe(this.onChangeListener);
    }
  }

  componentWillUnmount()
  {
    if (this.unsubscribe)
    {
      this.unsubscribe();
    }
  }

  /* !- Listeners */

  /**
   * Invoke every Redux changes or compent props.value change.
   * Set State: value, error (if changed)
   */
  onChangeListener = () =>
  {
    const grid = this.context.store.getState().grid[this.context.grid];

    if (grid)
    {
      const filters = grid.filters
        .filter(({ status }) => status)
        .map(filter => ({ id: filter.id, values: filter.arguments }));

      if (!isEqual(filters, this.filters))
      {
        this.filters = filters;
        this.forceUpdate();
      }
    }
  }

  /* !- Handlers */

  onClickFilterHandler = (event) =>
  {
    event.preventDefault();

    const id = event.currentTarget.dataset.id;
    const value = event.currentTarget.dataset.value;

    const form = this.context.store.getState().form;
    const values = form[id];

    if (values !== undefined)
    {
      let newValues;

      if (Array.isArray(values))
      {
        const index = values.findIndex(v =>
          ((!isNaN(v) && !isNaN(value)) ? parseFloat(v) === parseFloat(value) : v === value)
        );

        if (index !== -1)
        {
          newValues = [...values.slice(0, index), ...values.slice(index + 1)];
        }
        else
        {
          newValues = [];
        }

        if (newValues.length === 0)
        {
          newValues = undefined;
        }
      }
      else if (typeof values === 'object')
      {
        const valueArray = value.split(',');

        const index = values[valueArray[0]].findIndex(v => v === valueArray[1]);

        const newValue = [
          ...values[valueArray[0]].slice(0, index),
          ...values[valueArray[0]].slice(index + 1),
        ];

        newValues = { ...values, [valueArray[0]]: newValue };

        if (newValue.length === 0)
        {
          delete newValues[valueArray[0]];
        }

        if (Object.keys(newValues).length === 0)
        {
          newValues = undefined;
        }
      }

      newValues = this.props.onClick({ id, value, values, newValues, event });

      if (newValues !== undefined)
      {
        this.context.store.dispatch(setValues({ [id]: newValues }));
      }
      else
      {
        this.context.store.dispatch(unsetValues({ id }));
      }
    }
  }


  /* !- Privates */

  /**
   * This method is called when render the Component instance.
   * @return {ReactElement}
   */
  render()
  {
    const tags = this.filters.reduce(
      (result, filter) =>
      {
        if (typeof filter.values[0] === 'string')
        {
          result.push({ id: filter.id, value: filter.values[0] });
        }
        else if (Array.isArray((filter.values[0])))
        {
          filter.values[0].forEach(value => result.push({ id: filter.id, value }));
        }
        else
        {
          Object.keys(filter.values[0]).forEach((id) =>
          {
            filter.values[0][id].forEach(value =>
              result.push({ id: filter.id, value: [id, value] }));
          });
        }
        return result;
      },
      [],
    );

    if (tags.length === 0)
    {
      return <div />;
    }

    return (
      <div className={this.props.className}>
        {
          tags.map(({ id, value }) => (
            <div
              key={`${id}-${value}`}
              className={this.props.tagClassName}
              onClick={this.onClickFilterHandler}
              data-id={id}
              data-value={value}
            >
              <div>
                {this.props.format({ id, value })}
              </div>
              <IconClose style={{ margin: '-2px 0px -1px 0' }} />
            </div>
          ))
        }
      </div>
    );
  }
}

/**
 * propTypes
 * @type {Object}
 */
GridFilters.propTypes =
{
  onClick: PropTypes.func,
  /**
   * Format field value.
   */
  format: PropTypes.func,
  className: PropTypes.string,
  tagClassName: PropTypes.string,
};

/**
 * defaultProps
 * @type {Object}
 */
GridFilters.defaultProps =
{
  onClick: ({ newValues }) => newValues,
  className: '',
  tagClassName: 'tag pointer no-select',
  format: filter => filter.value,
};

GridFilters.contextTypes =
{
  store: PropTypes.object,
  grid: PropTypes.object,
};

export default GridFilters;
