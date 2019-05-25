
import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';


/* !- Actions */

import * as FormActions from '../../form/actions';


/* !- React Elements */

import Select from '../../form/pure/select';


/**
* Grid Date Component.
*
*
* @example
*/
const GridSelect = (props) =>
{
  return (
    <Select
      onChange={({ value }) =>
      {
        props.setValues({ [props.id]: value });
      }}
      { ...props }
    />
  );
};


/**
 * defaultProps
 * @type {Object}
 */
GridSelect.defaultProps =
{
  id: 'GridSelect',
};

export default connect(
  (state, props) => (props),
  {
    setValues: FormActions.setValues,
  },
)(GridSelect);
