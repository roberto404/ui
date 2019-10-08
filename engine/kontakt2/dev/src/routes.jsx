import React from 'react';
import { Route } from 'react-router-dom';

/* !- React Elemens */

import IconProduct from './icons/product';
import IconAnalytics from '@1studio/ui/icon/mui/action/timeline';
import IconStock from '@1studio/ui/icon/mui/action/swap_vert';

/* !- App Compontents */

import Logout from '@1studio/ui/authentication/logout';
import Views from './views';

/**
 * @example
 * // => pass props to component
 *
 * const Example ({ media }) => <div>{media}</div>
 *
 * const route = {
 *  component: Example,
 *  props: {
 *    media: app.getMedia(),
 *  }
 * }
 */
export const getRoutes = app => [
  {
    path: '/category',
    component: Views.CategoryGrid,
    permission: 'category',
  },
  {
    path: '/categoryWeb/:id',
    component: Views.CategoryWebForm,
  },
  {
    path: '/categoryWeb',
    component: Views.CategoryWebGrid,
  },
  // {
  //   path: '/pricetag',
  //   component: Views.PriceTag,
  // },
  {
    path: '/product',
    title: 'product.title',
    permission: ['products'],
    icon: IconProduct,
    component: Views.ProductGrid,
  },
  {
    path: '/productWeb',
    component: Views.ProductWebGrid,
  },
  {
    path: '/productWebOutlet',
    component: Views.ProductWebOutletGrid,
  },
  {
    path: '/repair',
    component: Views.RepairGrid,
  },
  {
    path: '/stock',
    title: 'stock.title',
    component: Views.StockGrid,
    icon: IconStock,
    permission: ['stock'],
    props: {
      config: app ? app.getProjectConfig() : {},
    },
  },
  {
    path: '/website/menu',
    component: Views.WebsiteMenu,
  },
  {
    path: '/analytics',
    title: 'analytics.title',
    component: Views.Analytics,
    icon: IconAnalytics,
    permission: ['analytics'],
  },
];

/**
 * Validate user access to route
 * @param  {Object}  route
 * @param  {Object}  permission Api get when user login
 * @return {Boolean}
 */
export const isAccessGaranted = (route = {}, permission = {}) =>
{
  if (!route.permission)
{
    return true;
  }

  const permissions = !Array.isArray(route.permission) ? [route.permission] : route.permission;

  return permissions.every(p => permission[p] !== undefined);
};

/**
 * Export React-Routes
 */
export default (app, permission) =>
  [
    {
      path: '/logout',
      component: Logout,
    },
    ...getRoutes(app),
    {
      path: '*',
      component: Views.Dashboard,
    },
  ]
    .filter(route => isAccessGaranted(route, permission))
    .map(({ path, component, props }, index) => (
      <Route
        strict
        key={index} // eslint-disable-line
        path={path}
        render={() => React.createElement(component, props)}
      />
    ));