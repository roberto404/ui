
import React from 'react';
import PropTypes from 'prop-types';


/* !- Constants */


/**
 * Calendar component
 */
const ToolTip = (
{
  title,
  desc,
}) =>
(
  <div className="tooltip">
    <div className="title">{title}</div>
    <div className="desc">{desc}</div>
  </div>
);

/**
 * propTypes
 * @type {Object}
 */
ToolTip.propTypes =
{
  title: PropTypes.string,
  desc: PropTypes.string,
};

/**
 * defaultProps
 * @type {Object}
 */
ToolTip.defaultProps =
{
  id: 'ToolTip',
  title: '',
  desc: '',
};

export default ToolTip;
