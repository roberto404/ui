
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import orderBy from 'lodash/orderBy';


/* !- React Elements */

import MuiIconButton from 'material-ui/IconButton';
import IconMoreVert from 'material-ui/svg-icons/navigation/more-vert';
import Multiple from '../../form/mui/multiple';


/* !- Actions */

import { setValues } from '../../form/actions';


/**
* Grid Multiple Filter Stateless Component
*
* Connected to grid state via Redux.
* Every change invoke two redux state
* - form[id] <- setValue
*
* 1. Apply filter on grid data: filters[id] (use GridView container)
* 2. Form update width selected value
*
* @example
* <GridMultiple
*   id="restaurantId"
* />
*
* // same
*
* <Multiple
*   id="restaurantId"
*   data={orderBy(this.props.settings.helper.restaurants, ['title'], ['asc'])}
*   button={<MuiIconButton><IconStore /></MuiIconButton>}
* />
*
* or
*
* <Multiple
*   id="status"
*   data={this.props.settings.helper.status}
*   button={<MuiIconButton>{this.props.settings.hook.status.icon}</MuiIconButton>}
* />
*/
const GridMultiple = (
  {
    id,
    button,
    data,
    onChange,
    changeValue,
    settings,
  },
) =>
{
  let thisData = data;
  let thisButton = button;

  if (!thisData.length && settings.helper)
  {
    if (Array.isArray(settings.helper[id]))
    {
      thisData = orderBy(settings.helper[id], ['title'], ['asc']);
    }
    else if (typeof settings.helper[id] === 'object')
    {
      thisData = settings.helper[id];
    }
  }

  if (!thisButton)
  {
    if (settings.hook &&
      typeof settings.hook[id] !== 'undefined' &&
      typeof settings.hook[id].icon !== 'undefined'
    )
    {
      thisButton = <MuiIconButton>{settings.hook[id].icon}</MuiIconButton>;
    }
    else
    {
      thisButton = <MuiIconButton><IconMoreVert /></MuiIconButton>;
    }
  }

  return (
    <Multiple
      id={id}
      button={thisButton}
      data={thisData}
      onChange={({ value }, field) =>
      {
        if (onChange)
        {
          onChange(id, value, field);
        }
        else
        {
          changeValue({ [id]: value });
        }
      }}
    />
  );
};

/**
 * propTypes
 * @type {Object}
 */
GridMultiple.propTypes =
{
  /**
   * Redux form state id
   */
  id: PropTypes.string,
  /**
   * Redux form state id
   */
  button: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.bool,
  ]),
  /**
   * Dropdown items
   * @example
   * [{ id: 2, title: 'Bar' }, { id: 1, title: 'Foo' }]
   * or
   * { 0: 'inactive', 1: 'active' }
   */
  data: PropTypes.oneOfType([
    PropTypes.objectOf(PropTypes.string),
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
  /**
   * Callback function that is fired when the input value changes.
   * @default () => { changeFilter(id, value); changeValue({ [id]: value }) }
   * @param {integer} nextPage
   */
  onChange: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.bool,
  ]),
  /**
   * @private
   */
  settings: PropTypes.shape({
    helper: PropTypes.object,
    hook: PropTypes.object,
  }).isRequired,
  /**
   * Callback function that is fired when the input value changes.
   * setValues Form Action
   *
   * @private
   * @param {integer} nextPage
   */
  changeValue: PropTypes.func.isRequired,
};

/**
 * defaultProps
 * @type {Object}
 */
GridMultiple.defaultProps =
{
  id: 'multipleFilter',
  settings: {},
  data: [],
  button: false,
  onChange: false,
};

export default connect(
  (state, props) =>
  ({
    ...props,
    settings:
    {
      helper: state.grid.helper,
      hook: state.grid.hook,
    },
  }),
  {
    changeValue: setValues,
  },
)(GridMultiple);
