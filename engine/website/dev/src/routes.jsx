import React from 'react';
import { Route } from 'react-router-dom';
import capitalizeFirstLetter from '@1studio/utils/string/capitalizeFirstLetter';


/* !- React Elemens */



/* !- App Compontents */

import Logout from '@1studio/ui/authentication/logout';
import Views from './views';


/**
 * Static predefined routes: Ex. /favourites
 *
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
    path: '/kosar',
    component: Views.Cart,
  },
  {
    path: '/kedvencek',
    component: Views.Favourites,
  },
  {
    path: '/termekek/:sku',
    component: Views.Product,
    props: {
      config: app ? app.getProjectConfig() : {},
    },
  },
  {
    path: '/termekek',
    component: Views.ProductGrid,
  },
  // {
  //   path: '/stock',
  //   component: Views.StockGrid,
  //   props: {
  //     config: app ? app.getProjectConfig() : {},
  //   },
  // },
];

/**
 * Static route patterns
 */
const REWRITE_RULES = {
  '.*-[0-9]+$': 'Product',
};

const reWriteRoutes = ({ config, match }) =>
{
  const menu = config.menu;
  const path = match.url;

  const index = Object.keys(REWRITE_RULES).find(regexp => path.match(new RegExp(regexp)) !== null);

  if (index && Views[REWRITE_RULES[index]])
  {
    return React.createElement(Views[REWRITE_RULES[index]], { match, config });
  }

  /**
   * Menu Slug
   */
  let menuProps = (menu.getItem(path) || {}).props;

  if (menuProps)
  {
    menuProps = JSON.parse(menuProps);

    const children = menuProps
      .filter(({ modul }) => Views[capitalizeFirstLetter(modul)] !== undefined)
      .map(({ title, subTitle, modul, props }, i) => (
        <div key={i}>
          { title &&
            <div className="wrapper heavy text-xxl">{title}</div>
          }
          { subTitle &&
          <div className="wrapper" style={{ paddingTop: '0' }}>{subTitle}</div>
          }
          {
            React.createElement(Views[capitalizeFirstLetter(modul)], props)
          }
        </div>
      ));

    return <div>{children}</div>;
  }


  /**
   * Not Found
   */
  return React.createElement(Views.Product, { config, match });
};


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
      component: reWriteRoutes,
      props: {
        config: app.getProjectConfig(),
      },
    },
  ]
    .filter(route => isAccessGaranted(route, permission))
    .map(({ path, component, props }, index) => (
      <Route
        strict
        key={index} // eslint-disable-line
        path={path}
        render={({ match }) => React.createElement(component, { ...props, match })}
      />
    ));
