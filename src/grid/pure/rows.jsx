
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

/**
 * Grid helper Row Component
 * Avatar | title, subtitle | action
 */
export const RowAvatarTitleAction = ({ title, subtitle, img, action, onClick }) =>
{
  const RowClasses = classNames({
    'avatar-title-action border-bottom border-gray-yellow': true,
    'hover:bg-white pointer': onClick.toString() !== RowAvatarTitleAction.defaultProps.onClick.toString(),
  });

  return (
    <tr
      className={RowClasses}
      onClick={onClick}
    >
      { img &&
      <td>
        <div
          className="avatar w-6 shadow-outer mr-1"
          style={{ backgroundImage: `url(${img})` }}
        />
      </td>
      }
      <td className="w-full h-4 px-1">
        <div className="title">{title}</div>
        { subtitle &&
        <div className="pt-1/2 text-gray text-s">{subtitle}</div>
        }
      </td>
      { action &&
      <td className="ml-1">
        { action }
      </td>
      }
    </tr>
  );
};

RowAvatarTitleAction.propTypes =
{
  title: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
  ]).isRequired,
  subtitle: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
  ]),
  img: PropTypes.string,
  action: PropTypes.element,
  onClick: PropTypes.func,
};

RowAvatarTitleAction.defaultProps =
{
  subtitle: '',
  img: '',
  action: '',
  onClick: () =>
  {},
};


export default ({
  AvatarTitleAction: RowAvatarTitleAction,
});
