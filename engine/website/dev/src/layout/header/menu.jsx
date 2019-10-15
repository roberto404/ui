
import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';


/* !- React Actions */

import { popover, preload } from '@1studio/ui/layer/actions';


/* !- React Elements */

// ...


/* !- Constants */

// ...



/**
* Menu Component
*/
const Menu = ({ history }, { config, store }) =>
{

  const onClickChildrenMenu = (event) =>
  {
    const id = event.currentTarget.dataset.id;
    history.push(config.menu.getUrl(id));
  }

  const onClickParentMenu = (event) =>
  {
    const id = event.currentTarget.dataset.id;

    store.dispatch(popover(renderChildrens(id), event));
  }

  const renderChildrens = (id) =>
  {
    return (
      <div>
        { config.menu.getChildren(id).map(({ id, title }) => (
          <div>
            <div onClick={onClickChildrenMenu} data-id={id} className="pointer">{title}</div>
            {renderChildrens(id)}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="header-menu">
      <div className="wrapper">
        { config.menu.getChildren().map(({ id, title }) => (
          <div
            key={id}
            data-id={id}
            onClick={onClickParentMenu}
          >
            {title}
          </div>
        ))}
      </div>
    </div>
  );
};

Menu.contextTypes =
{
  config: PropTypes.object,
  store: PropTypes.object,
};

export default withRouter(Menu);
