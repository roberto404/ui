
import React from 'react';
import PropTypes from 'prop-types';
// import { connect } from 'react-redux';
import { saveAs } from 'file-saver';
import clone from 'lodash/clone';
import toCSV from '@1studio/utils/array/toCSV';


/* !- React Elements */

import RaisedButton from 'material-ui/RaisedButton';
import IconDownload from 'material-ui/svg-icons/file/cloud-download';


/**
* Grid Download Component
*
* @example
* <GridDownload />
*/
const GridDownload = ({ label, className }, { store, id }) =>
{
  const onClickDownloadHandler = () =>
  {
    const grid = store.getState().grid[id];

    if (grid)
    {
      const filename = location.pathname.substring(location.pathname.lastIndexOf('/') + 1);
      const model = clone(grid.model);

      model.paginate = { limit: 0 };

      const csv = toCSV(model.results, grid.hook);

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
      saveAs(blob, `${filename}.csv`);
    }
  };

  return (
    <RaisedButton
      label={'Download'}
      onClick={onClickDownloadHandler}
      icon={<IconDownload />}
      secondary
    />
  );
};

/**
 * propTypes
 * @type {Object}
 */
GridDownload.propTypes =
{
  label: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
  ]),
  className: PropTypes.string,
}

/**
 * defaultProps
 * @type {Object}
 */
GridDownload.defaultProps =
{
  label: 'Download',
  className: '',
};


/**
 * contextTypes
 * @type {Object}
 */
GridDownload.contextTypes =
{
  store: PropTypes.object,
  grid: PropTypes.string,
};


export default GridDownload;
