
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import isEqual from 'lodash/isEqual';
import forEach from 'lodash/forEach';
import getParam from '@1studio/utils/location/getParam';
import { concatMultipleFormRecords } from './form';


/* !- Actions */

import { fetchData, setData, applyFilter, flush } from '../grid/actions';
import * as FormActions from '../form/actions';
import { preload, close, modal } from '../layer/actions';


/* !- Constants */

import { PROPTYPES } from '@1studio/utils/models/data';
import { FORM_PREFIX } from '../grid/constants';




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
class GridView extends Component
{
  constructor(props)
  {
    super(props);
    this.ref = 'grid';
    this.formPrevState = {};
    this.gridPrevSelectedItemIds = [];
  }

  getChildContext()
  {
    return {
      grid: this.id,
    };
  }

  /* !- React lifecycle */

  componentWillMount = () =>
  {
    if (this.settings)
    {
      this.props.setData([], this.settings, this.id);

      // if (
      //   this.context.addListener &&
      //   this.settings.filters.findIndex(filter => filter.id === 'search') !== -1
      // )
      // {
      //   this.context.addListener('keydown', (e) => console.log(e));
      // }
    }
  }

  componentDidMount = () =>
  {
    // fetch data via api
    if (this.api)
    {
      this.props
        .fetchData(this.onLoad, this.id, this.settings, this.id)
        .then((action) =>
        {
          const grid = this.context.store.getState().grid[this.id];

          if (this.props.onLoad)
          {
            if (typeof this.props.onLoad === 'function')
            {
              this.props.onLoad({ action, grid });
            }
            else
            {
              switch (this.props.onLoad)
              {
                case 'selectFirst':
                  this.props.setValues({ id: FORM_PREFIX + this.id, value: [grid.data[0].id] });
                  break;
                default:
              }
            }
          }
        });
    }

    (this.settings.filters || []).forEach((filter) =>
    {
      if (filter.status === true)
      {
        this.props.setValues({ id: filter.id, value: filter.arguments[0] });
      }
    });

    // get param and apply filter
    const request = getParam();

    forEach(request, (value, param) => this.props.applyFilter(param, [value], this.id));

    // listen form changes
    if (this.context.store)
    {
      this.unsubscribe = this.context.store.subscribe(() => this.onChangeListener());
    }
  }

  componentWillUnmount()
  {
    if (this.unsubscribe)
    {
      this.unsubscribe();
    }

    // register settings
    // this.context.register.add({
    //   [`grid.${this.id}`]: this.context.store.getState().grid[this.id].model.getSettings(),
    // });

    if (this.context.register)
    {
      this.context.register.remove(this.id);
    }

    this.props.flush(this.id);
  }

  /* !- Handlers */

  onLoad = () =>
  {
    if (!this.props.onLayer)
    {
      this.props.preload();
    }

    return this.api({
      method: this.id,
    })
      .then((response) =>
      {
        if (!this.props.onLayer)
        {
          if (response.modal)
          {
            this.props.modal(response.modal);
          }
          else
          {
            this.props.close();
          }
        }

        if (response.status !== 'SUCCESS' || response.records)
        {
          if (response.config)
          {
            this.context.register.add({ [this.id]: response.config });

            this.props.settings.helper = response.config;

            return {
              data: response.records,
              settings: { helper: response.config },
            };
          }
          return response.records;
        }

        return {};
      });
  }

  /* !- Listeners */

  /**
   * Invoke applyFilter grid action, when the form state change
   * @private
   */
  onChangeForm()
  {
    const formState = this.context.store.getState().form;
    const filters = [];
    const gridFilters = (this.context.store.getState().grid[this.id] || {}).filters || [];

    if (!gridFilters.length || isEqual(this.formPrevState, formState))
    {
      return;
    }

    gridFilters.forEach((filter) =>
    {
      const index = filter.id;

      if (typeof formState[index] !== 'undefined' || typeof this.formPrevState[index] !== 'undefined')
      {
        if (!isEqual(this.formPrevState[index], formState[index]))
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

    this.formPrevState = { ...formState };

    if (filters.length)
    {
      this.props.applyFilter(filters, null, this.id);
    }
  }

  /**
   * Invoke form setValues when grid selection changes
   */
  onChangeSelectedGridItems()
  {
    /**
     * @example
     * ['1L01120060012', ...]
     */
    const gridSelectedItemIds = this.context.store.getState().form[FORM_PREFIX + this.id] || [];

    if (isEqual(this.gridPrevSelectedItemIds, gridSelectedItemIds))
    {
      return;
    }

    this.gridPrevSelectedItemIds = gridSelectedItemIds;

    const gridData = this.context.store.getState().grid[this.id].rawData;

    // find selected items records
    const gridSelectedRecords = gridData.filter(({ id }) => gridSelectedItemIds.indexOf(id) !== -1);

    //   this.props.flushForm(this.id);
    //
    this.props.setValues(
      concatMultipleFormRecords(gridSelectedRecords),
      this.id,
    );
  }

  onChangeListener()
  {
    this.onChangeForm();
    this.onChangeSelectedGridItems();
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

  get settings()
  {
    if (!this.context.register || !this.context.register.data[`grid.${this.id}`])
    {
      return this.props.settings || this.context.settings;
    }

    return ({
      ...(this.props.settings || this.context.settings),
      ...this.context.register.data[`grid.${this.id}`],
    });
  }

  render()
  {
    return <div id={this.props.id} className={this.props.className}>{this.props.children}</div>;
  }
}

/**
 * propTypes
 * @type {Object}
 */
GridView.propTypes =
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
   * Grid settings: hook, helper, paginate, order, filters
   */
  settings: PropTypes.shape({
    hook: PropTypes.objectOf(
      PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({
          title: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.element,
          ]).isRequired,
          format: PropTypes.func,
          icon: PropTypes.element,
          status: PropTypes.number,
        }),
      ]),
    ),
    helper: PropTypes.object,
    paginate: PROPTYPES.paginate,
    order: PROPTYPES.order,
    filters: PROPTYPES.filters,
  }),
  /**
   * Grid View components
   */
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(
      PropTypes.element,
    ),
    PropTypes.element,
  ]).isRequired,
  /**
   * Invoke when data loaded
   */
  onLoad: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.bool,
    PropTypes.oneOf(['selectFirst']),
  ]),
  /**
   * Wrappper dom class name
   */
  className: PropTypes.string,
  /**
   * Redux Grid Action
   * @private
   */
  fetchData: PropTypes.func.isRequired,
  /**
   * Redux Grid Action
   * @private
   */
  setData: PropTypes.func.isRequired,
  /**
   * Redux Grid Action
   * @private
   */
  applyFilter: PropTypes.func.isRequired,
  /**
   * Redux Grid Action
   * @private
   */
  flush: PropTypes.func.isRequired,
  /**
   * Redux Layer Action
   * @private
   */
  preload: PropTypes.func.isRequired,
  /**
   * Redux Layer Action
   * @private
   */
  modal: PropTypes.func.isRequired,
  /**
   * Redux Layer Action
   * @private
   */
  close: PropTypes.func.isRequired,
};

/**
 * defaultProps
 * @type {Object}
 */
GridView.defaultProps =
{
  id: '',
  api: false,
  settings: {},
  onLayer: false,
  onLoad: false,
  className: 'grid',
};

/**
 * contextTypes
 * @type {Object}
 */
GridView.contextTypes =
{
  form: PropTypes.string,
  store: PropTypes.object,
  api: PropTypes.func,
  grid: PropTypes.string,
  settings: PropTypes.object,
  register: PropTypes.object,
};

/**
 * childContextTypes
 * @type {Object}
 */
GridView.childContextTypes = {
  grid: GridView.propTypes.id,
};


export default connect(
  null,
  {
    fetchData,
    setData,
    applyFilter,
    preload,
    modal,
    close,
    flush,
    setValues: FormActions.setValues,
    flushForm: FormActions.flush,
  },
)(GridView);