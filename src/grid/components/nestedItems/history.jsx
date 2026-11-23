
import React, { Component } from 'react';
import moment from 'moment';
import classNames from 'classnames';


/* !- React Elements */

import IconCheck from '../../../icon/mui/navigation/check';
import HistoryChanges from './historyChanges';
import { getHistoryCategory } from './historyCategories';


/* !- Constants */

import { DATE_FORMAT, DATETIME_FORMAT } from '../../../calendar/constants';

const intlRegex = new RegExp(/^[a-z0-9.]+$/);


function formatIfDate(input) {

  if (typeof input !== 'string') {
    return input;
  }

  const parsedDate = moment(input, moment.ISO_8601, true);

  if (parsedDate.isValid()) {
    if (input.includes('T')) {
      return parsedDate.format('YYYY-MM-DD HH:mm');
    } else {
      return parsedDate.format('YYYY-MM-DD');
    }
  }

  return input;
}


/**
 * [MessageGroup description]
 * @param {[type]} title    [description]
 * @param {[type]} level    [description]
 * @param {[type]} children [description]
 */
const MessageGroup = ({ title, level, children }) => {
  /* date */
  if (level === 0) {
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
 * Field name from the dictionary: `<model>.field.<field>` (e.g. `products.field.price_purchase`),
 * then the general `field.<field>` (e.g. `field.city`), at last the field itself
 */
const fieldTitle = (intl, model, field) =>
{
  const messages = intl.messages || {};
  const id = [`${(model || '').toLowerCase()}.field.${field}`, `field.${field}`]
    .find(key => messages[key] !== undefined);

  return id ? intl.formatMessage({ id }) : field;
};

/**
 * Title of a log entry without a caller title:
 * create / delete, update: "Módosítás" or with one field "<Mező> módosítás"
 */
const getAutoTitle = (intl, model, crud, fields) =>
{
  if (crud === 'C') {
    return 'Létrehozás';
  }

  if (crud === 'D') {
    return 'Törlés';
  }

  if (crud !== 'U') {
    return '';
  }

  if (fields.length === 1) {
    return `${fieldTitle(intl, model, fields[0])} módosítás`;
  }

  return 'Módosítás';
};

/**
 * When one person send more than on message
 */
let prevUserId;

/**
 * [Messages description]
 */
/**
 * Tag colors: the API sends tag modifier names (green, red...) or utility classes
 * (`border bg-white-light border-yellow text-yellow`): modifiers => utilities, missing parts => gray
 */
const TAG_TOKENS = {
  green: 'bg-green-light border-green text-green-dark',
  red: 'bg-red-light border-red text-red',
  yellow: 'bg-yellow-light border-yellow text-yellow',
  blue: 'bg-blue-light border-blue-dark text-blue-dark',
  'blue-light': 'bg-blue-light border-blue-dark text-blue-dark',
  gray: 'bg-gray border-gray',
  'gray-light': 'bg-gray-light border-gray',
};

export const getTagClassName = (className = '') =>
{
  const tokens = className.split(/\s+/).filter(Boolean).map(token => TAG_TOKENS[token] || token).join(' ');

  return classNames('inline-block border border-2 rounded px-1/2 mr-1/2 mb-1/2 text-xs text-line-l bold uppercase text-nowarp', tokens, {
    'bg-gray-light': !/(^|\s)bg-/.test(tokens),
    'border-gray': !/(^|\s)border-(?!2)[a-z]/.test(tokens),
    'text-gray-dark': !/(^|\s)text-(?!xs)[a-z]/.test(tokens),
  });
};

/**
 * Tags of an entry
 */
const Tags = ({ tag }) =>
{
  if (!tag?.length) {
    return null;
  }

  return (
    <div>
      {tag.map(({ title, className }, i) => (
        <span key={i} className={getTagClassName(className)}>
          {title}
        </span>
      ))}
    </div>
  );
};

/**
 * Default icon of an uncategorized entry: blue dot (create: ring)
 */
const Dot = ({ crud }) => (
  <div className="w-2 text-center">
    <svg viewBox="0 0 12 12" className="w-1 h-1 fill-blue-dark">
      {crud === 'C' &&
        <path d="M6,12 C2.6862915,12 0,9.3137085 0,6 C0,2.6862915 2.6862915,0 6,0 C9.3137085,0 12,2.6862915 12,6 C12,9.3137085 9.3137085,12 6,12 Z M6,10 C8.209139,10 10,8.209139 10,6 C10,3.790861 8.209139,2 6,2 C3.790861,2 2,3.790861 2,6 C2,8.209139 3.790861,10 6,10 Z" />
      }
      {crud !== 'C' &&
        <circle cx="6" cy="6" r="6" />
      }
    </svg>
  </div>
);

/**
 * History entry.
 *
 * With category (`items.category` or `defaultCategory`, see setHistoryCategories):
 * the category icon in a tinted circle, gray timeline, under the title the category name and the user.
 * Without category: the classic blue dot / blue line layout.
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
  categories,
  defaultCategory,
}) => {
  if (children) {
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
    userId,
    crud,
    model,
    recordFields,
    record,
    insertDateTime,

    userName,
    title,
  } = items;

  prevUserId = userId;

  let message = items.message || '';
  let tag = items.tag || [];

  // only the changes (prepared by the caller from the previous snapshot)
  const changes = Array.isArray(items.changes) && items.changes.length ?
    items.changes.map(change => ({ ...change, title: change.title ?? fieldTitle(intl, model, change.field) })) :
    null;

  // `changes: []` = computed, nothing really changed (ex. saved again): only the field names
  const isDiffed = Array.isArray(items.changes);

  // changed fields: the computed changes, otherwise the logged field list
  const changedFields = changes ? changes.map(({ field }) => field) : (Array.isArray(recordFields) ? recordFields : []);

  // no title from the caller: "Módosítás", one field "<Mező> módosítás" (then no field label below)
  const isSingleField = !title && crud === 'U' && changedFields.length === 1;
  const autoTitle = title ? '' :
    (isSingleField && changes?.[0].title ? `${changes[0].title} módosítás` : getAutoTitle(intl, model, crud, changedFields));

  if (changes) {
    tag = [];
  }

  if (!changes && !items.tag?.length && Array.isArray(recordFields)) {
    if (!isSingleField) {
      tag = recordFields.map(field => ({
        title: fieldTitle(intl, model, field),
        className: '',
      }));
    }

    if (!message && !isDiffed && record) {
      message = recordFields.map(field => formatIfDate(record[field])).join(', ');
    }
  }

  const titleText = title && intlRegex.test(title) ? intl.formatMessage({ id: title }) : (title || autoTitle);
  const time = moment(insertDateTime).format('k:mm');
  const onClickHanlder = items.onClick || onClick;
  const category = getHistoryCategory(items.category, categories, defaultCategory);


  /* Category entry */

  if (category) {
    const Icon = category.icon;

    return (
      <div
        className={classNames('flex', {
          'pointer': typeof onClickHanlder === 'function',
        })}
        // --tint: the category color for the text-tint / bg-tint / fill-tint utilities
        style={category.color ? { '--tint': category.color } : undefined}
        onClick={event => onClickHanlder?.(items, event)}
      >
        <div className="w-4 shrink-0 pt-1/4 text-s light text-gray-dark">
          {time}
        </div>

        {/* icon + gray timeline to the end of the entry (not after the last entry of the day) */}
        <div className="column h-center shrink-0 w-3 pb-1/2">
          <div className={classNames('circle flex h-center v-center shrink-0 @w-2 @h-2', category.iconClassName || 'bg-tint fill-tint')}>
            {items.icon || (Icon && <Icon className="@w-1 @h-1" />)}
          </div>
          {isLast === false && <div className="grow border-left border-2 border-gray-light mt-1/2" />}
        </div>

        <div className="grow min-w-0 pl-1 pb-2">
          <div className="text-m text-line-m bold firstcase mb-1/4">
            {titleText}
          </div>

          {/* default category (record without category): no name, only in the filter */}
          {(!category.isDefault || userName) &&
            <div className="text-s text-line-l mb-1/2">
              {!category.isDefault && <span className="text-tint bold">{category.title}</span>}
              {userName && <span className="text-gray-dark">{category.isDefault ? userName : ` · ${userName}`}</span>}
            </div>
          }

          <Tags tag={tag} />

          {changes && <HistoryChanges changes={changes} hideTitles={isSingleField} className="pb-1/2" />}

          {message &&
            <div className="text-break">
              {message}
            </div>
          }
        </div>
      </div>
    );
  }


  /* Classic entry */

  return (
    <div
      className={classNames({
        'pointer': typeof onClickHanlder === 'function'
      })}
      onClick={event => onClickHanlder?.(items, event)}
    >

      <div className="h-center">

        <div className="text-xs w-4">
          {time}
        </div>

        {items.icon || <Dot crud={crud} />}

        <div className="bold zoom-1.1 grow pr-1 pl-1 firstcase">
          {titleText}
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

        <Tags tag={tag} />

        {changes && <HistoryChanges changes={changes} hideTitles={isSingleField} className="pb-1" />}

        {(message || !changes) &&
          <div className="pb-1 mt-1/2 italic text-s" style={{ whiteSpace: 'normal', overflowWrap: 'break-word' }}>
            {message}
          </div>
        }

      </div>
    </div>
  )
};



export default History;
