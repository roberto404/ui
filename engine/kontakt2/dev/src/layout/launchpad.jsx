import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  NavLink,
} from 'react-router-dom';

import { FormattedMessage } from 'react-intl';
import { getRoutes, isAccessGaranted } from '../routes';


/* !- Actions */

import { close } from '@1studio/ui/layer/actions';

/**
 * Launchpad
 */
const Launchpad = ({
  close,
  permission,
}) =>
{
  const onClickNavLinkHandler = () =>
  {
    close();
  };

  return (
    <div className="launchpad">
      <div className="menu">
        {
          getRoutes()
            .filter(route => route.icon && route.title && isAccessGaranted(route, permission))
            .map(({ path, icon, title }) => (
              <NavLink
                key={path}
                to={path}
                onClick={onClickNavLinkHandler}
                className="item"
              >
                <i>{React.createElement(icon)}</i>
                <FormattedMessage id={title} />
              </NavLink>
            ))
        }
      </div>
    </div>
  );
};

Launchpad.propTypes = {
  permission: PropTypes.object, // eslint-disable-line
  close: PropTypes.func.isRequired,
};

Launchpad.defaultProps = {
  permission: {},
};


export default connect(
  ({ user }) =>
  ({
    permission: user.permission,
  }),
  {
    close,
  },
)(Launchpad);
