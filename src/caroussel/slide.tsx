import React from 'react';

/* !- React Components */

export const SlideImage = ({ id, url, href, active }) =>
{
  if (!href || active === true)
  {
    return <img src={url} width="100%" alt={id} />;
  }

  return (
    <a href={href}>
      <img src={url} width="100%" alt={id} />
    </a>
  );
};

// /**
//  * propTypes
//  * @type {Object}
//  */
// SlideHelperComponent.propTypes =
// {
//   id: PropTypes.oneOfType([
//     PropTypes.number,
//     PropTypes.string,
//   ]).isRequired,
//   url: PropTypes.string.isRequired,
//   href: PropTypes.string.isRequired,
//   active: PropTypes.bool.isRequired,
// };