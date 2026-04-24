import React, { Component } from 'react';
// import { sortableContainer, sortableElement } from 'react-sortable-hoc';
import { arrayMoveImmutable } from '@1studio/utils/array/move';


/* !- Redux Actions */

// ...



/* !- React Elements */

import FileListGridRow from '../../grid/components/gridRows/filelist';
import Sortable from '../../dragAndDrop/dnd-sortable';



/**
 * [DropzoneFileListPreview description]
 */
const DropzoneFileListPreview = ({ items, onEdit, onChange, element = FileListGridRow, draggable = true }) =>
{
  const onDragEndHandler = (({ oldIndex, newIndex }) =>
  {
    if (oldIndex === newIndex)
    {
      onEdit(oldIndex);
    }
    else
    {
      onChange(arrayMoveImmutable(items, oldIndex, newIndex));
    }
  });

  if (draggable) {
    return (
      <div className='grid-2-2 mb-2'>
      <Sortable
        elements={items.map((item, index) => React.createElement(element, { data: item, key: index, onClick: () => onEdit(index) }))}
        onDragEnd={onDragEndHandler}
        horizontal
        vertical
      />
      </div>
    )
  }

  return (
    <div className="grid-2-2">
      { items.map((item, index) => React.createElement(element, { data: item, key: index, onClick: () => onEdit(index) }))}
    </div>
  )
};

export default DropzoneFileListPreview;
