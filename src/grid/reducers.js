// @flow

import Data from '@1studio/utils/models/data';
import findIndex from 'lodash/findIndex';
import omit from 'lodash/omit';
import PropTypes, { checkPropTypes } from '@1studio/utils/propType';

import { addRecord } from './actions';

/* !- React Elements */

/**
 * Create Grid State object from Data model
 * @param  {data} dataModel
 * @return {object}
 */
const createStateFromModel = dataModel =>
({
  model: dataModel,
  rawData: dataModel.data,
  data: dataModel.paginate.results,
  results: dataModel.results,
  orderColumn: dataModel.order.column,
  orderDirection: dataModel.order.direction,
  page: dataModel.paginate.page,
  totalPage: dataModel.paginate.totalPage,
  filters: dataModel.filters,
});

/**
 * Create next Grid State;
 * @param  {object} currentState
 * @param  {object|Data} nextGridState not complete state, only affected grid idea
 * @param  {string} gridId
 * @return {object}               new state
 */
const createNextState = (currentState, nextGridState, gridId) =>
{
  let next = nextGridState;

  if (nextGridState instanceof Data)
  {
    next = createStateFromModel(nextGridState);
  }

  if (gridId)
  {
    return {
      ...currentState,
      [gridId]: {
        ...currentState[gridId],
        ...next,
      },
    };
  }

  return {
    ...currentState,
    ...next,
  };
};

const getModel = (state, action) =>
{
  if (!action.grid && state.model)
  {
    return state.model;
  }
  else if (action.grid && state[action.grid] && state[action.grid].model)
  {
    return state[action.grid].model;
  }

  // todo???
  // solution like APPLY_GRID_FILTER
  // van ilyen eset h applyFilter lefut de meg nincs model, ures {} nem lehet
  // console.warn('not found grid Model');
  // return {};

  return new Data([]);
}


/**
 * Grid Redux Reducers
 * @param  {Object} [state={}]
 * @param  {Object} action
 * @return {Object}            state
 */
const reducers = (state = {}, action = {}) =>
{
  switch (action.type)
  {
    case 'SET_GRID_DATA':
      {
        const model = getModel(state, action);

        if (!model.data)
        {
          return state;
        }

        model.data = action.data || [];

        return reducers(
          createNextState(state, model, action.grid),
          { ...action, type: 'SET_SETTINGS' },
        );
      }

    case 'ADD_GRID_RECORD':
      {
        const model = getModel(state, action);

        if (!model)
        {
          return reducers(state, { type: 'SET_GRID_DATA', data: [action.record], grid: action.grid });
        }

        if (typeof action.record !== 'object' || Array.isArray(action.record))
        {
          // @todo exception
        }

        const index = (typeof action.index !== 'undefined') ? action.index : model.data.length;

        model.data = [
          ...model.data.slice(0, index),
          {
            id: model.data.length + 1,
            ...action.record,
          },
          ...model.data.slice(index),
        ];
        //
        // model.data = [
        //   ...model.data,
        //   {
        //     id: model.data.length + 1,
        //     ...action.record,
        //   },
        // ];

        return createNextState(state, model, action.grid);
      }

    case 'ADD_GRID_RECORDS':
      {
        const model = getModel(state, action);

        if (!model)
        {
          return reducers(state, { type: 'SET_GRID_DATA', data: [action.record], grid: action.grid });
        }

        const data = [...model.data];
        const ids = data.map(({ id }) => id);

        action.records.forEach((record) =>
        {
          const index = ids.indexOf(record.id);

          if (index === -1)
          {
            data.push(record);
          }
          else
          {
            data[index] = record;
          }
        });

        model.data = data;

        return createNextState(state, model, action.grid);
      }

    case 'MODIFY_GRID_RECORD':
      {
        // @todo record.id;
        const model = getModel(state, action);
        const index = findIndex(model.data, { id: action.record.id });

        if (index !== -1)
        {
          const record = {
            ...model.data[index],
            ...action.record,
          };

          const data = [...model.data];
          data[index] = record;

          model.data = data;
        }
        else if (action.options.enableAddReacord)
        {
          return reducers(state, addRecord(action.record, action.grid));
        }

        return createNextState(state, model, action.grid);
      }

    case 'MODIFY_GRID_RECORDS':
      {
        // @todo record.id;
        const model = getModel(state, action);

        const data = action.records.reduce(
          (result, record) =>
          {
            const index = findIndex(result, { id: record.id });

            const nextRecord = {
              ...result[index],
              ...record,
            };

            result[index] = record;

            return result;
          },
          [...model.data],
        );

        model.data = data;

        return createNextState(state, model, action.grid);
      }

    case 'REMOVE_GRID_RECORD':
      {
        // @todo record.id;
        const model = getModel(state, action);
        model.data = model.data.filter(record => record.id !== action.record.id);

        return createNextState(state, model, action.grid);
      }

    case 'SET_SETTINGS':
      {
        // @todo check action settings type
        // hook, helper, paginate, order, filters

        const model = getModel(state, action) || new Data([]);

        if (action.settings)
        {
          if (action.settings.paginate)
          {
            model.paginate = action.settings.paginate;
          }

          if (action.settings.order)
          {
            model.order = action.settings.order;
          }

          if (action.settings.filters)
          {
            model.filters = action.settings.filters;
          }
        }

        const next = createStateFromModel(model);

        if (action.settings && action.settings.hook)
        {
          next.hook = action.settings.hook;
        }

        if (action.settings && action.settings.helper)
        {
          next.helper = action.settings.helper;
        }

        return createNextState(state, next, action.grid);
      }

    case 'CHANGE_GRID_ORDER':
      {
        const model = getModel(state, action);

        // @todo column props? v a model ellenőrzi?

        if ( typeof action.order === 'string')
        {
          model.order = { column: action.order };
        }
        else
        {
          model.order = action.order;
        }

        return createNextState(state, model, action.grid);
      }

    case 'GO_TO_GRID_PAGE':
      {
        const model = getModel(state, action);

        model.paginate = { page: action.page };

        return createNextState(state, model, action.grid);
      }

    case 'MODIFY_GRID_PAGINATE_LIMIT':
      {
        const model = getModel(state, action);

        model.paginate = { limit: action.limit };

        return createNextState(state, model, action.grid);
      }

    case 'APPLY_GRID_FILTER':
      {
        const model = getModel(state, action);

        if (model)
        {
          model.filters = action.filters;
          return createNextState(state, model, action.grid);
        }
      }

    case 'DETACH_GRID_FILTER':
      {
        const model = getModel(state, action);

        if (model)
        {
          const filters = model.filters;

          const index = findIndex(filters, { id: action.filterId });

          if (index === -1)
          {
            return state;
          }

          if (
            typeof action.filterValue !== 'undefined' &&
            Array.isArray(filters[index].arguments[0])
            )
            {
              const valueIndex = filters[index].arguments[0].indexOf(action.filterValue);

              if (valueIndex > -1)
              {
                filters[index].arguments[0].splice(valueIndex, 1);
              }
            }
            else
            {
              filters[index].arguments = [];
            }

            return reducers(
              state,
              { ...action, filters, type: 'APPLY_GRID_FILTER' },
            );
        }
      }

    case 'FLUSH_GRID':
      {
        if (action.grid)
        {
          return omit(state, action.grid);
        }

        return {};
      }
  }

  return state;
};

export default reducers;
