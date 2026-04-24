
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import { MergedContexts } from '../../context';
import { bindGridContexts } from '../context';


/* !- React Elements */

import IconClose from '../../icon/mui/navigation/close';



/* !- Actions */

import { unsetValues, setValues } from '../../form/actions';


/**
* Show enabled filters
*/
class GridFilters extends Component {

  constructor(props, context) {
    super(props);
    this.filters = this.getFilters(props, context);
  }

  /* !- React Lifecycle */

  componentDidMount() {
    // Subscribe Redux
    if (this.context.store) {
      this.unsubscribe = this.context.store.subscribe(this.onChangeListener);
    }
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  /* !- Listeners */

  /**
   * Invoke every Redux changes or compent props.value change.
   * Set State: value, error (if changed)
   */
  onChangeListener = () => {
    const filters = this.getFilters();

    if (!isEqual(filters, this.filters)) {
      this.filters = filters;
      this.forceUpdate();
    }
  }

  /* !- Handlers */

  onClickFilterHandler = (event) => {
    event.preventDefault();

    const id = event.currentTarget.dataset.id;
    const value = event.currentTarget.dataset.value;

    const form = this.context.store.getState().form;
    const values = form[id];

    if (values !== undefined) {
      let newValues;

      if (Array.isArray(values)) {
        const index = values.findIndex(v =>
          ((!isNaN(v) && !isNaN(value)) ? parseFloat(v) === parseFloat(value) : v === value)
        );

        if (index !== -1) {
          newValues = [...values.slice(0, index), ...values.slice(index + 1)];
        }
        else {
          newValues = [];
        }

        if (newValues.length === 0) {
          newValues = undefined;
        }
      }
      else if (typeof values === 'object') {
        const valueArray = value.split(',');

        const index = values[valueArray[0]].findIndex(v => v === valueArray[1]);

        const newValue = [
          ...values[valueArray[0]].slice(0, index),
          ...values[valueArray[0]].slice(index + 1),
        ];

        newValues = { ...values, [valueArray[0]]: newValue };

        if (newValue.length === 0) {
          delete newValues[valueArray[0]];
        }

        if (Object.keys(newValues).length === 0) {
          newValues = undefined;
        }
      }

      newValues = this.props.onClick({ id, value, values, newValues, event });

      if (newValues !== undefined) {
        this.context.store.dispatch(setValues({ [id]: newValues }));
      }
      else {
        this.context.store.dispatch(unsetValues({ id }));
      }
    }
  }


  /* !- Privates */

  getFilters = (props = this.props, context = this.context) => {

    const grid = context.store.getState().grid[props.id || context.grid] || { filters: [] };

    return grid.filters
      .filter(({ status }) => status)
      .map(filter => {

        const values = filter.arguments;
        let intlValues;

        if (Array.isArray(values) && Array.isArray(values[0]) && Array.isArray(filter.data)) {
          intlValues = values[0].map(value => {

            return (
              filter.data.find(data => data.id == value)?.title
              || filter.data.flatMap(data => data.items || []).find(data => data.id == value)?.title
              || value
            );
          });
        }

        return ({
          id: filter.id,
          values,
          intlValues,
          label: filter.label,
        });
      });
  }

  /**
   * This method is called when render the Component instance.
   * @return {ReactElement}
   */
  render() {

    const { placeholder: Placeholder } = this.props;

    const tags = this.filters.reduce(
      (result, filter) => {
        if (filter.values[0] !== undefined) {

          if (typeof filter.values[0] === 'string') {
            result.push({ id: filter.id, value: filter.values[0], label: filter.label });
          }
          else if (Array.isArray((filter.values[0]))) {
            filter.values[0].forEach((value, i) => result.push({
              id: filter.id,
              value,
              intlValues: filter.intlValues?.[i],
              label: filter.label,
            }));
          }
          else {
            Object.keys(filter.values[0]).forEach((id) => {
              if (Array.isArray(filter.values[0][id])) {
                filter.values[0][id].forEach(value =>
                  result.push({ id: filter.id, value: [id, value], label: filter.label }));
              }
            });
          }
        }
        return result;
      },
      [],
    );

    if (tags.length === 0) {
      return Placeholder ? <Placeholder {...this.props} /> : <div />;
    }

    return (
      <div>
        {this.props.label}
        <div className={this.props.className}>
          {
            tags.map(({ id, value, label, intlValues }) => (
              <div
                key={`${id}-${value}`}
                className={this.props.tagClassName}
                onClick={this.onClickFilterHandler}
                data-id={id}
                data-value={value}
              >
                {label &&
                  <div className="firstcase colon">{label}</div>
                }
                <div>
                  {this.props.format({ id, value: intlValues || value })}
                </div>
                <IconClose style={{ margin: '-2px 0px -1px 0' }} />
              </div>
            ))
          }
        </div>
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
  label: PropTypes.element,
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

GridFilters.contextType = MergedContexts;

export default bindGridContexts(GridFilters);
