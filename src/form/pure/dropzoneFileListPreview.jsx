import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { File } from './dropzone';

/* !- Redux Actions */

// ...



/* !- React Elements */

import FileListGridRow from '../../grid/pure/gridRows/filelist';


/**
 * [DropzoneFileListPreview description]
 */
const DropzoneFileListPreview = ({ items, onEdit }) =>
{
  const files = items.map((item, index) =>
  (
    <FileListGridRow key={`${item.id}|${index}`} data={item} onClick={() => onEdit(index)} />
  ));

  return <div className="grid-2-2">{files}</div>
};


export default DropzoneFileListPreview;
