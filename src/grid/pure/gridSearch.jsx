
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import isEqual from 'lodash/isEqual';


/* !- Actions */

import { setValues, unsetValues } from '../../form/actions';
import { dialog, flush } from '../../layer/actions';


/* !- React Elements */

import {
  Input,
  Select,
  Collection,
} from '../../form/pure/intl';

import IconAdvance from '../../icon/mui/navigation/more_horiz';
import IconSearch from '../../icon/mui/action/search';


/* !- Constants */

import { OPERATOR_REGEX, LOGICAL_REGEX, OPERATOR_KEYS, OPERATOR_UNIQUE } from '../../grid/filters';


/**
 * Form Collection Item:
 * Render term of search rows on Advance Dialog
 */
export const CollectionItem = ({
  onChange,
  record,
  fields,
  operators,
  dataTranslateOperators,
  dataTranslateFields,
}) =>
{
  /**
   * onChange => { field, operator, value }
   */
  const onChangeHandler = ({ id, value }) =>
  {
    const collectionId = id.substring(id.indexOf('#') + 1);
    onChange({ ...record, [collectionId]: value });
  };

  const item = (fields.find(field => field.id === record.field) || {});

  /**
   * form collection pass onChange method
   */
  return (
    <div className="grid-2 w-full">
      <Select
        id="search#field"
        onChange={onChangeHandler}
        data={fields}
        dataTranslate={dataTranslateFields}
        className="col-4-12"
        value={record.field}
      />
      <Select
        id="search#operator"
        onChange={onChangeHandler}
        data={(item.operators || operators).map(id => ({ id, title: id }))}
        dataTranslate={dataTranslateOperators}
        className="col-3-12"
        value={record.operator}
      />
      { item.field !== undefined &&
          React.cloneElement(
            item.field,
            {
              className: 'col-5-12',
              id: 'search#value',
              onChange: onChangeHandler,
              value: record.value,
            },
          )
      }
      { item.field === undefined &&
      <Input
        id="search#value"
        className="col-5-12"
        value={record.value}
        onChange={onChangeHandler}
      />
      }
    </div>
  );
};

CollectionItem.defaultProps =
{
  fields: [],
  operators: OPERATOR_KEYS,
  dataTranslateFields: false,
  dataTranslateOperators: true,

}

export const NestedCollectionItem = ({
  record,
  index,
  id,
  onChange,
  fields,
  operators,
  dataTranslateFields,
  dataTranslateOperators,
  draggable,
}) =>
{
  const onChangePropsFiltersHandler = ({ value }) =>
  {
    if (!isEqual(value, record))
    {
      onChange(value);
    }
  }

  return (
    <Collection
      id={`${id}-${index}`}
      UI={CollectionItem}
      uiProps={{
        fields,
        operators,
        dataTranslateFields,
        dataTranslateOperators,
      }}
      draggable={draggable}
      value={record}
      onChange={onChangePropsFiltersHandler}
      className="border shadow-outer-3 p-2 rounded w-full"
    />
  )
}



/**
 * Advance Search Dialog
 */
export const GridSearchDialog = ({ id, fields, prefix, draggable }, { store }) =>
{
  const onClickApplyHandler = (event) =>
  {
    event.preventDefault();

    const collection = store.getState().form[`${id}-collection`];
    const search = prefix +
      collection
        .map(i => i.field + i.operator + i.value)
        .join('&');

    if (search === prefix)
    {
      store.dispatch(unsetValues({ [id]: undefined }));
    }
    else
    {
      store.dispatch(setValues({ [id]: search }));
    }

    store.dispatch(flush());
  };

  return (
    <div className="w-640">
      <div className="mb-4 bold">Keresési feltételek:</div>
      <Collection
        id={`${id}-collection`}
        UI={CollectionItem}
        uiProps={{
          fields,
        }}
        draggable={draggable}
        value={[{ field: fields[0].id, operator: OPERATOR_KEYS[0], value: '' }]}
      />
      <button className="primary w-auto mx-auto mb-1" onClick={onClickApplyHandler}>
        <IconSearch />
        <span>Keresés</span>
      </button>
    </div>
  );
};

GridSearchDialog.defaultProps = {
  id: 'search',
  prefix: '',
}

GridSearchDialog.contextTypes = {
  store: PropTypes.object,
};

/**
 * Search Filter width advance button
 */
const GridSearch = ({ id, fields, prefix, placeholder }, { store, grid }) =>
{
  if (typeof fields === 'undefined' && grid)
  {
    const state = store.getState().grid[grid];

    fields = []; // eslint-disable-line

    if (state && state.hook)
    {
      Object.keys(state.hook).forEach(field => fields.push({
        id: field,
        title: state.hook[field].title || field,
      }));
    }
    else if (state && state.rawData.length)
    {
      Object.keys(state.rawData[0]).forEach(field => fields.push({
        id: field,
        title: field,
      }));
    }
  }

  /**
   * setValue to form collection
   * open modal
   */
  const onClickSearchAdvanceHandler = () =>
  {
    const term = store.getState().form[id] || '';
    let value = [];

    if (prefix && term && term.substring(0, prefix.length) === prefix)
    {
      /**
      * @example
      * // name=Á&gender==male&id<10 => [{ field, operator, value }]
      */
      value = term
        .substring(prefix.length)
        .split(new RegExp(LOGICAL_REGEX))
        .filter(exp => new RegExp(`^([^${OPERATOR_UNIQUE}]+)${OPERATOR_REGEX}([^${OPERATOR_UNIQUE}]*)$`).exec(exp) !== null)
        .map((exp) =>
        {
          const matches = new RegExp(`^([^${OPERATOR_UNIQUE}]+)${OPERATOR_REGEX}([^${OPERATOR_UNIQUE}]*)$`).exec(exp);

          return ({
            field: matches[1],
            operator: matches[2],
            value: matches[3],
          });
        });
    }
    else
    {
      value = [{ field: fields[0].id, operator: '=', value: term }];
    }

    store.dispatch(setValues({ id: `${id}-collection`, value }));
    store.dispatch(dialog(<GridSearchDialog id={id} fields={fields} prefix={prefix} />));
  };

  return (
    <Input
      id={id}
      label={<div className="icon embed-search-gray">Keresés</div>}
      placeholder={placeholder}
      postfix={(
        <button onClick={onClickSearchAdvanceHandler}>
          <IconAdvance />
        </button>
      )}
    />
  );
};

GridSearch.propTypes =
{
  id: PropTypes.string,
  placeholder: PropTypes.string,
  prefix: PropTypes.string,
};

GridSearch.defaultProps =
{
  id: 'search',
  placeholder: 'Search term',
  prefix: '',
};

GridSearch.contextTypes =
{
  store: PropTypes.object,
  grid: PropTypes.string,
};

export default GridSearch;
