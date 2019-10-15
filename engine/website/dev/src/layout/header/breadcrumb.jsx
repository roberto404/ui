
import React from 'react';
import PropTypes from 'prop-types';
import { withRouter, NavLink } from 'react-router-dom';


/* !- React Actions */

import { popover, preload } from '@1studio/ui/layer/actions';


/* !- React Elements */

import IconArrow from '@1studio/ui/icon/mui/navigation/expand_more';


/* !- Constants */

// ...



/**
* Breadcrumb Component
*/
const Breadcrumb = ({ history, location }, { config, store }) =>
{
  let path = location.pathname;
  let menuItem = {};
  const pathRest = [];

  while (path !== '')
  {
    menuItem = config.menu.getItem(path);

    if (menuItem)
    {
      path = '';
    }
    else
    {
      const index = path.lastIndexOf('/');

      pathRest.push(path.substring(index + 1));
      path = path.substring(0, index);
    };
  }

  const breadcrumb = [{ id: 0, title: 'Kezdőlap', url: '/' }];

  if (menuItem)
  {
    breadcrumb.concat(
      (config.menu.getBreadcrumb(menuItem.id) || [])
    )

    breadcrumb[0].title = 'Kezdőlap';
    breadcrumb[0].id = '0';
  }

  // breadcrumb.concat(pathRest.map((item, index) => ({ id: `r-${index}`, title: item, })))
  //
  // console.log(menuItem, pathRest);

  const onClickBreadCrumbHandler = event =>
    history.push(event.currentTarget.dataset.url);

  return (
    <div className="flex text-s">
      { breadcrumb.map(({ id, title, url }, index) => (
        <div className="h-center" key={id}>
          <div className="light pointer" onClick={onClickBreadCrumbHandler} data-url={url}>{title}</div>
          { index < breadcrumb.length - 1 &&
          <IconArrow className="rotate-270 w-2 h-2 fill-gray-dark" />
          }
        </div>
      ))}
      { pathRest.length > 0 &&
      <div className="h-center">
        <IconArrow className="rotate-270 w-2 h-2 fill-gray-dark" />
        <div className="bold">{pathRest.join(',')}</div>
      </div>
      }
    </div>
  );
};

Breadcrumb.contextTypes =
{
  config: PropTypes.object,
  store: PropTypes.object,
};

export default withRouter(Breadcrumb);
