import React, { Component, useState } from 'react';


/* !- Redux Actions */

// ...

/* !- React Elements */

import Preview from './dropzoneFileListPreview';
import Editor from './dropzoneCardEditor';


/* !- Types */

type PropTypes = {
  id?: string;
  item?: any;  // replace 'any' with the appropriate type if known
  items: any[];  // replace 'any[]' with the appropriate type for items
  onChange: (items: any[] | any) => void;  // adjust types accordingly
  preview?: React.ElementType;
  editor?: React.ElementType;
  [key: string]: any;  // for passing other props dynamically
}


/**
 * DropZone Component helper, display uploaded files and file editor
 */
const DropZoneFileList = (props: PropTypes) => {

  const {
    id,
    item,
    items,
    onChange,
    preview: PreviewComponent = Preview,
    editor: EditorComponent = Editor,
  } = props;

  const [activeItemIndex, setActiveItemIndex] = useState<number | null>(null);


  /* !- Handlers */

  /**
   * Invoke when all files changes
   */
  const onChangeItemsHandler = (updatedItems: any[]) => {
    onChange(updatedItems);
  };

  /**
   * Invoke when active file's properties changes.
   */
  const onChangeItemHandler = (activeItem: any, close: boolean = true) => {

    if (close !== false) {
      setActiveItemIndex(null);
    }

    // Modify item
    if (activeItem) {

      // all items
      if (Array.isArray(activeItem)) {
        onChange(activeItem);
      }
      // single item
      else {
        const newItems = [...items];
        newItems[activeItemIndex!] = activeItem;
        onChange(newItems);
      }

      // Delete item
    } else {
      onChange([
        ...items.slice(0, activeItemIndex!),
        ...items.slice(activeItemIndex! + 1),
      ]);
    }
  };


  /* !- Listener */

  /**
   * Pager by direction sets next active item
   */
  const onNavigationListener = (direction = 1) => {

    let nextIndex = activeItemIndex! + direction;
    const lastIndex = items.length - 1;

    if (nextIndex < 0) {
      nextIndex = lastIndex;
    } else if (nextIndex > lastIndex) {
      nextIndex = 0;
    }

    setActiveItemIndex(nextIndex);
  };

  /**
   * Set active Item
   */
  const onEditListener = (index: number) => {
    setActiveItemIndex(index);
  };


  const currentState = activeItemIndex === null ? 'preview' : 'editor';
  const ActiveComponent = props[currentState] || (currentState === 'preview' ? PreviewComponent : EditorComponent);
  const stateProps = props[`${currentState}Props`] || {};

  return (
    <ActiveComponent
      {...props}
      item={items[activeItemIndex!]}
      onChange={activeItemIndex === null ? onChangeItemsHandler : onChangeItemHandler}
      onEdit={onEditListener}
      onNavigation={onNavigationListener}
      {...stateProps}
    />
  );
}


export default DropZoneFileList;
