
import React, { Component, useState, useEffect, useMemo, useRef } from 'react';
import { useDispatch, useStore, useSelector } from 'react-redux';
import isEmpty from 'lodash/isEmpty';
import forEach from 'lodash/forEach';
import remove from 'lodash/remove';
import find from 'lodash/find';
import isEqual from 'lodash/isEqual';


/* !- Actions */

import { switchGroup, switchView, addSettings, removeSettings, toggleView } from './actions';

import { getActiveViews } from './reducers';


/* !- React Elements */

// ...

/* !- Constants */

// ...





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



/* !- Types */

type SettingsType = {
  active?: string,
  groups: {
    [key: string]: {
      id: string,
      status: 0 | 1,
      pos?: number,
      title?: string | React.FC,
    }[],
  }
}

const defaultProps = {
  /**
   * If false, every content will be rendered only css visibility changes
   */
  lazyload: true,
  nested: false,
  className: '',
};

type PropTypes = typeof defaultProps & {
  settings: SettingsType,
  /**
   * Determine default group. When mounting switch to group
   */
  defaultView?: string,
  onChange?: (next: {}, prev: {}, isChanged: boolean) => void, // @todo view State object
  children: JSX.Element | JSX.Element[],
};


/**
 * Manage view component visibility, similarly tab.
 * Component automatically generate via childs or use settings
 */
export const View = ({
  settings,
  defaultView,
  lazyload,
  nested,
  className,
  onChange,
  children,
}: PropTypes) =>
{
  const viewRef = useRef(null);

  const dispatch = useDispatch();
  const store = useStore();

  const activeViews = useSelector(
    getActiveViews({ nested }),
    (oldValue, newValue) =>
    {
      let isChanged = isEqual(viewRef.current, newValue) === false;

      if (isEqual(viewRef.current, newValue) === false)
      {
        viewRef.current = newValue;
      }

      if (isChanged && typeof onChange === 'function')
      {
        // if props.OnChange modify views
        isChanged = onChange(newValue, oldValue, isChanged) || isChanged;
      }

      return !isChanged;
    },
  );

  // componentWillMount => constructor
  useMemo(
    () =>
    {
      console.log('componentWillMount');

      dispatch(addSettings(
        initSettings({
          settings,
          children,
        })
      ));

      if (defaultView !== undefined)
      {
        dispatch(switchGroup(defaultView));
      }

    },
    [],
  );


  // componentDidMount, componentWillUnmount
  useEffect(
    () =>
    {
      console.log('componentDidMount', 1111);

      return () =>
      {
        console.log('componentWillUnmount', 222);

        dispatch(removeSettings(initSettings({
          settings,
          children,
        })));
      };
    },
    [],
  );


  const getGroupViews = (group) =>
  {
    const viewState = store.getState().view;
    return viewState.groups[group];
  }

  const getFilteredChildren = (view = [], children = []) =>
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
            (item.status || !lazyload)
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
          if (lazyload === false)
          {
            newResult.push(itemChildren.map((child, n) => <div key={n} className={item.status ? '' : 'hidden'}>{child}</div>))
          }
          // lazyload
          else
          {
            newResult.push(itemChildren[0]);
          }

          // nested
          if (nested && getGroupViews(item.id))
          {
            newResult = newResult.map(child =>
            {
              const filteredChildren =
                this.getFilteredChildren(getGroupViews(item.id), child.props.children);

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

  // const views = nested ? viewRef.current[Object.keys(settingsRef.current.groups)[0]] : viewRef.current;

  const views = nested ? activeViews[0] : activeViews;

  console.log(views);

  // console.log('render', views, nested);

  return (
    <div className={className}>
      {
        getFilteredChildren(views, children)
      }
    </div>
  )
}

View.defaultProps = defaultProps;


export default View;
