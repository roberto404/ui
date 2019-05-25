
import React from 'react';
import PropTypes from 'prop-types';


/**
* Grid Value Stateless Component
*
* Return <span /> value with custom prop.method return.
* Prop.method get Redux Store grid dataModel in params
*
* @example
* <GridValue
*   method={(state) => state.grid.dataModel.results}
* />
*
* or user formats
*
* <GridValue
*  method={averageDeviation(props)}
* />
*
* //-> DataModel Average Deviation:
* if value 10 and the average value 5 = 100% deviation
*/
const GridValue = ({ method }, { store }) =>
  <span>{method(store.getState())}</span>;


/**
 * propTypes
 * @type {Object}
 */
GridValue.propTypes =
{
  /**
   * method call with Redux Store grid dataModel params
   */
  method: PropTypes.func.isRequired,
};


/**
 * contextTypes
 * @type {Object}
 */
GridValue.contextTypes = {
  store: PropTypes.object,
};

export default GridValue;
