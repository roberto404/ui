import React from 'react';
import PropTypes from 'prop-types';

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

import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

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


/* !- Constants */


const styleMap = {
  STRIKETHROUGH: {
    textDecoration: 'line-through',
  },
};

const getBlockStyle = (block) =>
{
  switch (block.getType())
  {
    case 'header-two': return 'm-0 pb-1 heavy text-xxl mobile:text-m';
    case 'header-three': return 'light pb-1 text-line-m mobile:text-s m-0';
    case 'blockquote': return 'italic';
    case 'unstyle': return 'text-line-l light';
    default: return null;
  }
}

const Link = (props) =>
{
  const { url } = props.contentState.getEntity(props.entityKey).getData();

  return (
    <a href={url} style={{ color: '#3b5998', textDecoration: 'underline' }}>
      {props.children}
    </a>
  );
}

function findLinkEntities(contentBlock, callback, contentState)
{
  contentBlock.findEntityRanges(
    (character) => {
      const entityKey = character.getEntity();
      return (
        entityKey !== null &&
        contentState.getEntity(entityKey).getType() === 'LINK'
      );
    },
    callback
  );
}


class Wysiwyg extends Field
{
  constructor(props)
  {
    super(props);

    const decorator = new CompositeDecorator([
      {
        strategy: findLinkEntities,
        component: Link,
      },
    ]);

    // if (this.state.value)
    // {
    //   const contentBlock = htmlToDraft(this.state.value);
    //   const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
    //   this.state.editorState = EditorState.createWithContent(contentState, decorator);
    // }
    // else
    // {
      this.state.editorState = EditorState.createEmpty(decorator);
    // }
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



  // componentWillReceiveProps(nextProps)
  // {
  //   if (!isEqual(nextProps.value, this.getValue()))
  //   {
  //     const contentBlock = htmlToDraft(nextProps.value);
  //     const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
  //     const editorState = EditorState.createWithContent(contentState);
  //
  //     this.setState({ editorState });
  //     this.onChangeListener(nextProps);
  //   }
  // }


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
    // const value = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    // const value = JSON.stringify(convertToRaw(editorState.getCurrentContent()));
    const value = editorState;

    if (this.state.value !== value && this.validate(value))
    {
      this.onChangeHandler(value);
      
      this.setState(
        { editorState },
        // () => setTimeout(() => this.editorDom.focus(), 0),
      );
    }
  }

  onChangeListener = (props = this.props) =>
  {
    const value = this.getValue(props);
    const error = this.getError();

    if (
      (typeof value !== 'undefined' && this.state.value !== value) ||
      this.state.error !== error
    )
    {
      const editorState = value;
      // const editorState = EditorState.createWithContent(convertFromRaw(JSON.parse(value)));

      // let contentBlock = htmlToDraft(value);
      // const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
      // const editorState = EditorState.createWithContent(contentState);
      this.setState({ /*editorState,*/ value, error });
    }
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
                  element: <h2 style={{ margin: 0 }}>Heading</h2>,
                  className,
                },
                {
                  type: 'header-three',
                  element: <h3 style={{ margin: 0 }}>Subheading</h3>,
                  className,
                },
                {
                  type: 'blockquote',
                  element: <blockquote style={{ margin: 0 }}>Blockquote</blockquote>,
                  className,
                },
                {
                  type: 'unordered-list-item',
                  element: <ul style={{ margin: 0 }}><li>Unordered list item</li></ul>,
                  className,
                },
                {
                  type: 'ordered-list-item',
                  element: <ol style={{ margin: 0 }}><li>Ordered list item</li></ol>,
                  className,
                },
                {
                  type: 'unstyle',
                  element: <div>Body</div>,
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
    this.editorDom.focus();
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



  promptForLink = (event) =>
  {
    event.preventDefault();

    const { editorState } = this.state;
    const selection = editorState.getSelection();

    if (!selection.isCollapsed())
    {
      const contentState = editorState.getCurrentContent();
      const startKey = editorState.getSelection().getStartKey();
      const startOffset = editorState.getSelection().getStartOffset();
      const blockWithLinkAtBeginning = contentState.getBlockForKey(startKey);
      const linkKey = blockWithLinkAtBeginning.getEntityAt(startOffset);

      let url = '';

      if (linkKey)
      {
        const linkInstance = contentState.getEntity(linkKey);
        url = linkInstance.getData().url;
      }

      this.setState({
        showURLInput: true,
        urlValue: url,
      }, () => {
        setTimeout(() => this.refs.url.focus(), 0);
      });
    }
  }
  
  addLink = (event) =>
  {
    event.preventDefault();

    const { editorState } = this.state;

    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(
      'LINK',
      'MUTABLE',
      { url: 'valami_url_slug' }
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

    const newEditorState = EditorState.set(editorState, { currentContent: contentStateWithEntity });

    this.onChangeEditorHandler(
      RichUtils.toggleLink(
        newEditorState,
        newEditorState.getSelection(),
        entityKey
      ),
    );
  }

  removeLink = (event) =>
  {
    event.preventDefault();

    const { editorState } = this.state;

    const selection = editorState.getSelection();

    if (!selection.isCollapsed())
    {
      this.onChangeEditorHandler(
        RichUtils.toggleLink(editorState, selection, null)
      );
    }
  }

  render()
  {
    const { editorState } = this.state;

    // const contentBlock = htmlToDraft(this.state.value);
    // const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
    // const editorState = EditorState.createWithContent(contentState);



    // const selection = editorState.getSelection();

    // console.log(selection);


    // const blockType = editorState
    //   .getCurrentContent()
    //   .getBlockForKey(selection.getStartKey())
    //   .getType();

    // console.log(blockType);



    // If the user changes block type before entering any text, we can
    // either style the placeholder or hide it. Let's just hide it now.
    // let className = 'RichEditor-editor';

    // var contentState = editorState.getCurrentContent();

    // console.log(editorState.getCurrentContent());

    // if (!contentState.hasText())
    // {
    //   if (contentState.getBlockMap().first().getType() !== 'unstyled')
    //   {
    //     className += ' RichEditor-hidePlaceholder';
    //   }
    // }




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
            <div className="w-3 h-3 p-1/2 hover:bg-gray-light rounded pointer mr-1/2" onClick={this.clearFormat}>
              <IconClear />
            </div>
            <div className="border-right mx-1 h-2" />
            <div className="w-3 h-3 p-1/2 hover:bg-gray-light rounded pointer mr-1/2">
              <IconLink />
            </div>
          </div>

          <div className="flex">
           
          </div>
        </div>

        <div onClick={() => this.toggleInlineStyle('BOLD')}>fdasdff</div>

        {/* <div
          onMouseDown={this.addLink}
        >
          Add Link
        </div>
        <div onMouseDown={this.removeLink}>
          Remove Link
        </div> */}

        <div
          className="p-2"
          onClick={this.focus}
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
            // spellCheck
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
  // format: editorState => typeof editorState === 'object' && editorState.getCurrentContent !== undefined ?
  //   JSON.stringify(convertToRaw(editorState.getCurrentContent()))
  //   : '',
}

// Wysiwyg.propTypes =
// {
//   ...Wysiwyg.propTypes,
// }

export default Wysiwyg;
