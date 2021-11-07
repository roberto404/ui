
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import isEmpty from 'lodash/isEmpty';
import forEach from 'lodash/forEach';
import remove from 'lodash/remove';
import find from 'lodash/find';
import isEqual from 'lodash/isEqual';


/* !- Actions */

import { switchGroup, switchView, addSettings, removeSettings, toggleView } from './actions';



/* !- Elements */

// ...

/* !- Constants */

import { SCHEME } from './constans';





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
  let settings = { ...props.settings };

  if (!settings.groups && typeof props.children === 'object')
  {
    const children = (Array.isArray(props.children)) ?
      props.children :
      [props.children];

    const group = children.map((child, index) =>
    {
      let item = {
        id: child.props['data-view'] || index.toString(),
        status: parseInt(child.props['data-view-status'] || 1),
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
    // forEach(settings.groups, (items, groupId) =>
    // {
      // nested miatt ertelmetlen
      // settings.groups[groupId] = remove(items, item =>
      //   (isNaN(item.id) && find(props.children, child => child.props['data-view'] === item.id)) ||
      //   (!isNaN(item.id) && props.children.length > parseInt(item.id)),
      // );
      //
      // if (!settings.groups[groupId].length)
      // {
      //   delete settings.groups[groupId];
      // }
    // });
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

    this.settings = initSettings({
      settings: this.props.settings,
      children: this.props.children,
    });;

    this.props.addSettings(this.settings);

    if (this.props.defaultView)
    {
      this.props.switchGroup(this.props.defaultView);
    }

    this.views = this.getActiveViews(context);
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

    this.props.removeSettings(initSettings({
      settings: this.props.settings,
      children: this.props.children,
    }));
  }

  onChangeListener()
  {
    const views = this.getActiveViews();

    if (!isEqual(views, this.views))
    {
      const prev = [...this.views];
      this.views = views;

      if (this.props.onChange)
      {
        this.props.onChange(views, prev);

        // if props.OnChange modify views
        if (!isEqual(views, this.getActiveViews()))
        {
          return;
        }
      }

      this.forceUpdate();
    }
  }

  /**
   * Returns active view group items
   * @param  {object} [context=this.context]
   * @return {array} views of group
   * @example
   * [{ id, pos, title, children, status }]
   */
  getActiveViews(context = this.context)
  {
    const viewState = context.store.getState().view;

    if (this.props.nested)
    {
      return viewState.groups;
    }

    return viewState.active === undefined ? [] : viewState.groups[viewState.active] || [];
  }

  getGroupViews(group)
  {
    const viewState = this.context.store.getState().view;
    return viewState.groups[group];
  }

  getFilteredChildren = (view = [], children = []) =>
  {
    if (!Array.isArray(children) && typeof children === 'object')
    {
      children = [children];
    }

    if (!Array.isArray(view) || !Array.isArray(children))
    {
      return [];
    }

    return view.reduce(
      (result, item) =>
      {
        /**
         * Filter all dom child by status and data-view
         * @type {array} child elements
         */
        const itemChildren = children.filter(
          (child, index) =>
            (item.status || !this.props.lazyload)
            && typeof child !== 'string'
            && 
            (
              (typeof child.props['data-view'] === 'undefined' && index === parseInt(item.id))
              || (typeof child.props['data-view'] === 'object' && child.props['data-view'].id === item.id)
              || child.props['data-view'] === item.id
            ),
        );

        if (itemChildren.length)
        {
          let newResult = [];

          // not lazyload
          if (this.props.lazyload === false)
          {
            newResult.push(itemChildren.map((child, n) => <div key={n} className={item.status ? '' : 'hidden'}>{child}</div>))
          }
          // lazyload
          else
          {
            newResult.push(itemChildren[0]);
          }

          // nested
          if (this.props.nested && this.getGroupViews(item.id))
          {
            newResult = newResult.map(child =>
            {
              const filteredChildren =
                this.getFilteredChildren(this.getGroupViews(item.id), child.props.children);

              return ({
                ...child,
                props: {
                  ...child.props,
                  children: filteredChildren,
                },
              });
            })
          }

          result.push(...newResult);
        }

        return result;
      },
      [],
    )
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

    const views = this.props.nested ? this.views[Object.keys(this.settings.groups)[0]] : this.views;

    return (
      <div className={this.props.className}>
        {
          this.getFilteredChildren(views, children)
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
  lazyload: PropTypes.bool,
  nested: PropTypes.bool,
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
  lazyload: true,
  nested: false,
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
  {
    switchGroup,
    addSettings,
    removeSettings,
    toggleView,
  },
)(View);
