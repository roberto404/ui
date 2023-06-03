
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import { withRouter } from 'react-router-dom';
import isEmpty from 'lodash/isEmpty';
import uniq from 'lodash/uniq';

import {
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

function withRouter(Component) {
  function ComponentWithRouterProp(props) {
    let location = useLocation();
    let navigate = useNavigate();
    let params = useParams();
    return (
      <Component
        {...props}
        router={{ location, navigate, params }}
      />
    );
  }

  return ComponentWithRouterProp;
}


import Form from '../form/form';

/* !- Actions */

import { validate, flush, fetchValues } from '../form/actions';
import { preload, close, modal } from '../layer/actions';

/* !- Constants */

import { FORM_ERRORS_KEY } from '../form/constants';


/**
 * Create Form object with multiple fields data.
 * If field's value same it will appear like one record (not array)
 * @param  {Array} records form records
 * @return {Object}         form value object { id: [1,2], title: [a,b], price: 100}
 * @example
 * [{ id }, { id }]
 * =>
 * { id: 1 || [1,2] }
 */
export const concatMultipleFormRecords = (records) =>
{
  const values = {};

  if (Array.isArray(records) && records.length)
  {
    Object.keys(records[0]).forEach((field) =>
    {
      values[field] = records.map(record => record[field]);

      if (values[field].every(value => value === values[field][0]))
      {
        values[field] = values[field][0];
      }
      //
      //
      // const fieldValues = uniq(records.map(i => i[field]));
      // values[field] = (fieldValues.length < 2) ? fieldValues[0] : fieldValues;
    });
  }

  return values;
};


/**
 * Form wrapper
 * building on my app logic
 *
 * 1. Fetch data via api (did mount)
 * 2. Flush data (unmount)
 * 3. After saving go back grid page
 * @type {String}
 */
class FormView extends Component
{
  // getChildContext()
  // {
  //   return {
  //     onSave: this.onSaveHandler,
  //     onDelete: this.onDeleteHandler,
  //     onCancel: this.onCancelHandler,
  //   };
  // }

  /* !- React lifecycle */

  componentDidMount = () =>
  {
    // if (this.api)
    // {
    //   this.props.fetchValues(this.api, this.id);
    // }
  }

  componentWillUnmount()
  {
    this.props.flush(this.id);
  }

  /* !- Handlers */

  // onSaveHandler = (event) =>
  // {
  //   event.preventDefault();
  //
  //   const store = this.context.store;
  //
  //   if (!this.api || !this.id || !store)
  //   {
  //     throw new Error('Api not defined.');
  //   }
  //
  //   const form = this.context.store.getState().form;
  //
  //   if (!form || !form[this.id])
  //   {
  //     return;
  //   }
  //
  //   this.props.validate(this.id);
  //
  //   const errors = form[this.id][FORM_ERRORS_KEY];
  //
  //   if (isEmpty(errors))
  //   {
  //     this.props.preload();
  //
  //     this.api({
  //       method: this.id,
  //       payload: form[this.id],
  //     })
  //       .then(() =>
  //       {
  //         this.props.history.goBack();
  //         this.props.close();
  //       });
  //   }
  // }

  // onCancelHandler = () =>
  // {
  //   this.props.history.goBack();
  // }

  // onDeleteHandler = () =>
  // {
  //   if (this.api)
  //   {
  //     this.props.preload();
  //
  //     this.api({
  //       method: 'delete',
  //     })
  //       .then(() =>
  //       {
  //         this.props.history.goBack();
  //         this.props.close();
  //       });
  //   }
  // }

  onSuccess = () =>
  {
    this.props.router.navigate(location.pathname.replace(/(.*)\/.*$/, "$1"));
  }

  onLoad = () =>
  {
    this.props.preload();

    return this.api({
      method: this.id,
    })
      .then((response) =>
      {
        if (response.status !== 'SUCCESS' || !response.records)
        {
          this.props.modal(response.modal);
          this.props.router.navigate(location.pathname.replace(/(.*)\/.*$/, "$1"), { replace: true });

          return {};
        }

        this.props.close();

        const results = { ...response.records };

        Object
          .keys(response)
          .forEach((key) =>
          {
            if (['count', 'records', 'status', 'version'].indexOf(key) === -1)
            {
              results[`_${key}`] = response[key];
            }
          });

        return results;
      });
  }


  /* !- Getters */

  get id()
  {
    return this.props.id || this.context.grid;
  }

  get api()
  {
    return this.props.api || this.context.api;
  }

  render()
  {
    return (
      <Form {...{
        onLoad: this.onLoad,
        onSuccess: this.onSuccess,
        ...this.props,
        flush: true,
      }}
      />
    );
  }
}

/**
 * propTypes
 * @type {Object}
 */
FormView.propTypes =
{
  /**
   * Api use this Id to identify the source of request
   */
  id: PropTypes.string,
  /**
   * Promise function
   * @example
   * request.get(id);
   */
  api: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.func,
  ]),
  /**
   * Form View components
   */
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(
      PropTypes.element,
    ),
    PropTypes.element,
  ]).isRequired,
  /**
   * Redux Grid Action
   * @private
   */
  validate: PropTypes.func.isRequired,
  fetchValues: PropTypes.func.isRequired,
  flush: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
  preload: PropTypes.func.isRequired,
};

/**
 * defaultProps
 * @type {Object}
 */
FormView.defaultProps =
{
  id: '',
  api: false,
  settings: {},
};

/**
 * contextTypes
 * @type {Object}
 */
FormView.contextTypes =
{
  grid: PropTypes.string,
  /**
   * Promise function
   * @example
   * ({ method, payload }) => new Promise(resolve => resolve('response'))
   *
   * // complex
   * import request from 'superagent';
   *
   * const Api = ({ method }) =>
   * {
   *   switch (method)
   *   {
   *     case 'contact':
   *       return request
   *         .post(`${API_URL}contact`)
   *         .type('form')
   *         .send(payload)
   *         .then(parseResponse)
   *         .catch(parseResponse);
   *   }
   * }
   */
  api: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.func,
  ]),
  store: PropTypes.object,
};

/**
 * childContextTypes
 * @type {Object}
 */
// FormView.childContextTypes =
// {
//   onSave: PropTypes.func,
//   onCancel: PropTypes.func,
//   onDelete: PropTypes.func,
// };


export default withRouter(connect(
  state => ({ form: state.form }),
  {
    validate,
    fetchValues,
    flush,
    close,
    preload,
    modal,
    history,
  },
)(FormView));
