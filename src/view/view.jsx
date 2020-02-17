
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import isEmpty from 'lodash/isEmpty';
import forEach from 'lodash/forEach';
import remove from 'lodash/remove';
import find from 'lodash/find';
import isEqual from 'lodash/isEqual';


/* !- Actions */

import { switchGroup, switchView, setSettings, toggleView } from './actions';
import { menu, close } from '../layer/actions';


/* !- Elements */

import IconView from '../icon/mui/av/web';

/* !- Constants */

import { SCHEME } from './constans';


const ViewMenuComponent = ({ children, views, toggleView, menu, close, className }) =>
{
  const items = views.map(({ id, status, title, icon }) => ({
    id,
    title: title || id,
    className: parseInt(status) === 1 ? 'active' : '',
    icon,
    handler: (item) =>
    {
      toggleView(item.id);
      close();
    },
  }));


  return (
    <div
      role="button"
      tabIndex="-1"
      onClick={event => menu({ items }, event)}
      className={className}
    >
      {children}
    </div>
  );
};

ViewMenuComponent.defaultProps =
{
  children: (
    <div
      className="button w-auto outline shadow embed-angle-down-gray"
    >
      <IconView />
      <span>Nézet</span>
    </div>
  ),
};

export const ViewMenu = connect(
  (state) =>
  {
    if (state.view.active !== undefined)
    {
      return {
        views: state.view.groups[state.view.active],
      };
    }
    return {
      views: [],
    };
  },
  {
    close,
    menu,
    toggleView,
  },
)(ViewMenuComponent);



/**
 * Create settings via childs
 * View constructor push this settings and active view to Redux View Store.
 *
 * If settings props not defined, automatically create group and active via children.
 * If props defined, then validate props by children
 *
 * @private
 * @return {void}
 * @example
 *
 * // => view widthout props
 * <View>
 *  <div>0</div>
 *  <div data-view="first">1</div>
 *  <div data-view={{ id: second, title: 'Second' }}>2</div>
 * </View>
 *
 * // => generated settings
 * {
 *  active: 'first',
 *  groups: [
 *    { id: '0', pos: 0, status: 1 },
 *    { id: 'first', pos: 1, status: 1 },
 *    { id: 'second', pos: 2, status: 1 },
 *  ]
 * }
 */
export const initSettings = (props) =>
{
  let settings = props.settings;

  if (!settings.groups && typeof props.children === 'object')
  {
    const children = (Array.isArray(props.children)) ?
      props.children :
      [props.children];

    const group = children.map((child, index) =>
    {
      let item = {
        id: child.props['data-view'] || index.toString(),
        status: 1,
        pos: index,
      };

      if (typeof child.props['data-view'] === 'object')
      {
        item = {
          ...item,
          ...child.props['data-view'],
        };
      }

      return item;
    });

    settings = ({
      active: '0',
      groups: {
        0: group,
      },
    });
  }
  else if (typeof settings.groups === 'object')
  {
    forEach(settings.groups, (items, groupId) =>
    {
      settings.groups[groupId] = remove(items, item =>
        (isNaN(item.id) && find(props.children, child => child.props['data-view'] === item.id)) ||
        (!isNaN(item.id) && props.children.length > parseInt(item.id)),
      );

      if (!settings.groups[groupId].length)
      {
        delete settings.groups[groupId];
      }
    });
  }

  if (!isEmpty(settings))
  {
    if (!settings.active)
    {
      settings.active = Object.keys(settings.groups)[0];
    }
  }

  return settings;
};


/**
 * Manage view component visibility, similarly tab.
 *
 * Settings: If settings props not defined, component automatically generate via childs.
 * switchGroup: change different groups
 * toggleView: toggle view group compontents (PivotTable and Grid in the data view groups)
 *
 * @example
 * <View
 *  id='sample-view'
 *  defaultView='record'
 *  settings={{
 *   groups: {
 *     data: [
 *       { id: 'PivotTable', pos: 0, status: 1 },
 *       { id: 'Grid', pos: 1, status: 1 },
 *     ],
 *     record: [
 *       { id: 'Form', pos: 0, status: 1 }
 *     ],
 *   }
 * }}
 *>
 * <PivotTable
 *   data-view="PivotTable"
 * />
 * <Grid
 *   data-view="Grid"
 * />
 * <Form
 *   data-view="Form"
 * />
 *</View>
 * >
 */
class View extends Component
{
  constructor(props, context)
  {
    super(props);

    const settings = initSettings({
      settings: this.props.settings,
      children: this.props.children,
    });

    this.props.setSettings(settings);

    if (this.props.defaultView)
    {
      this.props.switchGroup(this.props.defaultView);
    }

    this.views = this.getActiveGroupViews(context);
  }

  componentDidMount = () =>
  {
    // listen changes
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
  }

  onChangeListener()
  {
    const views = this.getActiveGroupViews();

    if (!isEqual(views, this.views))
    {
      const prev = [...this.views];
      this.views = views;

      if (this.props.onChange)
      {
        this.props.onChange(views, prev);

        // if props.OnChange modify views
        if (!isEqual(views, this.getActiveGroupViews()))
        {
          return;
        }
      }


      this.forceUpdate();
    }
  }

  getActiveGroupViews(context = this.context)
  {
    const viewState = context.store.getState().view;
    return viewState.active === undefined ? [] : viewState.groups[viewState.active];
  }


  /* !- React lifecycle */

  render()
  {
    if (this.props.children === undefined)
    {
      return <div>Child of View component not defined.</div>;
    }

    const children = (Array.isArray(this.props.children)) ?
      this.props.children :
      [this.props.children];


    return (
      <div className={this.props.className}>
        {
          this.views.reduce(
            (result, item) =>
            {
              const itemChild = children.find(
                (child, index) => item.status && (
                  (typeof child.props['data-view'] === 'undefined' && index === parseInt(item.id))
                  || (typeof child.props['data-view'] === 'object' && child.props['data-view'].id === item.id)
                  || child.props['data-view'] === item.id
                ),
              );

              if (itemChild)
              {
                result.push(itemChild);
              }
              return result;
            },
            [],
          )
        }
      </div>
    );
  }
}

/**
 * propTypes
 * @type {Object}
 */
View.propTypes =
{
  /**
   * Child elements of View component
   */
  children: PropTypes.arrayOf(
    PropTypes.element,
  ).isRequired,
  defaultView: PropTypes.string,
  settings: SCHEME.settings,
  className: PropTypes.string,
  /**
   * Invoke every view changes
   * @param {Object} nextViews next view state
   * @param {Object} prevViews prev view state
   * @example
   * (next, prev) => next.forEach(({ id, status }) =>
   * {
   *   // this view not changed and active
   *   if (status && prev.find(i => i.id === id).status === status)
   *   {
   *     store.dispatch(toggleView(id)); // hide other views
   *   }
   * });
   */
  onChange: PropTypes.func,
};

/**
 * defaultProps
 * @type {Object}
 */
View.defaultProps =
{
  defaultView: '',
  settings: {},
  className: '',
};

/**
 * contextTypes
 * @type {Object}
 */
View.contextTypes =
{
  store: PropTypes.object,
};

export default connect(
  null,
  // (state) =>
  // {
  //   if (state.view.active !== undefined)
  //   {
  //     return {
  //       views: state.view.groups[state.view.active],
  //     };
  //   }
  //   return {
  //     views: [],
  //   };
  // },
  {
    switchGroup,
    setSettings,
    toggleView,
  },
)(View);
