
import slugify from '@1studio/utils/string/slugify';

const DEFAULT_COMPARE = '_default';


export const weakTextCompare = (subject, term) =>
  slugify(subject).indexOf(slugify(term)) !== -1;

/**
 * Compare two string or number
 * @return boolean
 * @example
 * compare['='](a,b)
 */
export const compare = {
  [DEFAULT_COMPARE]: (subject = '', term = '') =>
  {
    if (subject === null || typeof subject.toString === 'undefined')
    {
      return false;
    }

    /**
     * If Observed data is array or object
     *
     * @todo proof of concept
     */
    // if (typeof subject === 'object')
    // {
    //   const terms = JSON.parse(term);
    //
    //   return (
    //     subject &&
    //     Object.keys(terms).every(
    //       id =>
    //         terms[id].length === 0 ||
    //         (subject[id] &&
    //           (subject[id] === terms[id] ||
    //             terms[id].some(v =>
    //               Array.isArray(subject[id])
    //                 ? subject[id].indexOf(v) !== -1
    //                 : subject[id].toString() === v,
    //             ))),
    //     ))
    // }

    return (
      subject
        .toString()
        .toLowerCase()
        .indexOf(term.toString().toLowerCase()) >= 0
    );
  },

  '=': (subject, term) => (isNaN(subject) ?
    compare[DEFAULT_COMPARE](subject, term) : parseFloat(subject) === parseFloat(term)),
  '==': (subject, term) => new RegExp(`^${term}$`, 'i').exec(subject) !== null,
  '~=': (subject, term) => (isNaN(subject) ?
    weakTextCompare(subject, term) : parseFloat(subject) === parseFloat(term)),
  '!=': (subject, term) => new RegExp(`^${term}$`, 'i').exec(subject) === null,
  '*=': (subject, term) => new RegExp(term, 'i').exec(subject) !== null,
  '^=': (subject, term) => new RegExp(`^${term}`, 'i').exec(subject) !== null,
  '$=': (subject, term) => new RegExp(`${term}$`, 'i').exec(subject) !== null,
  '>': (subject, term) => parseFloat(subject) > parseFloat(term),
  '<': (subject, term) => parseFloat(subject) < parseFloat(term),
  '<=': (subject, term) => parseFloat(subject) <= parseFloat(term),
  '>=': (subject, term) => parseFloat(subject) >= parseFloat(term),
};

/**
 * Determine operators: ==, !=, >=, = ...
 */
export const OPERATOR_KEYS = Object.keys(compare)
    .filter(key => key !== DEFAULT_COMPARE);

export const OPERATOR_REGEX = `(${
  OPERATOR_KEYS
    .join('|')
    .replace(/(\*|\^|\$)/g, '\\$&')
})`;

export const OPERATOR_UNIQUE = String.prototype.concat(...new Set(OPERATOR_KEYS.join('')))
  .replace(/\*/g, '\\$&');


export const LOGICAL_REGEX = '[|&]{1,2}';

const FIELD_CHARS = '0-9a-zA-ZöüóőúéáűíÖÜÓŐÚÉÁŰÍ_';

/**
 * (field and operator)?value <=== JSON data, but we don't use ',' coma, because coma separated expression not working
 * ([ABC]+[ ]*[!=]+[ ]*)?[ABC"{}[\\].-:]+[ ,]*
 *
 * @example
 * field=1&field>2
 * //=>
 * [field = 1, field > 2]
 */
const REGEX_QUERY_LEVEL1 = new RegExp(`([${FIELD_CHARS}]+[ ]*[${OPERATOR_UNIQUE}]+[ ]*)?[${FIELD_CHARS}"{}[\\].-:]+[ ,]*`, 'g');

/**
 * @example
 * field > 2
 * // =>
 * [field, >, 2]
 */
const REGEX_QUERY_LEVEL2 = new RegExp(`^([${FIELD_CHARS}]+)([${OPERATOR_UNIQUE}]{1}[=]{0,1})(.+)$`);
// const REGEX_QUERY_LEVEL2 = new RegExp(`^([0-9a-zA-ZöüóőúéáűíÖÜÓŐÚÉÁŰÍ_]+)([${OPERATOR_UNIQUE}]{1}[=]{0,1})([a-zA-ZöüóőúéáűíÖÜÓŐÚÉÁŰÍ0-9]+)$`);

let SEARCH_CACHE = [];

/**
 * Query search
 * Search filters handler
 *
 * parse search term (Eg.: date > '01/12/2010', userId = 22)
 * iterate record fields (alias column)
 * if column join helper use helper value to matching
 *
 * @param  {object} object {
 *  record: observe data,
 *  value: search term
 *  helper: database related value (userId:1 => 'john doe')
 *  hook: record keys i18n title or record value formatter
 *  }
 * @return {bool}
 * @example
 * "category=186|category=190"
 * "category=186&category=190"
 */
export const search = ({ record, value, helpers, hooks, index = 0 }) =>
{
  /**
   * Create SEARCH_CACHE
   * @example
   * [
   *  { columns: ['title', 'gender'], handlerIndes: '=', term: 'John' },
   *  ...
   * ]
   */
  if (index === 0)
  {
    /**
     * Split OR expressions
     */
    SEARCH_CACHE = value.split('|').map(valueOR =>
    {
      /**
       * Split AND expressions
       *
       * @example
       * field=1&field>2
       * //=>
       * [field = 1, field > 2]
       *
       * @example
       * term1, term2
       * //=>
       * [term1, term2]
       */
      const values = valueOR.match(REGEX_QUERY_LEVEL1);

      return values.map((thisValue) =>
      {
        /**
         * Determine which handler have to apply to compare term and record value
         */
        let handlerIndex = DEFAULT_COMPARE;

        /**
         * Determine which record column have to observe
         */
        let columns = [];

        /**
         * Trimed search term
         * @type {string}
         */
        let term = thisValue.replace(/,? *$/, '');

        /**
         * Determine term expressions: [field] [operator] [value]
         * @type {array}
         */
        const termMatches = term.match(REGEX_QUERY_LEVEL2);

        /**
         * If term use i18n field name convert to real record keys
         * Eg.: Visit Date => vdate
         * or just 'Vis', 'Visit', 'Date'
         */
        if (termMatches)
        {
          term = termMatches[3];
          handlerIndex = termMatches[2];
          columns = [termMatches[1]];

          if (hooks)
          {
            columns = Object.keys(hooks).reduce(
              (accumulator, column) =>
              {
                const subject = (typeof hooks[column] === 'string') ? hooks[column] : hooks[column].title;

                if (compare[DEFAULT_COMPARE](subject, termMatches[1]))
                {
                  accumulator.push(column);
                }
                return accumulator;
              },
              [termMatches[1]],
            );
          }
        }
        else
        {
          columns = Object.keys(record);
        }

        return ({ columns, handlerIndex, term });
      });
    });
  }

  // console.log(SEARCH_CACHE[0]);

  /**
   * Condition every search term must have to fulfill (return true).
   *
   * Iterate record columns
   * Change column value if it able to join helper object
   * Transfer the converted column value (alias subject)
   * to SearchHandler which compare term and subject
   */
  return SEARCH_CACHE.some(cache => cache.every(({ columns, handlerIndex, term }) =>
    columns.some(
      (column) =>
      {
        if (typeof record[column] === 'undefined')
        {
          return false;
        }
        let subject = record[column];

        if (compare[handlerIndex](subject, term) === true)
        {
          return true;
        }

        if (
          typeof hooks !== 'undefined' &&
          typeof hooks[column] !== 'undefined' &&
          typeof hooks[column].format === 'function'
        )
        {
          subject = hooks[column].format({ value: subject, helper: helpers, column });
        }
        else if (
          typeof helpers !== 'undefined'
          && typeof helpers[column] !== 'undefined'
        )
        {
          subject = helpers[column][subject];
        }
        else
        {
          return false;
        }

        return compare[handlerIndex](subject, term);
      },
    )));
};

/**
 * Simple equal filter
 *
 * If value is array observe in array (alias indexOf)
 *
 * @param  {object} record
 * @param  {string} value
 * @param  {[type]} id     column
 * @return {bool}
 */
export const equal = ({ record, value, id }) =>
{
  if (value === '-1')
  {
    return true;
  }
  if (typeof value === 'object')
  {
    return value.indexOf(record[id]) !== -1;
  }
  return record[id] === value;
};


export const dateInterselection = (record, value) =>
{
  const recordDate = new Date(record.date).getTime();
  const valueDate = value.split('|');

  if (recordDate < parseInt(valueDate[0]))
  {
    return false;
  }

  if (recordDate > parseInt(valueDate[1]))
  {
    return false;
  }

  return true;
};

/**
 * [dateFrom description]
 * @param  {[type]} record [description]
 * @param  {[type]} value  [description]
 * @return {[type]}        [description]
 * @example
 * const dataModel = new Data([], {
 *   filters:
 *   [
 *     {
 *       id: 'start',
 *       handler: Filters.dateFrom,
 *       arguments: [],
 *       status: false,
 *     },
 *   ],
 * });
 */
export const dateFrom = (record, value) =>
{
  const recordDate = new Date(record.date).getTime();
  return recordDate > parseInt(value);
};

export const dateTo = (record, value) =>
{
  const recordDate = new Date(record.date).getTime();
  return recordDate < parseInt(value);
};
