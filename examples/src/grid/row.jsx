
import React from 'react';
import PropTypes from 'prop-types';


const Row = ({ data, columns }) => (
  <div style={{ display: 'inline-block' }}>
    <div className="text-red bold">{data.name}</div>
    <div className="text-xs text-gray-light">
      {columns.map(column => <div key={column}>{data[column]}</div>)}
    </div>
  </div>
);

Row.propTypes =
{
  data: PropTypes.objectOf(PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ])).isRequired,
  columns: PropTypes.arrayOf(PropTypes.string),
};

Row.defaultProps =
{
  columns: [],
};

export default Row;
