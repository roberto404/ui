import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';


import { flush } from '../../../layer/actions';


export const BLOCK_TYPES = [
  {label: 'H1', style: 'header-one'},
  {label: 'H2', style: 'header-two'},
  {label: 'H3', style: 'header-three'},
  {label: 'H4', style: 'header-four'},
  {label: 'H5', style: 'header-five'},
  {label: 'H6', style: 'header-six'}, 
  {label: 'Blockquote', style: 'blockquote'},
  {label: 'UL', style: 'unordered-list-item'},
  {label: 'OL', style: 'ordered-list-item'},
  {label: 'Code Block', style: 'code-block'},
];



var INLINE_STYLES = [
  { label: 'Bold', style: 'BOLD' },
  { label: 'Italic', style: 'ITALIC' },
  { label: 'Underline', style: 'UNDERLINE' },
  { label: 'Monospace', style: 'CODE' },
];

/**
 * @example
  <BlockStyleControls
    blocks={[
      {
        type: 'unordered-list-item',
        element: <IconBlockStyle />,
        className: ({ active }) => classNames({
          'w-3 h-3 p-1/2 hover:bg-gray-light rounded pointer': true,
          'bg-gray-light': active,
        }),
      }
    ]}
    className="v-center mb-1"
  />
 */
const BlockStyleControls = (props, context) =>
{
  const {
    controls,
    inlineStyle,
  } = props;

  const {
    store,
  } = context;

  const editorState = context.editorState || props.editorState;
  const toggleBlockType = context.toggleBlockType || props.toggleBlockType;
  const toggleInlineStyle = context.toggleInlineStyle || props.toggleInlineStyle;
  const focusEditor = context.focusEditor || props.focusEditor;

  const selection = editorState.getSelection();
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();

  const currentStyle = editorState.getCurrentInlineStyle();


  const onClickHandler = (block, event) =>
  {
    let handler = toggleBlockType;

    if (inlineStyle)
    {
      handler = toggleInlineStyle;
    }

    handler(block.type);

    const { active, method } = store.getState().layer;

    if (active && method === 'popover')
    {
      store.dispatch(flush());
    }
    else
    {
      focusEditor();
    }

  }

  return (
    <div className={props.className}>
      { controls.map(({ type, className, element }) =>
      {
        const active = !inlineStyle ?
          type === blockType : currentStyle.has(type);

        const controllerClassName = className ?
          (typeof className === 'function' ? className({ active }) : className)
          :
          classNames({
            'w-3 h-3 p-1/2 mr-1/2 hover:bg-gray-light rounded pointer': true,
            'bg-gray-light': active,
          });
        
        return (
          <div
            key={type}
            className={controllerClassName}
            onClick={event => onClickHandler({ type }, event)}
          >
            {element}
          </div>
        );
      }
      )}
    </div>
  );
};


BlockStyleControls.defaultProps =
{
  blocks: [],
  inlineStyle: false,
}

BlockStyleControls.contextTypes = 
{
  store: PropTypes.object,
  editorState: PropTypes.object,
  toggleBlockType: PropTypes.func,
  toggleInlineStyle: PropTypes.func,
  focusEditor: PropTypes.func,
}

export default BlockStyleControls;