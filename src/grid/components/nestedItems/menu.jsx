
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';


/* !- React Elements */

import IconArrow from '../../../icon/mui/navigation/expand_more';


const Badge = ({ title, className, textClassName }) =>
(
  <div
    className={classNames({
      'absolute text-center': true,
      [className]: true,
    })}
    style={{ left: '3.6rem', top: '0.3rem', zIndex: 1 }}>
    <div
      className={classNames({
        "rounded-l bold": true,
        [textClassName]: true,
      })}
      style={{ minWidth: '1.5em', padding: '0.25em' }}
    >
      {title}
    </div>
  </div>
);

Badge.defaultProps = 
{
  className: 'text-s',
  textClassName: 'text-white bg-red-dark'
}

const Value = ({ title, className, textClassName }) =>
(
  <div
    className={classNames({
      'text-center': true,
      [className]: true,
    })}
  >
    <div
      className={classNames({
        "rounded-l bold": true,
        [textClassName]: true,
      })}
      style={{ minWidth: '1.5em', padding: '0.25em' }}
    >
      {title}
    </div>
  </div>
);


Value.defaultProps = 
{
  className: 'text-s',
  textClassName: 'text-gray-dark bg-gray-light',
}

/**
 * [Parent description]
 */
const Parent = ({ level, icon, title, active, onClick, children, badge, minimalized }) =>
{
  const parentClass = classNames({
    'p-1 pointer': true,
    'bg-white-light rounded-m mb-1 shadow': active
  });

  const iconClass = classNames({
    'w-3 h-3 ': true,
    'fill-gray': !active,
    'fill-blue-dark': active,
  });

  const titleClassName = classNames({
    'grow text-black pl-2': true,
    'text-black': active,
    'text-gray-dark': !active,
  });

  const arrowClass = classNames({
    'w-2 h-2': true,
    'fill-gray rotate-270': !active,
    'fill-black': active,
  });

  return (
    <div className={parentClass} onClick={onClick}>
      <div className="p-1 pr-0 h-center relative">
        {
        React.createElement(
          icon || (p => <div {...p} />),
          {
            className: iconClass,
            style: { minWidth: '3rem' },
          },
        )
        }

        { !active && badge > 0 &&
        <Badge title={badge} className={minimalized ? 'text-xs' : 'text-s'} />
        }

        { !minimalized &&
        <div className={titleClassName}>{title}</div>
        }

        <IconArrow
          className={arrowClass}
          style={{ transition: 'all 0.2s ease-out' }}/>
      </div>

      {/* children */}
      { active === true &&
      <div className="pt-1">
        {children}
      </div>
      }
    </div>
  );
}


const Menu = (Tree, onClick, props = {}) => ({ index, children, level, items }) =>
{
  const minimalized = props.minimalized || false;

  const id = index.substring(1);
  const item = Tree.getItem(id);
  const active = item.active === true || Tree.getChildren(id).some(({ active }) => active === true);

  const onClickHandler = () => (item.onClick || onClick)({
    id,
    item,
    active,
    level,
  });

  if (children && children.length && level < 1)
  {
    return (
      <Parent
        level={level}
        title={item.title}
        active={active}
        icon={item.icon}
        onClick={onClickHandler}
        badge={item.badge || (active === false && Tree.getChildren(id).filter(({ badge }) => badge).length)}
        minimalized={minimalized}
      >
        {children}
      </Parent>
    );
  }

  // when no children
  const className = classNames({
    'p-1 h-center pointer relative': true,
    'px-2 pr-1': level === 0,
    'rounded bg-blue-dark': active,
  });

  const iconClassName = classNames({
    // '': true,
    'w-3 h-3': level === 0,
    'px-1/2 w-3 h-2': level !== 0,
    'fill-white': active,
    'fill-gray': !active,
  });

  const titleClassName = classNames({
    'grow pl-2': true,
    'text-white': active,
    'text-gray-dark': !active,
  });

  return (
    <div className={className} onClick={onClickHandler}>
      {
        React.createElement(
          item.icon || (p => <div {...p} />),
          {
            className: iconClassName,
            style: { minWidth: '3rem' },
          },
        )
      }
      { !active && item.badge &&
        <Badge title={item.badge} className="text-xs" />
      }

      { !minimalized &&
      <div className={titleClassName}>{item.title}</div>
      }

      { item.value !== undefined && !minimalized &&
        <Value
          title={item.value}
          textClassName={classNames({
            'text-s': true,
            'text-white': active,
            'text-gray-dark bg-gray-light': !active,
          })
      } />
      }
    </div>
  );
};

Menu.propTypes =
{
  minimalized: PropTypes.bool,
}

Menu.defaultProps = 
{
  minimalized: false,
}

export default Menu;