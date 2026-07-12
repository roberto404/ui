
import React, { useContext } from 'react';
import { useDispatch, useStore } from 'react-redux';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import isEqual from 'lodash/isEqual';
import { GridContext } from '../context';
import { Status, useApiContext } from '@1studio/ui/api';
import { useAppContext } from '@1studio/ui/context';


/* !- Actions */

import { setValues, unsetValues } from '../../form/actions';
import { dialog, flush, modal, preload, close } from '../../layer/actions';

import { modifyOrAddRecords } from '../actions';


/* !- React Elements */

import {
  Input,
  Select,
  Collection,
} from '../../form/intl';

import IconAdvance from '../../icon/mui/navigation/more_horiz';
import IconSearch from '../../icon/mui/action/search';
import IconEnter from '@1studio/ui/icon/mui/keyboard_return';
import Tooltip from '../../layer/tooltip';


/* !- Constants */

import {
  OPERATOR_REGEX,
  LOGICAL_REGEX,
  OPERATOR_KEYS,
  OPERATOR_UNIQUE,
  filterToQuery,
  filtersToQuery,
  CUSTOM_OPERATOR,
} from '../filters';




/* !- Types */

const defaultProps =
{
  id: 'search',
  placeholder: 'Search term',
  prefix: '',
  nested: false,
  lazyLoad: false,
};

type PropTypes = Partial<typeof defaultProps> &
{
}



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
}) => {

  /**
   * onChange => { field, operator, value }
   */
  const onChangeHandler = ({ id, value }) => {
    const collectionId = id.substring(id.indexOf('#') + 1);
    onChange({ ...record, [collectionId]: value });
  };

  const item = (fields.find(field => field.id === record.field) || {});

  /**
   * form collection pass onChange method
   */
  return (
    <div className="grid-2 w-full">
      <div className="col-4-12 flex gap-1">
        <Select
          id="search#field"
          onChange={onChangeHandler}
          data={fields}
          dataTranslate={dataTranslateFields}
          className="w-full"
          value={record.field}
        />
        {item.options !== undefined &&
          React.cloneElement(
            item.options,
            {
              className: 'w-full',
              id: 'search#options',
              onChange: onChangeHandler,
              value: record.options,
            },
          )
        }
      </div>
      <Select
        id="search#operator"
        onChange={onChangeHandler}
        data={(item.operators || operators).map(id => ({ id, title: id }))}
        dataTranslate={dataTranslateOperators}
        className="col-3-12"
        value={record.operator}
      />
      {item.field !== undefined &&
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
      {item.field === undefined &&
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
  options,
}) => {
  const onChangePropsFiltersHandler = ({ value }) => {
    if (!isEqual(value, record)) {
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
        options,
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
export const GridSearchDialog = (
  {
    id,
    fields,
    // prefix,
    draggable,
    onClick,
    nested,
  }) => {

  const prefix = '?';
  const store = useStore();

  const onClickApplyHandler = (event) => {
    event.preventDefault();

    const collection = store.getState().form[`${id}-collection`];
    const value = prefix + (nested ? filtersToQuery : filterToQuery)(collection);


    if (typeof onClick === 'function') {
      if (onClick({ collection, value }) === false) {
        return;
      };
    }

    if (value === prefix) {
      store.dispatch(unsetValues({ [id]: undefined }));
    }
    else {
      store.dispatch(setValues({ [id]: value }));
    }

    store.dispatch(flush());
  };

  let defaultValue = [{ field: fields[0].id, operator: OPERATOR_KEYS[0], value: '' }];

  if (nested) {
    defaultValue = [defaultValue];
  }

  return (
    <div className="w-640">
      <div className="mb-4 bold">Keresési feltételek:</div>
      <Collection
        id={`${id}-collection`}
        UI={nested ? NestedCollectionItem : CollectionItem}
        uiProps={{
          fields,
          draggable,
        }}
        draggable={draggable}
        value={defaultValue}
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
  nested: false,
}


/**
 * Search Filter width advance button
 */
const GridSearch = (props: PropTypes) => {

  const {
    id,
    placeholder,
    nested,
    lazyLoad,
    responseParser,
    prefix,
  } = props;

  let fields = props.fields;

  const store = useStore();
  const dispatch = useDispatch();
  const api = useApiContext();

  const { grid } = useContext(GridContext) || { grid: props.grid };
  const { addShortcuts, removeShortcuts } = useAppContext();

  if (typeof fields === 'undefined' && grid) {
    const state = store.getState().grid[grid];

    fields = []; // eslint-disable-line

    if (state && state.hook) {
      Object.keys(state.hook).forEach(field => fields.push({
        id: field,
        title: state.hook[field].title || field,
      }));
    }
    else if (state && state.rawData.length) {
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
  const onClickSearchAdvanceHandler = () => {

    const term = store.getState().form[id] || '';
    let value = [];

    if (prefix && term && term.substring(0, prefix.length) === prefix) {
      /**
      * @example
      * // name=Á&gender==male&id<10 => [{ field, operator, value }]
      */
      value = term
        .substring(prefix.length)
        .split(new RegExp(LOGICAL_REGEX))
        .filter(exp =>
          new RegExp(`^([^${OPERATOR_UNIQUE}]+)${OPERATOR_REGEX}([^${OPERATOR_UNIQUE}]*)$`).exec(exp) !== null
          || new RegExp(`(${CUSTOM_OPERATOR})(.*)$`).exec(exp) !== null
        )
        .map((exp) => {

          const matches =
            new RegExp(`^([^${OPERATOR_UNIQUE}]+)${OPERATOR_REGEX}([^${OPERATOR_UNIQUE}]*)$`).exec(exp)
            || new RegExp(`([^[]*)(${CUSTOM_OPERATOR})(.*)$`).exec(exp);

          return ({
            field: matches[1],
            operator: matches[2],
            value: matches[3],
          });
        });
    }
    else {
      value = [{ field: fields[0].id, operator: '=', value: term }];
    }

    store.dispatch(setValues({ id: `${id}-collection`, value }));
    store.dispatch(dialog(<GridSearchDialog id={id} fields={fields} prefix={prefix} nested={nested} />));
  };

  const onClickSearchHandler = async () => {

    const queryString = store.getState().form[id];

    if (!queryString) {
      return;
    }

    dispatch(preload());

    const header = {
      'Controller-QueryLimit': 1000,
      // 'Meta-Control': 'no-config',
    };

    const response = await api<[]>({
      url: `${grid}/?filter=${queryString}`,
      header,
    });

    if (response.status == Status.SUCCESS) {

      const records = responseParser ? responseParser(response) : response.records;

      dispatch(modifyOrAddRecords(records, grid));
      dispatch(close());

    } else {
      dispatch(modal(response.modal));
    }
  };

  const onFocusHandler = (payload, event) => {
    if (!lazyLoad) {
      return;
    }

    addShortcuts(
      [
        {
          keyCode: 'Enter',
          handler: onClickSearchHandler,
          description: 'Submit tag',
        },
      ],
      'enter',
    );
  }

  const onBlurHandler = () => {

    removeShortcuts('enter');
  }



  const prefixLabel = lazyLoad ?
    <IconSearch className="w-2 h-auto fill-gray flip-horizontal" />
    :
    <div className="icon embed-search-gray">Keresés</div>;

  const postfix = (
    <div className='h-center'>
      {fields.length > 0 &&
        <button onClick={onClickSearchAdvanceHandler}>
          <IconAdvance />
        </button>
      }
      {lazyLoad &&
        <Tooltip title={
          <div className='h-center'>
            <div className='light text-gray-dark'>Keresés a teljes adatbázisban</div>
            <IconEnter className="mx-1 w-3 h-2 p-1/4 px-1/2 fill-gray border border-gray rounded bg-white shadow-outer-3" />
          </div>
        }>
          <div
            onClick={onClickSearchHandler}
            className='p-2 uppercase text-xs bold pointer'
            style={{ background: '#f8d53e' }}
          >
            Keresés
          </div>
        </Tooltip>
      }
    </div>
  );

  return (
    <Input
      id={id}
      label={prefixLabel}
      placeholder={placeholder}
      postfix={postfix}
      onBlur={onBlurHandler}
      onFocus={onFocusHandler}
      autoFocus
    />
  );
};

GridSearch.defaultProps = defaultProps;

export default GridSearch;
