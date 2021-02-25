
import React, { Component } from 'react';
import moment from 'moment';


/* !- React Elements */

import IconCheck from '../../../icon/mui/navigation/check';


/* !- Constants */

import { DATE_FORMAT, DATETIME_FORMAT } from '../../../calendar/constants';



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
        <div className="py-1 text-center text-xs text-gray">{moment(title, DATE_FORMAT).format('MMM D.')}</div>
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
let prevMessageSender;

/**
 * [Messages description]
 * @param {[type]}  index    [description]
 * @param {[type]}  children [description]
 * @param {[type]}  level    [description]
 * @param {[type]}  items    [description]
 * @param {Boolean} isFirst  [description]
 * @param {Boolean} isLast   [description]
 * @param {[type]}  userId   [description]
 */
const Messages = ({ index, children, level, items, isFirst, isLast, userId }) =>
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
    content,
    name,
    createdDateTime,
    deliveredDateTime,
  } = items;

  const isFirstFromSender = prevMessageSender !== items.sender;

  prevMessageSender = items.sender;


  // to me
  if (items.sender && items.sender.toString() !== userId.toString())
  {
    return (
      <div className="flex" style={{ width: '450px' }}>

        <div className="mr-1 w-4">
          { isFirstFromSender === true &&
          <div className="avatar">
            <span>{name[0]}</span>
          </div>
          }
        </div>

        <div
          className="bg-white-dark rounded-m p-1"
          style={{
            marginBottom: isLast ? '1rem' : '0.2rem',
            borderTopLeftRadius: isFirst ? '0' : '1rem',
          }}
        >
          { isFirst === true &&
          <div className="text-blue-dark text-xs light pb-1">
            {name}
          </div>
          }
          <div className="text-s text-line-l" style={{ maxWidth: '30rem', wordBreak: 'break-word' }}>{content}</div>
          <div className="pt-1/2 text-right text-xs light text-gray">{moment(createdDateTime, DATETIME_FORMAT).format('k:mm')}</div>
        </div>

        <div className="grow" />
      </div>
    );
  }
  // from me
  else
  {
    return (
      <div className="flex" style={{ width: '450px' }}>
        <div className="grow" />

        <div className="bg-blue-dark text-white rounded-m p-1" style={{ marginBottom: isLast ? '1rem' : '0.2rem', borderTopRightRadius: isFirst ? '0' : '1rem' }}>
          <div className="text-s text-line-l" style={{ maxWidth: '30rem', wordBreak: 'break-word' }}>{content}</div>
          <div className="pt-1/2 h-center v-right">
            <span className="text-right text-xs light ">{moment(createdDateTime, DATETIME_FORMAT).format('k:mm')}</span>
            { !!deliveredDateTime &&
            <IconCheck className="fill-white w-2 pl-1/2" title={deliveredDateTime} />
            }
          </div>
        </div>

      </div>
    )
  }
};



export default Messages;
