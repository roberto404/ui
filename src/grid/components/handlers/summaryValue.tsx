
import React from 'react';
import classNames from 'classnames';
import isCollection from '@1studio/utils/array/isCollection';



/* !- Types */

type dataType = {
  title: string,
  value: string | number,
  priority?: number
  caption?: string,
}

interface PropTypes {
  value: string | any[],
}


/**
 * SummaryValue Component
 */
const SummaryValue: React.FC<PropTypes> = (
  {
    value = '',
    helper = {},
  }) => {

  if (typeof value !== 'string' && isCollection(value)) {

    const keys = Object.keys(value[0]);


    return (
      <div className='grid'>
        {
          value.map((item, i) => (
            <React.Fragment key={i}>
              <div className="col-1-2 border-bottom border-white mb-1 pb-1 light">{helper[item[keys[0]]] || item[keys[0]]}</div>
              <div className="col-1-2 border-bottom border-white mb-1 pb-1">{item[keys[1]]}</div>
            </React.Fragment>
          ))
        }
      </div>
    )
  }

  return (
    <div>

      {Array.isArray(value) ? value.join(', ') : value}

    </div>
  );
};

export default SummaryValue;
