import React, { useContext, useEffect, useState, ReactElement, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import { switchGroup, addSettings, removeSettings, toggleView } from './actions';
import { SCHEME } from './constans';

import { useComponentWillUnmount, useComponentWillMount } from '../hooks';

type ViewProps = {
  children: ReactElement | ReactElement[];
  defaultView?: string;
  settings?: typeof SCHEME.settings;
  className?: string;
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
  onChange?: (nextViews: any, prevViews: any) => void;
  lazyload?: boolean;
  nested?: boolean;
};

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
export const initSettings = (props: { settings: any; children: ReactElement | ReactElement[] }) => {

  let settings = { ...props.settings };

  if (!settings.groups && typeof props.children === 'object') {
    const children = Array.isArray(props.children) ? props.children : [props.children];

    const group = children.map((child, index) => {
      let item = {
        id: child.props['data-view'] || index.toString(),
        status: parseInt(child.props['data-view-status'] || 1),
        pos: index,
      };

      if (typeof child.props['data-view'] === 'object') {
        item = {
          ...item,
          ...child.props['data-view'],
        };
      }

      return item;
    });

    settings = {
      active: '0',
      groups: {
        0: group,
      },
    };
  }

  if (!isEmpty(settings)) {
    if (!settings.active) {
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
const View: React.FC<ViewProps> = ({
  children,
  defaultView = '',
  settings: initialSettings = {},
  className = '',
  onChange,
  lazyload = true,
  nested = false,
}) => {

  const dispatch = useDispatch();
  const viewState = useSelector((state) => state.view, isEqual);
  const previousViewsRef = useRef<any[]>([]);

  const settings = initSettings({ settings: initialSettings, children });

  useComponentWillMount(() => {
    dispatch(addSettings(settings));

    if (defaultView) {
      dispatch(switchGroup(defaultView));
    }
  });

  useComponentWillUnmount(() => {
    dispatch(removeSettings(settings));
  });

  // Handle onChange logic using useRef
  useEffect(() => {
    const currentViews = getActiveViews();

    // Ha az onChange definiálva van, és a nézetek megváltoztak
    if (onChange && !isEqual(currentViews, previousViewsRef.current)) {
      const prevViews = previousViewsRef.current;
      previousViewsRef.current = currentViews;
      onChange(currentViews, prevViews);
    }
  }, [viewState]);


  const getActiveViews = () => {

    if (nested) {
      return viewState.groups;
    }

    return viewState.active === undefined ? [] : viewState.groups[viewState.active] || [];
  };

  const getGroupViews = (group: string) => {
    return viewState.groups[group];
  };

  const getFilteredChildren = (view = [], childrenArray: ReactElement[] = []) => {

    const filteredChildren = Array.isArray(childrenArray) ? childrenArray : [childrenArray];

    return view.reduce((result: ReactElement[], item: any) => {
      /**
       * Filter all dom child by status and data-view
       * @type {array} child elements
       */
      const childElements = filteredChildren.filter(
        (child, index) =>
          (item.status || !lazyload) &&
          typeof child !== 'string' &&
          (
            (typeof child.props['data-view'] === 'undefined' && index === parseInt(item.id)) ||
            (typeof child.props['data-view'] === 'object' && child.props['data-view'].id === item.id) ||
            child.props['data-view'] === item.id
          )
      );

      if (childElements.length) {
        let newResult: ReactElement[] = [];

        if (!lazyload) {
          newResult.push(
            childElements.map((child, n) => (
              <div key={n} className={item.status ? '' : 'hidden'}>{child}</div>
            ))
          );
        } else {
          newResult.push(childElements[0]);
        }

        if (nested && getGroupViews(item.id)) {
          newResult = newResult.map((child) => ({
            ...child,
            props: {
              ...child.props,
              children: getFilteredChildren(getGroupViews(item.id), child.props.children),
            },
          }));
        }

        result.push(...newResult);
      }

      return result;
    }, []);
  };



  if (!children) {
    return <div>Child of View component not defined.</div>;
  }

  const activeViews = getActiveViews();
  const views = nested ? activeViews[Object.keys(activeViews)[0]] : activeViews;
  const childrenArray = Array.isArray(children) ? children : [children];

  return <div className={className}>{getFilteredChildren(views, childrenArray)}</div>;
};

export default View;
