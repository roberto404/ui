
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
            typeof record[field] !== undefined
            && record[field].toString().toLowerCase().indexOf(word.toString().toLowerCase()) >= 0,
          ),
        ),
    );


export default {
  search: {
    id: 'search',
    handler: SEARCH_MULTIPLE_HANDLER(['id', 'title']),
    arguments: [],
    status: false,
  },
};
