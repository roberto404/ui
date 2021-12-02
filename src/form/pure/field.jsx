import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';



/* !- React Elements */

import * as Fields from "../pure";



/* !- Constants */

import { FORM_PREFIX } from '../../grid/constants';

export const FIELDS = {
  id: {
    id: "id",
    label: ""
  },
  title: {
    id: "title",
    label: "Hivatkozási név"
  },
  options: {
    id: "options",
    label: "Érték"
  },
  guide: {
    id: "guide",
    label: "Leírás"
  }
};


export const DEFAULT_FIELD_PROPS = 
{
  integer:
  {
    component: 'Input',
    type: 'number',
    regexp: '[0-9]*',
  },
  boolean:
  {
    component: 'Toggle',
  },
  keyValue:
  {
    component: 'Collection',
    label: '',
    fields:
    {
      key:
      {
        component: "Input",
        label: "Kulcs",
        value: "",
      },
      value:
      {
        component: "Input",
        label: "Érték",
        value: "",
      }
    }
  }
}



/**
 * Create Items for Collection
 * 
 * @example
 {
  "component": "Collection",
  "label": "",
  "fields": {
    "title": {
      "component": "Input",
      "label": "Megnevezés",
      "value": ""
    },
    "url": {
      "component": "Input",
      "label": "Web cím",
      "value": ""
    }
  }
 }
 */
const CollectionItem = (props) => ({ onChange, record, index }) =>
{
  const onChangeHandler = ({ id, value }) =>
  {
    const collectionId = id.substring(id.indexOf('#') + 1);
    onChange({ ...record, [collectionId]: value });
  };

  const fields = props.fields;
  const ids = Object.keys(fields);

  return (
    <div className="grid-2 w-full">
      {
        ids.map(id => {
          return React.createElement(
            Fields[fields[id].component],
            {
              key: `${FIELDS.options.id}-${index}#${id}`,
              id: `${FIELDS.options.id}-${index}#${id}`,
              value: record[id],
              className: `col-1-${ids.length}`, // todo
              onChange: onChangeHandler,
              ...props,
            }
          )
        })
      }
    </div>
  );
};

/**
 * Form field for Options
 *  
 * @example
  {
    component: 'Input',
    type: 'number',
    regexp: '[0-9]*',
  },
 */
const Field = (props) =>
{
  let fieldProps = { ...(DEFAULT_FIELD_PROPS[(props.component || '').toString()] || props) };

  const { component } = fieldProps;

  if (component && Fields[component])
  {
    if (component === 'Collection')
    {
      const fields = fieldProps.fields;

      fieldProps.UI = CollectionItem({ ...fieldProps });
      fieldProps.value = Object.keys(fields).reduce((result, v) => ({ ...result, [v]: fieldProps.fields[v].value }), {});
      fieldProps.label = (
        <div className="pr-4">
          { props.label &&
          <div className="pb-2">{props.label}</div>
          }
          <div className="grid-2">
            { Object.keys(fields).map(field => (
              <div key={field} className={`col-1-${Object.keys(fields).length} text-gray`}>{fields[field].label}</div>
            ))}
          </div>
        </div>
      )
    }

    return React.createElement(
      Fields[component],
      {
        ...FIELDS.options,
        ...fieldProps,
      }
    )
  }

  return <div />
};

/**
 * If you use a grid to select Field keys
 * 
 * @example
 * 
 * [field] = {
 *  key1: [1,2...n]
 *  key2: n,
 *  ...
 * }
 */
const JsonField = ({ fieldId, value, fieldProps, formId, id }, { store }) =>
{
  const field = typeof fieldProps === 'function' ?
    fieldProps(fieldId) : fieldProps.find(fields => fields.id === fieldId) || {};

  const currentValue = (value || {})[fieldId];

  return (
    <Field
      {...field}
      id="props"
      format={value => ({ ...store.getState().form[formId][id], [field.id]: value }) }
      stateFormat={value => (value ? value[field.id] : currentValue) || field.initValue || []}
    />
  );
}

JsonField.contextTypes = {
  store: PropTypes.object,
}

export const FieldConnectToGrid = connect(
  ({ form }, { id, formId }) =>
  ({
    fieldId: (form[`${FORM_PREFIX}${id}`] || [])[0],
    value: form[formId][id]
  })
)(JsonField);


export default Field;

