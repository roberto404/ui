
import React, { useContext} from 'react';
import PropTypes from 'prop-types';
// import { connect } from 'react-redux';
import { saveAs } from 'file-saver';
import clone from 'lodash/clone';
import isEmpty from 'lodash/isEmpty';
import toCSV from '@1studio/utils/array/toCSV';

import { useAppContext } from '../../context';
import { GridContext } from '../context';

/**
* Grid Download Component
*
* @example
* <GridDownload />
*/
const GridDownload = ({ id, label, className, hook }) =>
{

  const { store } = useAppContext();
  const context = useContext(GridContext);

  const onClickDownloadHandler = () =>
  {
    const grid = store.getState().grid[id || context.grid];

    if (grid)
    {
      const filename = location.pathname.substring(location.pathname.lastIndexOf('/') + 1);
      const model = clone(grid.model);

      model.paginate = { limit: 0 };

      const csv = toCSV(model.results, isEmpty(hook) ? grid.hook : hook);

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
      saveAs(blob, `${filename}.csv`);
    }
  };

  return (
    <button
      className={className}
      onClick={onClickDownloadHandler}
    >
      { label }
    </button>
  );
};

/**
 * propTypes
 * @type {Object}
 */
GridDownload.propTypes =
{
  id: PropTypes.string,
  label: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
  ]),
  className: PropTypes.string,
  hook: PropTypes.object,
};

/**
 * defaultProps
 * @type {Object}
 */
GridDownload.defaultProps =
{
  id: '',
  label: 'Download',
  className: '',
  hook: {},
};


export default GridDownload;
