
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import map from 'lodash/map';
import reduce from 'lodash/reduce';


/* !- React Elements */

import { lightBlue400, gray900 } from 'material-ui/styles/colors';
import MuiIconButton from 'material-ui/IconButton';
import IconVisibility from 'material-ui/svg-icons/action/visibility';

import GridMultiple from './gridMultiple';


/* !- Actions */

import * as GridActions from '../actions';
import * as FromActions from '../../form/actions';


/* !- Constants */

import { FORM_ID } from '../constants';


/**
* Grid Hook Stateless Component
*
* Controlling the visible columns
* @example
* <GridVisibleColumns />
*/
class GridVisibleColumns extends Component
{

  /* !- React lifecycle */

  componentDidMount()
  {
    this.setFormDefaultHelpersColumn();
  }

  /* !- Handlers */

  onChangeAvailableColumns = (id, value, field) =>
  {
    this.props.setValues({ [id]: value });

    const column = this.props.hook[field];
    let newColumn = {};

    if (typeof column === 'string')
    {
      newColumn = {
        title: column,
        status: 0,
      };
    }
    else
    {
      let status = 0;
      if (typeof column.status !== 'undefined')
      {
        status = +!column.status;
      }

      newColumn = {
        ...column,
        status,
      };
    }

    this.props.setSettings({
      hook: {
        ...this.props.hook,
        [field]: newColumn,
      },
    });
  };

  /* !- Privates */

  /**
   * Init store form value (visible_columns) by the active hook settings
   * @private
   */
  setFormDefaultHelpersColumn()
  {
    this.props.setValues({
      [FORM_ID]: reduce(
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
      ),
    });
  }

  /**
   * Transform hook to multple data
   * @private
   * @return {array}  [{ id, title }, ...]
   */
  getColumns()
  {
    return map(
      this.props.hook,
      (column, index) =>
      {
        if (typeof column === 'string')
        {
          return { id: index, title: column };
        }
        let title = column.title;

        if (typeof title !== 'string')
        {
          if (typeof title.props !== 'undefined' && typeof title.props.value === 'string')
          {
            title = title.props.value;
          }
          else
          {
            title = index;
          }
        }
        return { id: index, title };
      },
    );
  }


  render()
  {
    return (
      <GridMultiple
        id={FORM_ID}
        button={
          <MuiIconButton>
            <IconVisibility
              color={
                Object
                  .keys(this.props.hook)
                  .every(key => this.props.visibleColumns.indexOf(key) !== -1)
                ?
                gray900 : lightBlue400
              }
            />
          </MuiIconButton>
        }
        data={this.getColumns()}
        onChange={this.onChangeAvailableColumns}
      />
    );
  }
}

/**
 * propTypes
 * @type {Object}
 */
GridVisibleColumns.propTypes =
{
  /**
   * Redux grid hook
   */
  hook: PropTypes.objectOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
    ]),
  ),
  /**
   * Redux form visible_columns
   */
  visibleColumns: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
  ),
  /**
   * setSettings Grid Action
   */
  setSettings: PropTypes.func.isRequired,
  /**
   * setValues Form Action
   */
  setValues: PropTypes.func.isRequired,
};

/**
 * defaultProps
 * @type {Object}
 */
GridVisibleColumns.defaultProps =
{
  hook: {},
  visibleColumns: [],
};


export default connect(
  state => ({
    hook: state.grid.hook,
    visibleColumns: state.form[FORM_ID],
  }),
  {
    setValues: FromActions.setValues,
    setSettings: GridActions.setSettings,
  },
)(GridVisibleColumns);
