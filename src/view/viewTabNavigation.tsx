
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import isEqual from 'lodash/isEqual';


/* !- Actions */

import { switchView } from './actions';

/* !- Selectors */

import { getViewGroup } from './reducers';


/* !- Elements */

import IconNext from '../icon/mui/navigation/arrow_forward';


/* !- Constants */

// ...


/* !- Types */

const defaultProps =
{
  direction: 1,
  className: 'button outline',
  label: <IconNext className="w-1 h-1" />,
}

type PropTypes = {
  /**
   * default use active tab, but id defined which group should be affected
   */
  id?: string,
  direction: 1 | -1,
  label: string | React.FC,
  onClick?: ({}) => void,
} & typeof defaultProps;




const ViewTabNavigation = ({
  id,
  direction,
  className,
  label,
  onClick,
}: PropTypes) =>
{
  const dispatch = useDispatch();

  const views = useSelector(
    getViewGroup(id),
    (a, b) => isEqual(a, b),
  );


  /* !- Getters */

  const getActiveViewIndex = () =>
    views.findIndex(({ status }) => !!status);

  const getNextViewIndex = () =>
  {
    const index = getActiveViewIndex();

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
    index: getActiveViewIndex(),
    nextIndex: getNextViewIndex(),
  };


  /* !- Handler */

  const onClickHandler = (event: React.MouseEvent<HTMLElement>) =>
  {
    event.preventDefault();

    const nextViewId = views[getNextViewIndex()]?.id;

    if (nextViewId)
    {
      dispatch(switchView(nextViewId));
    }

    if (typeof onClick === 'function')
    {
      onClick(props);
    }
  };

  // csak ha az aktiv vagy idval megadott tabok valtoznak pl status
  console.log('render ViewTabNavigation', views)

  if (!views.length)
  {
    return <div />
  }

  return (
    <div
      className={className}
      onClick={onClickHandler}
    >
      { typeof label === 'function' ? label(props) : label }
    </div>
  );
}

ViewTabNavigation.defaultProps = defaultProps;


export default ViewTabNavigation;