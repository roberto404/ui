import React from 'react';
import { connect } from 'react-redux';

/* !- React Actions */

import * as LayerActions from '@1studio/ui/layer/actions';

/* !- Constants */

const STORES = [2, 6, 8];

const PopoverComponent = ({ record }) => (
  <div className="pr-3" style={{ width: '250px' }}>
    <div className="bold mb-1">Mintakészlet</div>

    {STORES.map((store) =>
{
      const supply1 = record[`rs${store}1`];
      const supply2 = record[`rs${store}2`];
      const isSupply = parseInt(supply1) + parseInt(supply2) > 0;
      return (
        <div key={store} className="grid-2 h-center mb-1">
          <div className="col-2-5">
            <div
              className={`p-1 bg-${isSupply ? 'green' : 'gray'} inline-block`}
            >{`RS${store}`}</div>
          </div>
          <div className="col-1-5">{supply1}</div>
          <div className="col-1-5">/</div>
          <div className="col-1-5">{supply2}</div>
        </div>
      );
    })}

    <div className="text-s">Gyártói minta / Kivett készlet</div>
  </div>
);

/**
 * GridCell Component
 */
const GridCell = ({ record, popover, flush, children }) => (
  <div className="pointer" onClick={event => popover(<PopoverComponent record={record} />, event)}>
    {children}
  </div>
);

export default connect(
  null,
  {
    ...LayerActions,
  },
)(GridCell);
