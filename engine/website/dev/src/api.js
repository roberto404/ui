import request from 'superagent';
import forEach from 'lodash/forEach';
import mapValues from 'lodash/mapValues';
import reduce from 'lodash/reduce';


/* !- Constants */

import
{
  // FORM_ERRORS_KEY,
  FORM_SCHEME_KEY,
}
from '@1studio/ui/form/constants';

const API_URL = '/api/v3/';


/**
 * Response Parser, every api request respond call this
 * @param  {Object} response
 * @param  {Object} injections  intl: injected React Intl, history: injected React Router
 * @return {Object}          Modal format: { title, content }
 */
const parseResponse = (response, injections = {}) =>
{
  const intl = injections.intl;
  const history = injections.history;

  const res = (response.response) ? response.response : response;

  /**
   * 500 Internal Server Error
   */
  if (res.status >= 500 || typeof res.body === 'undefined' || res.body === null)
  {
    const title = 'Átmeneti hiba történt.';
    const content = 'Hiba javításán dolgozunk, kérjünk néhány perc múlva próbálja meg újra, ha a hiba továbbra is fennáll, úgy lépjen velünk kapcsoltaban. Köszönjük!';

    res.body =
    {
      modal: { title, content, classes: 'error' },
    };

    if (res instanceof Error)
    {
      console.error(res); // eslint-disable-line
    }
  }

  /**
   * 401 Unauthorized Client
   * 403 Forbidden
   * ...
   */
  else if (res.status >= 400 && res.status < 500)
  {
    if (history)
    {
      history.push('/logout');
    }
    else
    {
      location.href = '/logout';
    }
  }

  /**
   * Create User Response Modal
   */
  if (res.body.message)
  {
    if (intl)
    {
      res.body.modal =
      {
        title: intl.formatMessage({
          id: res.body.code,
          defaultMessage: res.body.message,
        }),
      };
    }
    else
    {
      res.body.modal =
      {
        title: res.body.message,
        content: res.body.more,
      };
    }

    res.body.modal.classes = res.body.status.toLowerCase();
  }

  /**
   * Application logic hooks
   *
   * - null to undefined
   * - Grid is an Array, form is an Object
   */
  if (res.body.records)
  {
    /**
     * Tranform null field to undefined, because you can apply React.defaultProps
     * record = {
     *  field: null,
     * }
     * // =>
     * record = {
     *  field: undefined,
     * }
     */
    const reducerNullToUndefined = (results = {}, value, field) =>
    {
      const nextResults = results;

      nextResults[field] = (value === null) ? undefined : value;
      return nextResults;
    };

    // iterate array object [record, record ...]
    const reducerForArray = (results, record) =>
    {
      results.push(reduce(record, reducerNullToUndefined, {}));
      return results;
    };

    // Grid is an Array, form is an Object
    const isArray = Array.isArray(res.body.records);

    res.body.records = reduce(
      res.body.records,
      isArray ? reducerForArray : reducerNullToUndefined,
      isArray ? [] : {},
    );
  }

  return res.body;
};


const stringify = (value) =>
{
  switch (typeof value)
  {
    case 'string':
      return value;

    case 'object':
      return !value ? '' : JSON.stringify(value);

    case 'boolean':
      return (+value).toString();

    default:
      return (value !== undefined && typeof value.toString !== 'undefined') ? value.toString() : '';
  }
};

/**
 * Convert payload object items string
 * @param  {Object} payload { id: 1, flag: [1, 2]}
 * @return {Object}         { id: "1", flag: "[1,2]" }
 */
const payloadStringify = (payload) =>
{
  const results = {};

  forEach(payload, (value, index) =>
  {
    results[index] = stringify(value);
  });

  return results;
}

/**
 * Add static token to Payload and remove not necessary items
 * @param  {Object} payload
 * @return {Object}         payload
 */
const payloadInjection = (payload) =>
{
  payload.token = 'pOIfdu4s';
  delete payload[FORM_SCHEME_KEY];

  return payload;
}

/**
 * Send payload to API
 * @param {Object|String} [options={}] { payload, method }
 * @param {Object} injections   { intl, history }
 */
const Api = (options = {}, injections) =>
{
  let payload = options.payload;
  const path = location.pathname.replace(/^\/(.*)/, '$1');
  let url = API_URL + path;

  const method = (typeof options === 'string') ? options : options.method || 'get';
  // const settings = options.settings || {};

  const parser = response => parseResponse(response, injections);

  if (options.payload)
  {
    payload = payloadInjection(payloadStringify(options.payload));

    // const isMultipleRecords = Array.isArray(options.payload.id);

    // payload = payloadInjection(mapValues(options.payload, (value) =>
    // {
    //   if (isMultipleRecords && Array.isArray(value))
    //   {
    //     return value.map(v => stringify(v));
    //   }
    //
    //   return stringify(value);
    // }));

    // forEach(options.payload, (value, index) =>
    // {
    //   switch (typeof value)
    //   {
    //     case 'string':
    //       payload[index] = value;
    //       break;
    //
    //     case 'object':
    //       payload[index] = JSON.stringify(value);
    //       break;
    //
    //     default:
    //       payload[index] = (value !== undefined && typeof value.toString !== 'undefined') ? value.toString() : '';
    //   }
    // });
    //
    // payload.token = 'pOIfdu4s';
    // delete payload[FORM_SCHEME_KEY];

    if (
      options.payload.id
      && !/[0-9]$/.exec(location.pathname) // hook, if form visible on Layer
    )
    {
      // try
      // {
        // hook, multiple edit
        // url += `/${payload.id.join(',')}`;
      //
      //   const editedPayload = {};
      //
      //   forEach(payload, (value, field) =>
      //   {
      //     try
      //     {
      //       const parsedValue = JSON.parse(value);
      //       if (!Array.isArray(parsedValue))
      //       {
      //         throw new Error();
      //       }
      //     }
      //     catch (e)
      //     {
      //       editedPayload[field] = value;
      //     }
      //   });
      //
      //   payload = editedPayload;
      // }
      // catch (e)
      // {
        url += `/${options.payload.id}`;
      // }
    }
  }





  switch (method)
  {
    case 'login':
      return request
        .post(`${API_URL}user/login`)
        .type('form')
        .send(payload)
        .then(response => response.body)
        .catch(parser);

    case 'logout':
      return request
        .get(`${API_URL}user/logout`)
        .then(response => response.body);

    case 'switchAccount':
      return request
        .post(`${API_URL}user/switchAccount`)
        .type('form')
        .send(payload)
        .then(parser)
        .catch(parser);

    case 'delete':
      return request
        .del(url)
        .type('form')
        .send(payload)
        .then(parseResponse)
        .catch(parseResponse);

    case 'productMatching':
      return request
        .get(`${API_URL}/stock/match`)
        .then(parseResponse)
        .catch(parseResponse);


    default:
      if (!payload)
      {
        return request
          .get(url)
          .then(parseResponse)
          .catch(parser);
      }


      const results = [];

      /**
       * Multiple request
       * @param  {integer} index Index of payload's records
       * @return {request}
       */
      const sendFormRequest = index =>
        request
          .post(`${API_URL + path}/${options.payload.id[index]}`)
          .type('form')
          .send(
            payloadInjection(
              payloadStringify(
                mapValues(options.payload, (value) =>
                {
                  if (Array.isArray(value) && typeof value[index] !== 'undefined')
                  {
                    return stringify(value[index]);
                  }

                  return stringify(value);
                }),
            )),
          )
          .then((response) =>
          {
            const parsedResponse = parser(response);

            results.push(parsedResponse.records);

            if (options.payload.id[index + 1])
            {
              return sendFormRequest(index + 1);
            }

            return { ...parsedResponse, records: results };
          })
          .catch(parser);


      if (Array.isArray(options.payload.id))
      {
        return sendFormRequest(0);
      }

      // Simple one request possibly multiple records.
      return request
        .post(url)
        .type('form')
        .send(payloadInjection(payloadStringify(options.payload)))
        .then(parser)
        .catch(parser);
  }
};

export default Api;
