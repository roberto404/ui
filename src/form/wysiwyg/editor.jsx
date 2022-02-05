import React from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';

import {
  Editor,
  EditorState,
  ContentState,
  RichUtils,
  getDefaultKeyBinding,
  convertToRaw,
  convertFromRaw,
  Modifier,
  CompositeDecorator,
} from 'draft-js';

// import draftToHtml from 'draftjs-to-html';
// import htmlToDraft from 'html-to-draftjs';

import classNames from 'classnames';


/* !- Redux Actions */

import { popover } from '../../layer/actions';


/* !- React Elements */

import Field from '../../form/formField';

import IconBlockStyle from '../../icon/mui/action/text_rotate_vertical';
import IconBullet from '../../icon/mui/editor/format_list_bulleted';
import IconLink from '../../icon/mui/editor/insert_link';
import IconBold from '../../icon/mui/editor/format_bold';
import IconItalic from '../../icon/mui/editor/format_italic';
import IconUnderline from '../../icon/mui/editor/format_underlined';
import IconStrikestrow from '../../icon/mui/editor/strikethrough_s';
import IconClear from '../../icon/mui/editor/format_clear';

import BlockStyleControls from './editor/blockStyleControls';
import LinkForm, { Link, findLinkEntities } from './editor/link';


/* !- Constants */


const styleMap = {
  STRIKETHROUGH: {
    textDecoration: 'line-through',
  },
};

const blockClassNames = {
  'header-two': 'm-0 pb-1 heavy text-xxl mobile:text-m',
  'header-three': 'light pb-1 text-line-m mobile:text-s m-0 text-black',
  'blockquote': 'embed-blockquote italic text-line-xl text-l my-2 pt-4 px-4',
  'caption': 'text-center light text-s',
  'unstyle': 'text-line-l light',
  'unordered-list-item': 'disc text-line-l light',
  'ordered-list-item': 'decimal text-line-l light',
}

const getBlockStyle = block =>
  blockClassNames[block.getType()] || blockClassNames.unstyle;


/**
 * Draft.js: https://draftjs.org/
 * 
 * Beginner’s Guide
 * https://medium.com/@adrianmcli/a-beginner-s-guide-to-draft-js-d1823f58d8cc
 * 
 * Richtext represents:
 * https://rajaraodv.medium.com/how-draft-js-represents-rich-text-data-eeabb5f25cf2
 * 
 * Saving data
 * https://reactrocket.com/post/draft-js-persisting-content/
 * 
 * Search and replace
 * https://reactrocket.com/post/draft-js-search-and-replace/
 * 
 */
class Wysiwyg extends Field
{
  constructor(props)
  {
    super(props);

    this.ignoreReceiveProps = false;

    this.decorator = new CompositeDecorator(props.decorator);

    if (this.state.value)
    {
      try
      {
        this.state.editorState = EditorState.createWithContent(convertFromRaw(JSON.parse(this.state.value)), this.decorator);

      }
      catch (error)
      {
        this.state.editorState = EditorState.createEmpty(this.decorator);
      }
    }
    else
    {
      this.state.editorState = EditorState.createEmpty(this.decorator);
    }
  }

  getChildContext()
  {
    return {
      editorState: this.state.editorState,
      toggleBlockType: this.toggleBlockType,
      toggleInlineStyle: this.toggleInlineStyle,
      focusEditor: this.focusEditor,
    };
  }

  componentWillReceiveProps = (nextProps) =>
  {
    if (nextProps.value && nextProps.value !== this.value)
    {
      let editorState = {};

      try
      {
        editorState = EditorState.createWithContent(convertFromRaw(JSON.parse(nextProps.value)), this.decorator);

      } catch (error)
      {
        editorState = EditorState.createEmpty(this.decorator);
      }

      this.onChangeEditorHandler(editorState);
    }
  }


  /**
   * Invoke when editor change.
   * External controller (bold, color) use this handler to apply changes
   *
   * @private
   * @override
   * @emits
   * @param  {Map} editorState
   * @return {void}
   */
  onChangeEditorHandler = (editorState) =>
  {
    let contentChanged = false;

    const value = Wysiwyg.defaultProps.format(editorState);

    if (this.value !== value && this.validate(editorState))
    {
      this.value = value;
      contentChanged = true;

      this.onChangeHandler(editorState);
    }

    this.setState(
      { editorState },
      () =>
      {
        if (contentChanged)
        {
          setTimeout(() =>
          {
            this.focusEditor();
          }, 0)
        }
      }
    );
  }

  onChangeListener = (props = this.props) =>
  {
    // overwrite field.onchange do not need state.value
    return;
  }


  handleKeyCommand = (command, editorState) =>
  {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    
    if (newState)
    {
      this.onChangeEditorHandler(newState);
      return true;
    }

    return false;
  }

  mapKeyToEditorCommand = (e) =>
  {
    if (e.keyCode === 9 /* TAB */)
    {
      const newEditorState = RichUtils.onTab(
        e,
        this.state.editorState,
        4, /* maxDepth */
      );

      if (newEditorState !== this.state.editorState)
      {
        this.onChangeEditorHandler(newEditorState);
      }

      return;
    }

    return getDefaultKeyBinding(e);
  }

  toggleBlockType = (blockType) =>
  {
    this.onChangeEditorHandler(
      RichUtils.toggleBlockType(
        this.state.editorState,
        blockType
      )
    );
  }

  toggleInlineStyle = (inlineStyle) =>
  {
    this.onChangeEditorHandler(
      RichUtils.toggleInlineStyle(
        this.state.editorState,
        inlineStyle
      )
    );
  }

  onClickBlockStyleHandler = (event) =>
  {
    const className = ({ active }) => classNames({
      'pl-3 mt-1 py-1/2 hover:bg-gray-light rounded pointer': true,
      'icon-checkmark-black': active,
    });

    this.context.store.dispatch(popover(
      (
        (
          <div className="" style={{ width: 200 }}>
            <BlockStyleControls
              controls={[
                {
                  type: 'BOLD',
                  element: <IconBold />,
                },
                {
                  type: 'ITALIC',
                  element: <IconItalic />,
                },
                {
                  type: 'UNDERLINE',
                  element: <IconUnderline />,
                },
                {
                  type: 'STRIKETHROUGH',
                  element: <IconStrikestrow />,
                },
              ]}
              editorState={this.state.editorState}
              toggleInlineStyle={this.toggleInlineStyle}
              focusEditor={this.focusEditor}
              className="v-center mb-1"
              inlineStyle
            />
            <BlockStyleControls
              controls={[
                {
                  type: 'header-two',
                  element: <h2 style={{ padding: '0'}} className={blockClassNames['header-two']}>Heading</h2>,
                  className,
                },
                {
                  type: 'header-three',
                  element: <h3 style={{ padding: '0'}} className={blockClassNames['header-three']}>Subheading</h3>,
                  className,
                },
                {
                  type: 'blockquote',
                  element: <div style={{ margin: 0 }} className="italic text-l">Blockquote</div>,
                  className,
                },
                {
                  type: 'caption',
                  element: <div style={{ margin: 0 }} className="light text-s">Caption</div>,
                  className,
                },
                {
                  type: 'unordered-list-item',
                  element: <ul><li style={{ margin: 0 }} className="ml-1 disc light">Unordered list item</li></ul>,
                  className,
                },
                {
                  type: 'ordered-list-item',
                  element: <ol><li style={{ margin: 0 }} className="ml-1 decimal light">Ordered list item</li></ol>,
                  className,
                },
                {
                  type: 'unstyle',
                  element: <div className={blockClassNames['unstyle']}>Body</div>,
                  className,
                },
              ]}
              editorState={this.state.editorState}
              toggleBlockType={this.toggleBlockType}
              focusEditor={this.focusEditor}
              className=""
            />
          </div>
        )
      ),
      event,
      {
        className: 'no-close',
        // containerStyle: { width: '400px' },
        // useMousePosition: true,
      },
    ));
  }


  focusEditor = () =>
  {
    if (this.editorDom && !this.props.disabled)
    {
      this.editorDom.focus();
    }
  }

  removeInlineStyles = (editorState = this.state.editorState) =>
  {
    const contentState = editorState.getCurrentContent();

    const styles = ['BOLD', 'ITALIC', 'UNDERLINE', ...Object.keys(styleMap)];

    const contentWithoutStyles = styles.reduce(
      (result, style) =>
        Modifier.removeInlineStyle(result, editorState.getSelection(), style),
      contentState
    );
  
    const newEditorState = EditorState.push(
      editorState,
      contentWithoutStyles,
      'change-inline-style'
    );
  
    return newEditorState;
  };

  removeEntities = (editorState = this.state.editorState) =>
  {
    const contentState = editorState.getCurrentContent();

    const contentWithoutEntities = Modifier.applyEntity(
      contentState,
      editorState.getSelection(),
      null
    );

    const newEditorState = EditorState.push(
      editorState,
      contentWithoutEntities,
      'apply-entity'
    );  
  
    return newEditorState;
  };

  removeLists = (editorState) =>
  {
    const contentState = editorState.getCurrentContent();

    let contentWithoutLists = contentState;
    const blocksMap = contentState.getBlockMap();
  
    blocksMap.forEach((block) =>
    {
      const blockType = block.getType();
      
      if (
        blockType === 'ordered-list-item' ||
        blockType === 'unordered-list-item'
      )
      {
        const selectionState = SelectionState.createEmpty(block.getKey());
        const updatedSelection = selectionState.merge({
          focusOffset: 0,
          anchorOffset: block.getText().length
        });
  
        contentWithoutLists = Modifier.setBlockType(
          contentWithoutLists,
          updatedSelection,
          'unstyled'
        );
      }
    });

    const newEditorState = EditorState.push(
      editorState,
      contentWithoutLists,
      'change-block-type'
    );
  
    return newEditorState;
  }

  clearFormat = () =>
  {
    // const selection = this.state.editorState.getSelection();
    // console.log(selection);

    const newEditorState = [this.removeInlineStyles, this.removeEntities, this.removeLists].reduce(
      (result, helper) => helper(result),
      this.state.editorState,
    );

    this.onChangeEditorHandler(
      RichUtils.toggleBlockType(
        newEditorState,
        'unstyled',
      )
    );
  }
  

  render()
  {
    const { editorState } = this.state;

    const className = 'wysiwyg';

    if (this.props.disabled)
    {
      return (
        <Editor
          editorState={this.props.editorStateFormat(editorState)}
          blockStyleFn={getBlockStyle}
          customStyleMap={styleMap}
          className={className}
          readOnly
        />
      )
    }



    return (
      <div className={this.props.className}>

        <div className="flex p-1/2 border-bottom border-gray-light mb-1">

          <div className="grow h-center">
            <div
              className="w-3 h-3 p-1/2 hover:bg-gray-light rounded pointer mr-1/2"
              onClick={this.onClickBlockStyleHandler}
            >
              <IconBlockStyle />
            </div>

            <div
              className="w-3 h-3 p-1/2 hover:bg-gray-light rounded pointer mr-1/2"
              onClick={() => { this.toggleInlineStyle('BOLD'); }}
            >
              <IconBold />
            </div>


            <div className="w-3 h-3 p-1/2 hover:bg-gray-light rounded pointer mr-1/2" onClick={this.clearFormat}>
              <IconClear />
            </div>
            <div className="border-right mx-1 h-2" />
            <div className="w-3 h-3 p-1/2 hover:bg-gray-light rounded pointer mr-1/2" onClick={this.addLink}>
              <IconLink />
            </div>
          </div>

          <div className="flex">
           
          </div>
        </div>

        <div
          className="p-2 scroll mb-2"
          style={{ maxHeight: 'calc(100vh - 30rem)'}}
          onClick={this.focusEditor}
        >
          <Editor
            editorState={editorState}
            onChange={this.onChangeEditorHandler}

            blockStyleFn={getBlockStyle}
            customStyleMap={styleMap}

            handleKeyCommand={this.handleKeyCommand}
            // keyBindingFn={this.mapKeyToEditorCommand}
            // placeholder="Placeholder..."
            ref={ref => this.editorDom = ref}
            className={className}
            spellCheck
          />
        </div>

      </div>
    );
  }
}

/**
 * childContextTypes
 * @type {Object}
 */
Wysiwyg.childContextTypes = {
  editorState: PropTypes.object,
  toggleBlockType: PropTypes.func,
  toggleInlineStyle: PropTypes.func,
  focusEditor: PropTypes.func,
};

Wysiwyg.defaultProps =
{
  ...Wysiwyg.defaultProps,
  format: editorState => typeof editorState === 'object' && editorState.getCurrentContent !== undefined ?
    JSON.stringify(convertToRaw(editorState.getCurrentContent()))
    : '',
  decorator: [
    {
      strategy: findLinkEntities,
      component: Link,
    },
  ],
  editorStateFormat: editorState => editorState,
}

// Wysiwyg.propTypes =
// {
//   ...Wysiwyg.propTypes,
// }

export default Wysiwyg;
