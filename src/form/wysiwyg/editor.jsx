import React from 'react';
import PropTypes from 'prop-types';
import { Editor, EditorState, ContentState, RichUtils, getDefaultKeyBinding, convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import isEqual from 'lodash/isEqual';


/* !- React Elements */

import Field from '../../form/formField';


class Wysiwyg extends Field
{
  constructor(props)
  {
    super(props);

    if (this.state.value)
    {
      const contentBlock = htmlToDraft(this.state.value);
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
      this.state.editorState = EditorState.createWithContent(contentState);
    }
    else
    {
      this.state.editorState = EditorState.createEmpty();
    }

    this.focus = () => this.refs.editor.focus();

    this.handleKeyCommand = this._handleKeyCommand.bind(this);
    this.mapKeyToEditorCommand = this._mapKeyToEditorCommand.bind(this);
    this.toggleBlockType = this._toggleBlockType.bind(this);
    this.toggleInlineStyle = this._toggleInlineStyle.bind(this);
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
    const value = draftToHtml(convertToRaw(editorState.getCurrentContent()));

    // if (this.state.value !== value && this.validate(value))
    // {
      this.onChangeHandler(value);
      // this.setState({ editorState, value });
      this.setState({ editorState });
    // }
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

  onChangeListener = (props = this.props) =>
  {
    const value = this.getValue(props);
    const error = this.getError();

    if (
      (typeof value !== 'undefined' && this.state.value !== value) ||
      this.state.error !== error
    )
    {
      console.log('111');
      const contentBlock = htmlToDraft(value);
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
      const editorState = EditorState.createWithContent(contentState);
      this.setState({ /*editorState,*/ value, error });
    }
  }


  _handleKeyCommand(command, editorState)
  {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onChangeEditorHandler(newState);
      return true;
    }
    return false;
  }

  _mapKeyToEditorCommand(e)
  {
    if (e.keyCode === 9 /* TAB */) {
      const newEditorState = RichUtils.onTab(
        e,
        this.state.editorState,
        4, /* maxDepth */
      );
      if (newEditorState !== this.state.editorState) {
        this.onChangeEditorHandler(newEditorState);
      }
      return;
    }
    return getDefaultKeyBinding(e);
  }

  _toggleBlockType(blockType)
  {
    this.onChangeEditorHandler(
      RichUtils.toggleBlockType(
        this.state.editorState,
        blockType
      )
    );
  }

  _toggleInlineStyle(inlineStyle)
  {
    this.onChangeEditorHandler(
      RichUtils.toggleInlineStyle(
        this.state.editorState,
        inlineStyle
      )
    );
  }

  render()
  {
    const { editorState } = this.state;

    // const contentBlock = htmlToDraft(this.state.value);
    // const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
    // const editorState = EditorState.createWithContent(contentState);




    // If the user changes block type before entering any text, we can
    // either style the placeholder or hide it. Let's just hide it now.
    let className = 'RichEditor-editor';

    var contentState = editorState.getCurrentContent();

    if (!contentState.hasText())
    {
      if (contentState.getBlockMap().first().getType() !== 'unstyled')
      {
        className += ' RichEditor-hidePlaceholder';
      }
    }

    return (
      <div className="RichEditor-root">

        <BlockStyleControls
          editorState={editorState}
          onToggle={this.toggleBlockType}
        />

        <InlineStyleControls
          editorState={editorState}
          onToggle={this.toggleInlineStyle}
        />

        <div className={className} onClick={this.focus}>
          <Editor
            editorState={editorState}
            onChange={this.onChangeEditorHandler}


            blockStyleFn={getBlockStyle}
            customStyleMap={styleMap}
            handleKeyCommand={this.handleKeyCommand}
            keyBindingFn={this.mapKeyToEditorCommand}
            placeholder="Tell a story..."
            ref="editor"
            spellCheck
          />
        </div>

      </div>
    );
  }
}



// Custom overrides for "code" style.
const styleMap = {
  CODE: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
    fontSize: 16,
    padding: 2,
  },
};

function getBlockStyle(block)
{
  switch (block.getType())
  {
    case 'blockquote': return 'RichEditor-blockquote';
    default: return null;
  }
}

class StyleButton extends React.Component
{
  constructor() {
    super();
    this.onToggle = (e) => {
      e.preventDefault();
      this.props.onToggle(this.props.style);
    };
  }
  render() {
    let className = 'RichEditor-styleButton';
    if (this.props.active) {
      className += ' RichEditor-activeButton';
    }
    return (
      <span className={className} onMouseDown={this.onToggle}>
        {this.props.label}
      </span>
    );
  }
}

const BLOCK_TYPES = [
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

const BlockStyleControls = (props) => {
  const {editorState} = props;
  const selection = editorState.getSelection();
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();
  return (
    <div className="RichEditor-controls">
      {BLOCK_TYPES.map((type) =>
        <StyleButton
          key={type.label}
          active={type.style === blockType}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
        />
      )}
    </div>
  );
};
var INLINE_STYLES = [
  {label: 'Bold', style: 'BOLD'},
  {label: 'Italic', style: 'ITALIC'},
  {label: 'Underline', style: 'UNDERLINE'},
  {label: 'Monospace', style: 'CODE'},
];

const InlineStyleControls = (props) =>
{
  const currentStyle = props.editorState.getCurrentInlineStyle();

  return (
    <div className="RichEditor-controls">
      {INLINE_STYLES.map((type) =>
        <StyleButton
          key={type.label}
          active={currentStyle.has(type.style)}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
        />
      )}
    </div>
  );
};


// class Wysiwyg extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {editorState: EditorState.createEmpty()};
//     this.onChange = (editorState) => this.setState({editorState});
//   }
//   render() {
//     return <Editor editorState={this.state.editorState} onChange={this.onChange} />;
//   }
// }

/**
* Input Component
*
* @extends Field
*/
// class Input extends Field
// class Input extends React.Component
// {
//   constructor(props) {
//     super(props);
//     this.state = {editorState: EditorState.createEmpty()};
//     this.onChange = (editorState) => this.setState({editorState});
//   }
//
//   /* !- Handlers */
//
//   /**
//    * @private
//    * @override
//    * @emits
//    * @param  {SytheticEvent} event
//    * @return {void}
//    */
//   onChangeEditorHandler = (editorState) =>
//   {
//     console.log(editorState);
//     // this.onChangeHandler(event.target.value);
//   }
//
//   handleKeyCommand(command, editorState) {
//     const newState = RichUtils.handleKeyCommand(editorState, command);
//     if (newState) {
//       this.onChange(newState);
//       return 'handled';
//     }
//     return 'not-handled';
//   }
//   /* !- Renders */
//
//   /**
//    * This method is called when render the Component instance.
//    * @override
//    * @return {ReactElement}
//    */
//   render()
//   {
//     return (
//       <div className={`field wysiwyg-field ${this.props.className}`}>
//
//         { this.label }
//
//         <div className="table">
//
//           { this.state.prefix &&
//           <div className="prefix">{this.state.prefix}</div>
//           }
//
//           <Editor
//             editorState={this.state.editorState}
//             onChange={this.onChangeEditorHandler}
//             handleKeyCommand={this.handleKeyCommand}
//           //   toolbarClassName="toolbarClassName"
//           //   wrapperClassName="wrapperClassName"
//           //   editorClassName="editorClassName"
//           //   onEditorStateChange={this.onEditorStateChange}
//           />
//
//           {/* <input
//             id={this.props.id}
//             name={this.props.name}
//
//             value={this.state.value}
//             type={this.props.type}
//             disabled={this.props.disabled}
//             readOnly={this.props.disabled}
//             maxLength={this.props.length}
//             autoComplete="new-password"
//
//             onChange={this.onChangeInputHandler}
//             onBlur={this.onBlurHandler}
//             onFocus={this.onFocusHandler}
//             placeholder={this.state.placeholder}
//
//             ref={(ref) =>
//             {
//               this.element = ref;
//             }}
//             data-name={this.props.name}
//           /> */}
//
//           { this.props.postfix &&
//           <div className="postfix">{this.state.postfix}</div>
//           }
//
//         </div>
//
//         { this.state.error &&
//           <div className="error">{this.state.error}</div>
//         }
//       </div>
//     );
//   }
// }
//
// /**
//  * propTypes
//  * @override
//  * @type {Object}
//  */
// Input.propTypes =
// {
//   ...Input.propTypes,
//   /**
//    * Specifies the type of input to display such as "password" or "email".
//    */
//   type: PropTypes.oneOf(['text', 'password', 'email', 'date', 'tel', 'number', 'datetime-local']),
//   /**
//    * Callback function that is fired when the textfield's focus lost.
//    *
//    * @param {string} newValue The new value of the text field.
//    * @param {object} event Change event targeting the text field.
//    */
//   onBlur: PropTypes.func,
//   /**
//    * Callback function that is fired when the textfield is on focus.
//    *
//    * @param {string} newValue The new value of the text field.
//    * @param {object} event Change event targeting the text field.
//    */
//   onFocus: PropTypes.func,
//   /**
//    * Regular expression to input validator
//    */
//   regexp: PropTypes.string,
//   /**
//    * Override the inline-styles of the TextField's underline element.
//    */
//   underlineStyle: PropTypes.objectOf(PropTypes.string),
//   prefix: PropTypes.oneOfType([
//     PropTypes.element,
//     PropTypes.string,
//   ]),
//   postfix: PropTypes.oneOfType([
//     PropTypes.element,
//     PropTypes.string,
//   ]),
// };
//
// /**
//  * defaultProps
//  * @override
//  * @type {Object}
//  */
// Input.defaultProps =
// {
//   ...Input.defaultProps,
//   type: 'text',
//   underlineStyle: {},
//   onBlur()
//   {},
//   onFocus()
//   {},
//   regexp: '',
//   prefix: '',
//   postfix: '',
// };

export default Wysiwyg;
