
import React, { useMemo, useContext, useEffect, useRef, createContext } from 'react';
import { useDispatch, useSelector, ReactReduxContext } from 'react-redux';
import { useAppContext } from '../context';
import isEqual from 'lodash/isEqual';
import forEach from 'lodash/forEach';
import isEmpty from 'lodash/isEmpty';
import getParam from '@1studio/utils/location/getParam';
import { concatMultipleFormRecords } from './form';


/* !- Context */

import { GridContext } from '../grid/context';



/* !- Actions */

import { fetchData, setData, applyFilter, flush } from '../grid/actions';
import { setValues, unsetValues, setForm, flush as flushForm } from '../form/actions';
import { preload, close, modal } from '../layer/actions';


/* !- Constants */

import { PROPTYPES } from '@1studio/utils/models/data';
import { FORM_PREFIX } from '../grid/constants';
import { FORM_SCHEME_KEY } from '../form/constants';


/* !- Types */

const defaultProps =
{
  id: '',
  api: undefined,
  settings: {},
  onLayer: false,
  onLoad: false,
  onChange: false,
  className: 'grid',
  flushFiltersUnmount: true,
  style: {},
  fetchPreload: false,
};

type PropTypes = Partial<typeof defaultProps> & {
  /**
   * Api use this Id to identify the source of request
   */
  id: string,
  /**
   * Promise function
   * @example
   * request.get(id);
   */
  api: boolean | void,
  /**
   * Grid settings: hook, helper, paginate, order, filters
   */
  settings: {},
  /**
   * Grid View components
   */
  children: JSX.Element | JSX.IntrinsicElements,
  /**
   * Invoke when data loaded
   */
  onLoad: void | boolean | 'selectFirst',
  /**
   * Invoke when data loaded
   */
  onChange: boolean | void,
  /**
   * Wrappper dom class name
   */
  className: string,
  /**
   * Classic style
   */
  style: {},
  /**
   * flush filter form store when componentWillUnmount
   */
  flushFiltersUnmount: boolean,
  /**
   * Redux Grid Action
   * @private
   */
  fetchData: void,
  /**
   * Redux Grid Action
   * @private
   */
  setData: void,
  /**
   * Redux Grid Action
   * @private
   */
  applyFilter: void,
  /**
   * Redux Grid Action
   * @private
   */
  flush: void,
  /**
   * Redux Layer Action
   * @private
   */
  preload: void,
  /**
   * Redux Layer Action
   * @private
   */
  modal: void,
  /**
   * Redux Layer Action
   * @private
   */
  close: void,
  responseParser: void,
  fetchPreload: boolean,
}



// TODO connected action call unconnected format (no need dispatch)

/**
 * Automatically execute some predefined event methods.
 * Every methods use the [Grid] Redux Store.
 *
 * 1. Create Grid-Redux Data model by props|context id and settings (will mount)
 * 2. Fetch data via api (did mount)
 * - start preload
 * - call api({ method = id }) then retrieving { status: 'SUCCESS', records: [] }
 * - api set data
 * - if not success or not found records, then show modal
 *
 * 3. Automatically apply grid filter, when [Form Store] change
 * 4. Flush Grid-Redux (unmount)
 *
 * @example
 * 1. Create
 *
 * <GridView id="sample" settings={{ paginate: { limit: 10 }}} />
 *
 * // => store.grid.sample.model
 *
 * @example
 * 2. Load
 * const fakeApi = ({ method }) =>
 *  new Promise(resolve => resolve({ status: 'SUCCESS', records: fakeData }))
 *
 * <GridView id="sample" api={fakeApi} />
 *
 * // => store.grid.sample.rawData === fakeData
 *
 * @example
 * 2. Add hook to load
 *
 * <GridView api={() => api().then(onLoad)}
 *
 * // => onLoad can transform api response. It has return { status, records } or { modal }
 *
 * @example
 * 3. Auto filter
 *
 * <GridView>
 *  <GridDate id="visit" />
 *  <Connect UI={Grid} />
 * </GridView>
 *
 */
export const Grid = ({
  id,
  api,
  fetchPreload,
  onLayer,
  query,
  header,
  onLoad,
  settings,
  onSelect,
  responseParser,
  flushFiltersUnmount,
  onWillUnmount,
  className,
  style,
  children,
}: PropTypes) =>
{
  const dispatch = useDispatch();
  const { store } = useContext(ReactReduxContext);
  const context = useAppContext();

  const selectedItemIdsRef = useRef([]);
  const formStateRef = useRef([]);


  /* !- Getters */

  const getId = () => id;

  const getApi = () =>
    api || context.api;


  const getSettings = () =>
  {
    let nextSettings = { ...settings };

    // @todo context.register
    // if (!context.register || !context.register.data[`grid.${getId()}`])
    // {
    //   nextSettings = settings || settings;
    // }
    // else
    // {
    //   nextSettings = {
    //     ...(settings || settings),
    //     ...register.data[`grid.${this.id}`],
    //   };
    // }

    const form = store.getState().form;

    if (settings.filters)
    {
      settings.filters.forEach(({ id }, index) =>
      {
        if (form[id] !== undefined)
        {
          settings.filters[index].arguments = [form[id]];
          settings.filters[index].status = true;
        }
      });
    }

    return nextSettings;
  }

    /* !- Listeners */

  /**
   * Invoke applyFilter grid action, when the form state change
   * @private
   */
  const onChangeForm = () =>
  {
    const formState = store.getState().form;
    const filters = [];
    const gridFilters = (store.getState().grid[getId()] || {}).filters || [];

    if (!gridFilters.length || isEqual(formStateRef.current, formState))
    {
      return;
    }

    gridFilters.forEach((filter) =>
    {
      const index = filter.id;

      if (typeof formState[index] !== 'undefined' || typeof formStateRef.current[index] !== 'undefined')
      {
        if (!isEqual(formStateRef.current[index], formState[index]))
        {
          const thisArgs = formState[index] ? [formState[index]] : [];

          filters.push({
            id: index,
            arguments: thisArgs,
            status: !isEqual(thisArgs, []),
          });
        }
      }
    });

    formStateRef.current = { ...formState };

    if (filters.length)
    {
      dispatch(applyFilter(filters, null, getId()));
    }
  }

  /**
   * Invoke form setValues when grid selection changes
   */
  const onChangeSelectedGridItems = () =>
  {
    /**
     * @example
     * ['1L01120060012', ...]
     */
    const gridSelectedItemIds = store.getState().form[FORM_PREFIX + getId()] || [];

    if (isEqual(selectedItemIdsRef.current, gridSelectedItemIds))
    {
      return;
    }

    selectedItemIdsRef.current = gridSelectedItemIds;

    const gridData = store.getState().grid[getId()].rawData;

    // find selected items records
    const gridSelectedRecords = gridData.filter(({ id }) => gridSelectedItemIds.indexOf(id) !== -1);


    if (onSelect)
    {
      if (!onSelect(gridSelectedItemIds, gridSelectedRecords))
      {
        return;
      }
    }

    const records = concatMultipleFormRecords(gridSelectedRecords);

    // keep sceme to reset form
    const scheme = (store.getState().form[getId()] || {})[FORM_SCHEME_KEY];

    if (scheme)
    {
      records[FORM_SCHEME_KEY] = scheme;
    }

    dispatch(setForm(records, getId()));
  }

  /* !- React lifecycle */

  /**
   * ComponentWillMount:
   * Load Redux grid settings
   */
  useMemo(
    () =>
    {
      const settings = getSettings();
      
      if (!isEmpty(settings))
      {
        dispatch(setData([], settings, getId()));
      }
    },
    [],
  );

  // componentDidMount, componentWillUnmount
  useEffect(
    () =>
    {
      // componentDidMount

      // fetchDataViaApi();

      (getSettings().filters || []).forEach((filter) =>
      {
        if (filter.status === true)
        {
          dispatch(setValues({ id: filter.id, value: filter.arguments[0] }));
        }
      });

      // get param and apply filter
      const request = getParam();

      forEach(request, (value, param) => dispatch(applyFilter(param, [value], getId())));


      // componentWillUnmount
      return () =>
      {
        if (flushFiltersUnmount)
        {
          const grid = store.getState().grid[getId()];
    
          if (grid !== undefined)
          {
            const values = grid.filters.reduce((ids, { id }) => ({ ...ids, [id]: undefined }), {});

            dispatch(unsetValues(values));
          }
        }
    
        dispatch(flush(getId()));
        dispatch(unsetValues({ id: FORM_PREFIX + getId() }));
        dispatch(unsetValues({ id: getId() }));
    
        if (typeof onWillUnmount === 'function')
        {
          onWillUnmount();
        }

      };
    },
    [],
  );

  // componentWillReceiveProps
  useEffect(
    () =>
    {
      fetchDataViaApi();
    },
    [api],
    )


  // invoke every redux change
  useSelector((state) =>
  {
    onChangeForm();
    onChangeSelectedGridItems();
  });



  /* !- Handlers */

  const onLoadHandler = (isPreloaded = false) => () =>
  {
    if (!onLayer)
    {
      dispatch(preload());
    }

    return getApi()({
      method: getId(),
      query: isPreloaded ? 'preload' : query,
      header: header,
    })
      .then((response) =>
      {
        if (!onLayer)
        {
          if (response.modal)
          {
            dispatch(modal(response.modal));
          }
          else if (store.getState().layer.method === 'preload')
          {
            dispatch(close());
          }
        }

        if (response.status !== 'SUCCESS' || response.records)
        {
          const settings = { helper: response.config };

          if (typeof responseParser === 'function')
          {
            const parsedResponse = responseParser(response);

            if (typeof parsedResponse === 'object' && !Array.isArray(parsedResponse))
            {
              return parsedResponse;
            }
            else
            {
              return {
                data: parsedResponse,
                settings,
              }
            }
          }

          return {
            data: response.records,
            settings,
          };
        }

        return {};
      });
  }


  /**
   * Invoke Grid fetchData action via api
   */
  const fetchDataViaApi = (isPreloaded = fetchPreload) =>
  {
    if (getApi())
    {
      dispatch(fetchData(
        onLoadHandler(isPreloaded),
        getId(),
        getSettings(),
        getId(),
      ))
      .then((action) =>
      {
        if (isPreloaded)
        {
          fetchDataViaApi(false);
        }
        else if (onLoad)
        {
          const grid = store.getState().grid[getId()];

          if (typeof onLoad === 'function')
          {
            onLoad({ action, grid });
          }
          else
          {
            switch (onLoad)
            {
              case 'selectFirst':
                if (grid.data[0])
                {
                  dispatch(setValues({ id: FORM_PREFIX + getId(), value: [grid.data[0].id] }));
                }
                break;
              default:
            }
          }
        }
      });
    }
  }

  const gridContext = {
    grid: id,
  };

  return (
    <div
      id={id}
      className={className}
      style={style}
    >
      <GridContext.Provider value={gridContext}>
        {children}
      </GridContext.Provider>
    </div>
  );
}


Grid.defaultProps = defaultProps;


export default Grid;

