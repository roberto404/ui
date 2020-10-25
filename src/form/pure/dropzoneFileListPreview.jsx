import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { File } from './dropzone';
import { sortableContainer, sortableElement } from 'react-sortable-hoc';
import arrayMove from 'array-move';


/* !- Redux Actions */

// ...



/* !- React Elements */

import FileListGridRow from '../../grid/pure/gridRows/filelist';



const SortableItem = sortableElement(({ element }) => element);

const SortableContainer = sortableContainer(({ children }) => {
  return <div className="grid-2-2 mb-2">{children}</div>;
});



/**
 * [DropzoneFileListPreview description]
 */
const DropzoneFileListPreview = ({ items, onEdit, onChange }) =>
{
  const onDragEndHandler = (({ oldIndex, newIndex }) =>
  {
    if (oldIndex === newIndex)
    {
      onEdit(oldIndex);
    }
    else
    {
      onChange(arrayMove(items, oldIndex, newIndex));
    }
  });

  return (
    <SortableContainer onSortEnd={onDragEndHandler} axis="xy">
      { items.map((item, index) =>
        <SortableItem
          key={`item-${index}`}
          index={index}
          element={<FileListGridRow data={item} />}
        />
      )}
    </SortableContainer>
  )

  // const files = items.map((item, index) =>
  // (
  //   <FileListGridRow key={`${item.id}|${index}`} data={item} onClick={() => onEdit(index)} />
  // ));
  //
  // return <div className="grid-2-2">{files}</div>
};


export default DropzoneFileListPreview;
