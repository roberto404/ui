
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';


/* !- Actions */

import { switchView } from './actions';


/* !- Elements */

import View from './view';
import IconNext from '../icon/mui/navigation/arrow_forward';


/* !- Constants */

// ...


const ViewTabNavigation = ({
  direction,
  className,
  label,
  views,
  onClick,
  switchView,
}) =>
{
  const getIndex = () =>
    views.findIndex(({ status }) => !!status);

  const getNextIndex = () =>
  {
    const index = getIndex();

    let nextIndex = index + direction;

    if (nextIndex >= views.length)
    {
      nextIndex = 0;
    }
    else if (nextIndex < 0)
    {
      nextIndex = views.length - 1;
    }

    return nextIndex;
  }


  const props = {
    direction,
    className,
    views,
    index: getIndex(),
    nextIndex: getNextIndex(),
  };

  const onClickHandler = (event) =>
  {
    event.preventDefault();
    switchView(views[getNextIndex()].id);

    if (onClick)
    {
      onClick(props);
    }
  };

  return (
    <div
      className={className}
      onClick={onClickHandler}
    >
      { typeof label === 'function' ? label(props) : label }
    </div>
  );
}

ViewTabNavigation.defaultProps =
{
  id: '',
  direction: 1,
  className: 'button outline',
  label: <IconNext className="w-1 h-1" />,
}

ViewTabNavigation.propTypes =
{
  id: PropTypes.string,
  direction: PropTypes.oneOf([1, -1]),
  className: PropTypes.string,
  label: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
  ]),
}

export default connect(
  ({ view }, { id }) =>
  {
    if (view.active !== undefined)
    {
      return {
        views: view.groups[id || view.active],
      };
    }
    return {
      views: [],
    };
  },
  {
    switchView,
  },
)(ViewTabNavigation);
