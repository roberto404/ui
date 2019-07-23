
import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';



/* !- Redux Actions */

import * as GridActions from '@1studio/ui/grid/actions';


/**
* NestedList Group Component
*/
const ListGroup = ({ items, children, goToPage, active, page }) =>
(
  <div onClick={() => goToPage(page, 'priceTag')} className={`no-select ${active ? 'active' : ''}`}>
    <div className="text-gray p-1/2 text-s">
      {items[0].props.sku}
    </div>
    <div className="card p-1/2">
      {children}
    </div>
  </div>
);

const mapStateToProps = ({ grid }, { items }) =>
{
  const priceTag = grid.priceTag || {};
  const page = priceTag.rawData.findIndex(record => record.id === items[0].id) + 1;

  return {
    page,
    active: priceTag.page === page,
  };
};

const mapDispatchToProps = {
  goToPage: GridActions.goToPage,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ListGroup);
