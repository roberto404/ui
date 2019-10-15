
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';


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
export const CollectionItem = ({ onChange, record, fields }) =>
{
  const onChangeHandler = ({ id, value }) =>
  {
    onChange({ ...record, [id]: value });
  };

  /**
   * form collection pass onChange method
   */
  return (
    <div className="grid-2">
      <Select
        id="field"
        onChange={onChangeHandler}
        data={fields}
        dataTranslate={false}
        className="col-4-12"
        value={record.field}
      />
      <Select
        id="operator"
        onChange={onChangeHandler}
        data={OPERATOR_KEYS.map(id => ({ id, title: id }))}
        dataTranslate={false}
        className="col-3-12"
        value={record.operator}
      />
      <Input
        id="value"
        className="col-5-12"
        value={record.value}
        onChange={onChangeHandler}
      />
    </div>
  );
};

/**
 * Advance Search Dialog
 */
const GridSearchDialog = ({ fields, prefix }, { store }) =>
{
  const onClickApplyHandler = (event) =>
  {
    event.preventDefault();

    const collection = store.getState().form.searchCollection;
    const search = prefix +
      collection
        .map(i => i.field + i.operator + i.value)
        .join('&');

    if (search === prefix)
    {
      store.dispatch(unsetValues({ search: undefined }));
    }
    else
    {
      store.dispatch(setValues({ search }));
    }

    store.dispatch(flush());
  };

  return (
    <div className="w-640">
      <div className="mb-4 bold">Keresési feltételek:</div>
      <Collection
        id="searchCollection"
        UI={CollectionItem}
        uiProps={{
          fields,
        }}
        value={[{ field: fields[0].id, operator: OPERATOR_KEYS[0], value: '' }]}
      />
      <button className="primary w-auto mx-auto mb-1" onClick={onClickApplyHandler}>
        <IconSearch />
        <span>Keresés</span>
      </button>
    </div>
  );
};

GridSearchDialog.contextTypes = {
  store: PropTypes.object,
};

/**
 * Search Filter width advance button
 */
const GridSearch = ({ fields, prefix, placeholder }, { store, grid }) =>
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
    const term = store.getState().form.search || '';
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

    store.dispatch(setValues({ id: 'searchCollection', value }));
    store.dispatch(dialog(<GridSearchDialog fields={fields} prefix={prefix} />));
  };

  return (
    <Input
      id="search"
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
  placeholder: PropTypes.string,
  prefix: PropTypes.string,
};

GridSearch.defaultProps =
{
  placeholder: 'Search term',
  prefix: '',
};

GridSearch.contextTypes =
{
  store: PropTypes.object,
  grid: PropTypes.string,
};

export default GridSearch;
