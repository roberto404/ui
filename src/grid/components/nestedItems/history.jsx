
import React, { Component } from 'react';
import moment from 'moment';
import classNames from 'classnames';


/* !- React Elements */

import IconCheck from '../../../icon/mui/navigation/check';


/* !- Constants */

import { DATE_FORMAT, DATETIME_FORMAT } from '../../../calendar/constants';

const intlRegex = new RegExp(/^[a-z0-9.]+$/);




/**
 * [MessageGroup description]
 * @param {[type]} title    [description]
 * @param {[type]} level    [description]
 * @param {[type]} children [description]
 */
const MessageGroup = ({ title , level, children }) =>
{
  /* date */
  if (level === 0)
  {
    return (
      <div>
        <div className="py-2 text-s text-gray bold">{title}</div>
        {children}
      </div>
    );
  }

  /* messages */
  return <div>{children}</div>;
};

/**
 * When one person send more than on message
 */
let prevUserId;

/**
 * [Messages description]
 */
const History = ({
  index,
  children,
  level,
  items,
  isFirst,
  isLast,
  intl,
  onClick,
}) =>
{
  if (children)
  {
    return (
      <MessageGroup
        level={level}
        title={index.substring(1)}
      >
        {children}
      </MessageGroup>
    );
  }

  /* Message */

  const {
    id,
    userId,
    crud,
    model,
    recordId,
    recordFields,
    record,
    ip,
    insertDateTime,

    userName,
    title,
  } = items;

  const isFirstUser = prevUserId !== userId;

  prevUserId = userId;

  let message = items.message || '';
  let tag = items.tag || [];
  
  if (!tag.length && Array.isArray(recordFields))
  {
    tag = recordFields.map(field => ({
      title: intl.formatMessage({ id: `${model}.field.${field}` }),
      className: 'bg-gray-light',
    }));

    if (!message)
    {
      message = recordFields.map(field => record[field]).join(', ');
    }
  }

  const icon = items.icon || (
    <div className="w-2 text-center">
      <svg viewBox="0 0 12 12" className="w-1 h-1 fill-blue-dark"> 
        { crud === 'C' &&
        <path d="M6,12 C2.6862915,12 0,9.3137085 0,6 C0,2.6862915 2.6862915,0 6,0 C9.3137085,0 12,2.6862915 12,6 C12,9.3137085 9.3137085,12 6,12 Z M6,10 C8.209139,10 10,8.209139 10,6 C10,3.790861 8.209139,2 6,2 C3.790861,2 2,3.790861 2,6 C2,8.209139 3.790861,10 6,10 Z" />
        }
        { crud !== 'C' &&
        <circle cx="6" cy="6" r="6" />
        }
      </svg>
    </div>
  )


  return (
    <div
      className={classNames({
      'pointer': typeof onClick === 'function'
      })}
      onClick={event => onClick?.(items, event)}
    >

      <div className="h-center">

        <div className="text-xs w-4">
          { moment(insertDateTime).format('k:mm') }
        </div>

        { icon }

        <div className="bold zoom-1.1 grow pr-1 pl-1 firstcase">
          { title && intlRegex.test(title) ? intl.formatMessage({ id: title }) : title }
        </div>

        <div className="light text-xs text-gray text-right">
          {userName}
        </div>

      </div>


      <div
        className={classNames({
          "pl-2 my-1": true,
          "border-left border-blue-dark border-2": isLast === false,
        })}
        style={{ marginLeft: `calc(5rem + ${(1 - (+!isLast * 2))}px)` }}
      >

        <div>
          {(tag || []).map(({ title, className }) => (
            <div
              className={`rounded tag mr-1 px-1 ${className}`}
            >
              {title}
            </div>
          ))}
        </div>
        
        <div className="pb-1 mt-1/2 italic text-s">
          {message}
        </div>

      </div>
    </div> 
  )
};



export default History;
