
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';


/* !- Actions */

import * as FormActions from '../../form/actions';


/* !- React Elements */

import Input from '../../form/pure/input';


/**
* Grid Date Component.
*
*
* @example
<GridDate
  id="start"
/>
*/
const GridInput = (props) =>
{
  return (
    <Input
      type="date"
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
GridInput.defaultProps =
{
  id: 'GridInput',
};

export default connect(
  (state, props) => (props),
  {
    setValues: FormActions.setValues,
  },
)(GridInput);
