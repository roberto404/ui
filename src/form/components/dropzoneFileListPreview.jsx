import React, { Component } from 'react';
// import { sortableContainer, sortableElement } from 'react-sortable-hoc';
import { arrayMoveImmutable } from 'array-move';


/* !- Redux Actions */

// ...



/* !- React Elements */

import FileListGridRow from '../../grid/components/gridRows/filelist';



// const SortableItem = sortableElement(({ element }) => element);

// const SortableContainer = sortableContainer(({ children }) => {
//   return <div className="grid-2-2 mb-2">{children}</div>;
// });



/**
 * [DropzoneFileListPreview description]
 */
const DropzoneFileListPreview = ({ items, onEdit, onChange, element, draggable }) =>
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

  // if (draggable)
  // {
  //   return (
  //     <SortableContainer onSortEnd={onDragEndHandler} axis="xy">
  //       { items.map((item, index) =>
  //         <SortableItem
  //           key={`item-${index}`}
  //           index={index}
  //           element={React.createElement(element, { data: item })}
  //         />
  //       )}
  //     </SortableContainer>
  //   );
  // }

  // const files = items.map((item, index) =>
  // (
  //   <FileListGridRow key={`${item.id}|${index}`} data={item} onClick={() => onEdit(index)} />
  // ));
  //
  return (
    <div className="grid-2-2">
      { items.map((item, index) => React.createElement(element, { data: item, key: index, onClick: () => onEdit(index) }))}
    </div>
  )
};


DropzoneFileListPreview.defaultProps =
{
  draggable: true,
  element: FileListGridRow,
}


export default DropzoneFileListPreview;
