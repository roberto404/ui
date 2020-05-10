import React, { Component } from 'react';
import PropTypes from 'prop-types'


/* !- Redux Actions */

// ...

/* !- React Elements */

import Preview from './dropzoneCardPreview';
import Editor from './dropzoneCardEditor';


/**
 * DropZone Component helper
 * Upload files viewer and marker editor
 */
class DropZoneFiles extends Component
{
  constructor(props)
  {
    super(props);

    this.state = {
      itemIndex: null,
    };
  }


  /* !- Handlers */

  onChangeHandler = (item, close) =>
  {
    if (item)
    {
      const items = [...this.props.items];
      items[this.state.itemIndex] = item;

      this.props.onChange(items);
    }
    else
    {
      this.props.onChange([
        ...this.props.items.slice(0, this.state.itemIndex),
        ...this.props.items.slice(this.state.itemIndex + 1),
      ]);
    }

    if (close !== false)
    {
      this.setState({ itemIndex: null })
    }
  }

  onEditListener = (itemIndex) =>
  {
    this.setState({ itemIndex })
  }

  render()
  {
    return this.state.itemIndex === null ?
      React.createElement(
        this.props.preview,
        {
          id: this.props.id,
          items: this.props.items,
          onEdit: this.onEditListener,
        }
      )
      :
      React.createElement(
        this.props.editor,
        {
          id: this.props.id,
          items: this.props.items,
          onEdit: this.onEditListener,
          item: this.props.items[this.state.itemIndex],
          onChange: this.onChangeHandler,
        }
      )
    ;
  }
}

DropZoneFiles.contextTypes =
{
  store: PropTypes.object,
};

DropZoneFiles.defaultProps =
{
  preview: Preview,
  editor: Editor,
};


export default DropZoneFiles;
