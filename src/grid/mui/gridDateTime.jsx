
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as Filters from '../filters';


/* !- React Elements */

import Date from '../../form/mui/date';
import Time from '../../form/mui/time';

/* !- Actions */

import { setValues } from '../../form/actions';



/**
* Grid Date Component
* @example
*/
const GridDate = (
  {
    id,
    label,
    changeValue,
    disableTime,
  },
) =>
{

  return (
    <div className="grid">
      <div className="col-1-2">
        <Date
          id={id}
          onChange={({ value }) =>
          {
            changeValue({ [id]: value });
          }}
          label={label}
        />
      </div>
      { disableTime === false &&
      <div className="col-1-2">
        <Time
          id={id}
          onChange={({ value }) =>
          {
            changeValue({ [id]: value });
          }}
          label={label}
        />
      </div>
      }
    </div>
  );
};


/**
 * propTypes
 * @type {Object}
 */
GridDate.propTypes =
{
  /**
   * Redux form state id
   */
  id: PropTypes.string,
  label: PropTypes.string,
  /**
   * Callback function that is fired when the input value changes.
   * setValues Form Action
   *
   * @param {integer} nextPage
   */
  changeValue: PropTypes.func.isRequired,
  disableTime: PropTypes.bool,
};

/**
 * defaultProps
 * @type {Object}
 */
GridDate.defaultProps =
{
  disableTime: false,
  id: 'date',
  label: 'date',
};

const mapStateToProps = ({ grid, form }, { id, autocomplete, label }) =>
{
  // if (autocomplete === undefined)
  // {
    return {
      id,
      label,
    };
  // }
  //
  // if (id === undefined)
  // {
  //   id = 'search';
  // }
  //
  // console.log(grid);
  //
  // return {
  //   hook: grid.hook,
  //   term: form[id],
  //   id,
  //   autocomplete,
  // };
};

export default connect(
  null,
  {
    changeValue: setValues,
  },
)(GridDate);
