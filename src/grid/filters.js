
const DEFAULT_COMPARE = '_default';


export const compare = {
  [DEFAULT_COMPARE]: (subject = '', term = '') =>
  {
    if (subject === null || typeof subject.toString === 'undefined')
    {
      return false;
    }

    return (
      subject
        .toString()
        .toLowerCase()
        .indexOf(term.toString().toLowerCase()) >= 0
    );
  },

  '=': (subject, term) => parseFloat(subject) === parseFloat(term),
  '>': (subject, term) => parseFloat(subject) > parseFloat(term),
  '<': (subject, term) => parseFloat(subject) < parseFloat(term),
  '==': (subject, term) => parseFloat(subject) === parseFloat(term),
  '<=': (subject, term) => parseFloat(subject) <= parseFloat(term),
  '>=': (subject, term) => parseFloat(subject) >= parseFloat(term),
  '!=': (subject, term) => parseFloat(subject) !== parseFloat(term),
};

/**
 * Search filters handler
 *
 * parse search term (Eg.: date > '01/12/2010', userId = 22)
 * iterate record fields (alias column)
 * if column join helper use helper value to matching
 *
 * @param  {object} object {
 *  record: observe database,
 *  value: search term
 *  helper: database related value (userId:1 => 'john doe')
 *  hook: record keys i18n title or record value formatter
 *  }
 * @return {bool}
 */
export const search = ({ record, value, helpers, hooks }) =>
{
  /**
   * @example
   * field = 1, field > 2
   * value#1, value#2
   */
  const regex = /([0-9a-zA-ZöüóőúéáűíÖÜÓŐÚÉÁŰÍ]+[ ]*[!>=<]+[ ]*)?[a-zA-ZöüóőúéáűíÖÜÓŐÚÉÁŰÍ0-9./-]+[ ,]*/g;

  /**
   * Split search terms by regular expression
   * @private
   * @type {array}
   */
  const values = value.match(regex);

  /**
   * Condition every search term must have to fulfill (return true)
   */
  return values.every((thisValue) =>
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
    let term = thisValue.replace(/[ ,]/g, '');


    /**
     * @example
     * field > 2
     */
    const termRegex = /^([a-zA-ZöüóőúéáűíÖÜÓŐÚÉÁŰÍ]+)([!>=<]{1}[=]{0,1})([a-zA-ZöüóőúéáűíÖÜÓŐÚÉÁŰÍ0-9]+)$/;

    /**
     * Determine term expressions: [field] [operator] [value]
     * @type {array}
     */
    const termMatches = term.match(termRegex);

    /**
     * If term use i18n field name convert to real record keys
     * Eg.: Visit Date => vdate
     * or just 'Vis', 'Visit', 'Date'
     */
    if (termMatches)
    {
      term = termMatches[3];
      handlerIndex = termMatches[2];

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
    else
    {
      columns = Object.keys(record);
    }

    /**
     * Iterate record columns
     * Change column value if it able to join helper object
     * Transfer the converted column value (alias subject)
     * to SearchHandler which compare term and subject
     */
    return columns.some(
      (column) =>
      {
        if (typeof record[column] === 'undefined')
        {
          return false;
        }
        let subject = record[column];

        if (
          typeof hooks !== 'undefined' &&
          typeof hooks[column] !== 'undefined' &&
          typeof hooks[column].format === 'function'
        )
        {
          subject = hooks[column].format({ value: subject, helper: helpers, column });
        }

        return compare[handlerIndex](subject, term);
      },
    );
  });
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
