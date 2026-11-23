
import slugify from '@1studio/utils/string/slugify';
import UserError from '@1studio/utils/error/userError';
import getValueByPath from '@1studio/utils/object/getValueByPath';
import getValuesByPath from '@1studio/utils/object/getValuesByPath';

const DEFAULT_COMPARE = '_default';


export const latinTextCompare = (subject, term) =>
  slugify(subject) === slugify(term);

export const weakTextCompare = (subject, term) =>
  slugify(subject).indexOf(slugify(term)) !== -1;

/**
 * Compare two string or number
 * @return boolean
 * @example
 * compare['='](a,b)
 */
export const compare = {
  [DEFAULT_COMPARE]: (subject = '', term = '') => {
    if (subject === null || typeof subject.toString === 'undefined') {
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
        .indexOf(term.toString().toLowerCase()) != -1
    );
  },

  '=': (subject, term) => (isNaN(subject) ?
    compare[DEFAULT_COMPARE](subject, term) : parseFloat(subject) === parseFloat(term)),
  '==': (subject, term) => new RegExp(`^${term}$`, 'i').exec(subject) !== null,
  '~==': (subject, term) => latinTextCompare(subject, term),
  '~=': (subject, term) => (isNaN(subject) ?
    weakTextCompare(subject, term) : parseFloat(subject) === parseFloat(term)),
  '!==': (subject, term) => new RegExp(`^${term}$`, 'i').exec(subject) === null,
  '!=': (subject, term) => compare[DEFAULT_COMPARE](subject, term) === false,
  '*=': (subject, term) => new RegExp(term).exec(subject) !== null,
  '*!=': (subject, term) => new RegExp(`^((?!${term}).)*$`).exec(subject) !== null,
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

export const OPERATOR_REGEX = `(${OPERATOR_KEYS
  .join('|')
  .replace(/(\*|\^|\$)/g, '\\$&')
  })`;

// TODO IE11 NOT WORKING
// export const OPERATOR_UNIQUE = String.prototype.concat(...new Set(OPERATOR_KEYS.join('')))
//   .replace(/\*/g, '\\$&');
export const OPERATOR_UNIQUE = "=~!\*^$><";

// attachemnt[piper]2023 <= [piper]
export const CUSTOM_OPERATOR = "[[A-Za-z öüóőúéáűí0-9]+]";

export const LOGICAL_REGEX = '[|&]{1,2}';

export const FIELD_CHARS = '0-9a-zA-ZöüóőúéáűíÖÜÓŐÚÉÁŰÍ_.';

/**
 * (field and operator)?value <=== JSON data, but we don't use ',' coma, because coma separated expression not working
 * ([ABC]+[ ]*[!=]+[ ]*)?[ABC"{}[\\].-:]+[ ,]*
 *
 * @example
 * field=1&field>2
 * //=>
 * [field = 1, field > 2]
 */
// const REGEX_QUERY_LEVEL1 = new RegExp(`([${FIELD_CHARS}]+[ ]*[${OPERATOR_UNIQUE}]+[ ]*)?[${FIELD_CHARS}"{}[\\].-:^+()*\\]+[ ,]*`, 'g');
export const REGEX_QUERY_LEVEL1 = new RegExp(`([${FIELD_CHARS}]+[ ]*[${OPERATOR_UNIQUE}]+[ ]*)?[^ ,&=><]+`, 'g');

export const isQuery = term =>
  term.match(new RegExp(`^[${FIELD_CHARS}]+[ ]*[${OPERATOR_UNIQUE}]+`, 'g')) !== null;

/**
 * 
 * @param {string} query Ex: name=Joe&age>2
 * @returns {Array} [...Array<{ field, operator, value }>]
 */
export const queryToFilters = query =>
  query
    .split('|')
    .map(filterOr =>
      filterOr
        .split('&')
        .map((filter) => {
          const match = (new RegExp(`^([${FIELD_CHARS}]+)[ ]*([${OPERATOR_UNIQUE}]+)[ ]*(.*)$`, 'g')).exec(filter);

          return ({
            field: match[1],
            operator: match[2],
            value: match[3],
          });
        })
    )


export const filterToQuery = filter =>
  filter
    .map(i => i.field + i.operator + i.value)
    .join('&');

export const filtersToQuery = filters =>
  filters
    .map(filterToQuery)
    .join('|');

/**
 * @example
 * field > 2
 * // =>
 * [field, >, 2]
 */
export const REGEX_QUERY_LEVEL2 = new RegExp(`^([${FIELD_CHARS}]+)(([${OPERATOR_UNIQUE}]{1}[!]{0,1}[=]{0,2})|([[A-Za-z öüóőúéáűí0-9]+]))(.*)$`);

let SEARCH_CACHE = [];

/**
 * the query the SEARCH_CACHE was built from: a grid filter chain can skip the
 * index 0 record (an earlier filter is false), then the cache would hold the
 * query of another search() call
 */
let SEARCH_CACHE_KEY;

/** operators of a negation: on a path through an array every value has to meet them */
const NEGATIVE_OPERATORS = ['!=', '!==', '*!='];

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
export const search = (props) => {

  const { record, value, helpers, hooks, index = 0 } = props;

  /**
   * Create SEARCH_CACHE
   * @example
   * [
   *  { columns: ['title', 'gender'], handlerIndes: '=', term: 'John' },
   *  ...
   * ]
   */
  const cacheKey = `${props.cnf ? 1 : 0}:${value}`;

  if (index === 0 || cacheKey !== SEARCH_CACHE_KEY) {
    SEARCH_CACHE_KEY = cacheKey;

    /**
     * Split OR expressions
     */
    /**
     * Terms of one OR alternative (they are joined by AND: `&`, space, comma)
     */
    const parseOr = (valueOR) => {
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
          const values = valueOR.match(REGEX_QUERY_LEVEL1) || [];

          return values.map((thisValue) => {
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
            if (termMatches) {
              term = termMatches[5];
              handlerIndex = termMatches[2];
              columns = [termMatches[1]];

              if (hooks) {
                columns = Object.keys(hooks).reduce(
                  (accumulator, column) => {
                    const subject = (typeof hooks[column] === 'string') ? hooks[column] : hooks[column].title;

                    if (compare[DEFAULT_COMPARE](subject, termMatches[1])) {
                      accumulator.push(column);
                    }
                    return accumulator;
                  },
                  [termMatches[1]],
                );
              }
            }
            else {
              columns = Object.keys(record);
            }

            return ({ columns, handlerIndex, term });
          });
        };

    /**
     * [AND group: [OR alternative: [term, ...], ...], ...]
     *
     * default: `|` splits first, the `&` terms bind stronger: a&b|c = (a AND b) OR c
     * cnf: `&` splits first, `|` inside a group: a|b&c = (a OR b) AND c, so a new
     * AND term can be appended to any query
     */
    SEARCH_CACHE = (props.cnf ? value.split('&') : [value])
      .map(groupValue => groupValue.split('|').map(parseOr).filter(i => i.length))
      .filter(group => group.length);
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
  // no term (empty query): no match, as before the AND groups
  if (!SEARCH_CACHE.length) {
    return false;
  }

  return SEARCH_CACHE.every(group => group.some(cache => cache.every(({ columns, handlerIndex, term }) =>
    columns.some(
      (column) => {

        const compareMethod = props.compare?.[handlerIndex] ? props.compare : compare;

        if (typeof compareMethod[handlerIndex] === 'undefined') {
          throw new UserError(
            'Method Not Allowed',
            {
              code: 'ui.search.compareMethod',
              dev: { handlerIndex },
            },
          );
        }

        let subject = record[column];

        /**
         * Path (products.productId, attachment.origin): arrays are walked at any
         * depth, any of the values is enough (negation: none of them)
         */
        if (column.includes('.')) {
          subject = getValueByPath(record, column);

          // the path goes through an array: every item continues the path (at any depth)
          if (typeof subject === 'undefined') {
            const values = getValuesByPath(record, column);
            const isMatch = item =>
              compareMethod[handlerIndex]?.(typeof item === 'object' ? JSON.stringify(item) : item, term, record) === true;

            // negative operator: none of the values (products.productId!==RSENG000 = no such product)
            return NEGATIVE_OPERATORS.includes(handlerIndex) ? values.every(isMatch) : values.some(isMatch);
          }
        }

        if (typeof subject === 'object') {
          subject = JSON.stringify(subject);
        }

        if (typeof subject === 'undefined') {
          return false;
        }

        if (compareMethod[handlerIndex]?.(subject, term, record) === true) {
          return true;
        }

        if (
          typeof hooks !== 'undefined' &&
          typeof hooks[column] !== 'undefined' &&
          typeof hooks[column].format === 'function'
        ) {
          subject = hooks[column].format({ value: subject, helper: helpers, column });
        }
        else if (
          typeof helpers !== 'undefined'
          && typeof helpers[column] !== 'undefined'
        ) {
          subject = helpers[column][subject];
        }
        else {
          return false;
        }

        return compareMethod[handlerIndex](subject, term, record);
      },
    ))));
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
export const equal = ({ record, value, id }) => {
  if (value === '-1') {
    return true;
  }
  if (typeof value === 'object') {
    return value.indexOf(record[id]) !== -1;
  }
  return record[id] === value;
};


export const dateInterselection = (record, value) => {
  const recordDate = new Date(record.date).getTime();
  const valueDate = value.split('|');

  if (recordDate < parseInt(valueDate[0])) {
    return false;
  }

  if (recordDate > parseInt(valueDate[1])) {
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
export const dateFrom = (record, value) => {
  const recordDate = new Date(record.date).getTime();
  return recordDate > parseInt(value);
};

export const dateTo = (record, value) => {
  const recordDate = new Date(record.date).getTime();
  return recordDate < parseInt(value);
};


/**
 * Split sring by comma and search individual more time
 *
 * @param {array} fields ['id', 'title'] searching these field of record
 */
/**
 * Split sring by comma and search individual more time
 *
 * @param {array} fields ['id', 'title'] searching these field of record
 */
export const SEARCH_MULTIPLE_HANDLER = fields => (record, terms) =>
  terms
    .split(/[,]+/g)
    .some(term =>
      term
        .split(/[ ]+/g)
        .every(word =>
          fields.some(field =>
            record[field] !== undefined
            && (record[field] || '').toString().toLowerCase().indexOf(word.toString().toLowerCase()) >= 0,
          ),
        ),
    );
