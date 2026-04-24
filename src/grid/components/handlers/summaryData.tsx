
import React from 'react';
import classNames from 'classnames';
import SummaryValue from './summaryValue';



/* !- Types */

type dataType = {
  title: string,
  value: string | number,
  priority?: number
  caption?: string,
}

interface PropTypes {
  title?: string,
  subTitle?: string,
  data: dataType[],
  children?: React.ReactNode,
  helper?: Record<number | string, number | string>,
}


/**
 * SummaryData Component
 */
const SummaryData: React.FC<PropTypes> = (
  {
    title = 'Summary',
    subTitle = 'Details',
    data = [],
    children,
    helper = {},
  }) => {

  const priorityData =
    data
      .filter(({ priority }) => priority !== undefined)
      .sort((a, b) => a.priority - b.priority);

  return (
    <div>

      {title &&
        <div className='bold mb-2 text-m'>
          {title}
        </div>
      }

      {priorityData.length > 0 &&

        <div className='grid-2 mb-2'>
          {priorityData.map(({ title, value }, i) => (
            <div key={`${title}-${i}`} className={`col-1-${priorityData.length}`}>
              <div className='p-1'>
                <div className='mb-1 bold text-s'>{title}</div>
                <div className='text-m'>{value}</div>
              </div>
            </div>
          ))}
        </div>
      }

      {children}


      <div className='p-1 py-2 rounded-m shadow-outer-2'>
        <div className='bold mb-2'>
          {subTitle}
        </div>
        <div className='text-s'>
          {
            data.map(({ title, value, caption }, i) => (
              <div
                key={`${title}-${i}`}
                className={classNames({
                  'flex': true,
                  'border-bottom border-white mb-1 pb-1': data.length !== i + 1,
                })}
              >
                <div className='col-1-2 light'>
                  {title}
                  {caption &&
                    <div className='text-gray text-s mt-1'>{caption}</div>
                  }
                </div>
                <div className='col-1-2'>
                  <SummaryValue
                    value={value}
                    helper={helper}
                  />
                </div>
              </div>
            ))
          }
        </div>
      </div>

    </div>
  );
};

export default SummaryData;
