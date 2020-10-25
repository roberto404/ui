import React, { Component } from 'react';
import PropTypes from 'prop-types'


/* !- Redux Actions */

// ...

/* !- React Elements */

import Preview from './dropzoneFileListPreview';
import Editor from './dropzoneCardEditor';


/**
 * DropZone Component helper, display uploaded files and file editor
 */
class DropZoneFileList extends Component
{
  constructor(props)
  {
    super(props);

    this.state = {
      activeItemIndex: null,
    };
  }


  /* !- Handlers */

  /**
   * Invoke when all files changes
   * @param  {array} items files
   */
  onChangeItemsHandler = (items) =>
  {
    this.props.onChange(items);
  }

  /**
   * Invoke when active file's properties changes.
   * @param  {object} [item]  file
   * @param  {boolean} [close] unset active item
   */
  onChangeItemHandler = (activeItem, close) =>
  {
    // modify item
    if (activeItem)
    {
      if (Array.isArray(activeItem))
      {
        this.props.onChange(activeItem);
      }
      else
      {
        const items = [...this.props.items];
        items[this.state.activeItemIndex] = activeItem;

        this.props.onChange(items);
      }
    }
    // delete item
    else
    {
      this.props.onChange([
        ...this.props.items.slice(0, this.state.activeItemIndex),
        ...this.props.items.slice(this.state.activeItemIndex + 1),
      ]);
    }

    if (close !== false)
    {
      this.setState({ activeItemIndex: null })
    }
  }


  /* !- Listener */

  onNavigationListener = (direction = 1) =>
  {
    let nextIndex = this.state.activeItemIndex + direction;

    const lastIndex = this.props.items.length - 1;

    if (nextIndex < 0)
    {
      nextIndex = lastIndex;
    }
    else if (nextIndex > lastIndex)
    {
      nextIndex = 0;
    }

    // const item = this.props.items[nextIndex];

    this.setState({
      activeItemIndex: nextIndex,
    });
  }

  /**
   * Set active Item
   * @param  {integer} activeItem [description]
   * @return {[type]}            [description]
   */
  onEditListener = (activeItemIndex) =>
  {
    this.setState({ activeItemIndex })
  }

  render()
  {
    const {
      id,
      item,
      items,
      preview,
      editor,
    } = this.props;

    const element = this.state.activeItemIndex === null ? preview : editor;

    const props = {
      ...this.props,
      item: items[this.state.activeItemIndex],
      onChange: this.state.activeItemIndex === null ? this.onChangeItemsHandler : this.onChangeItemHandler,
      onEdit: this.onEditListener,
      onNavigation: this.onNavigationListener,
    };

    return React.createElement(element, props);
  }
}

DropZoneFileList.contextTypes =
{
  store: PropTypes.object,
};

DropZoneFileList.defaultProps =
{
  preview: Preview,
  editor: Editor,
};


export default DropZoneFileList;
