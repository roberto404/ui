import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link as LinkRouter } from 'react-router-dom';

import {
  EditorState,
  RichUtils,
  Modifier,
  SelectionState,
} from 'draft-js';


/* !- Redux Actions */

import { flush } from '../../../layer/actions';



/**
 * Draft.js decorator strategy
 * 
 * @param {*} contentBlock equivalent of a paragraph
 * @param {*} callback which parts of the text to decorate (start and an end position)
 *   Eg. block content is 'Hello World' and we want to decorate the word 'World' => callback(6,10),
 * @param {*} contentState 
 * @returns 
 */
export const findLinkEntities = (contentBlock, callback, contentState) =>
  contentBlock.findEntityRanges(
    (character) =>
    {
      const entityKey = character.getEntity();

      return (
        entityKey !== null &&
        contentState.getEntity(entityKey).getType() === 'LINK'
      );
    },
    callback
  );


export const createLinkEntities = (regex, editorState, props = {}) =>
  editorState
    .getCurrentContent()
    .getBlockMap()
    .reduce(
      (editorStateWithLinks, block) =>
      {
        const blockText = block.getText();

        let match = null;

        while (match = regex.exec(blockText))
        {
          let contentState = editorStateWithLinks.getCurrentContent();

          const matchIndex = props.matchIndex || 0;

          const start = match.index + match[0].indexOf(match[matchIndex]);
          const entityKeyStart = block.getEntityAt(start);

          if (!entityKeyStart)
          {
            contentState = contentState.createEntity('LINK', 'MUTABLE', props);

            const entityKey = contentState.getLastCreatedEntityKey();
            const blockKey = block.getKey();
            
            const updatedSelection = Modifier.applyEntity(
              contentState,
              new SelectionState({
                anchorKey: blockKey,
                anchorOffset: start,
                focusKey: blockKey,
                focusOffset: start + match[matchIndex].length
              }),
              entityKey
            );

            editorStateWithLinks = EditorState.push(editorStateWithLinks, updatedSelection, 'apply-entity');
          }
        }

        return editorStateWithLinks;
      },
      editorState
    );


/**
 * Draft.js decorator component
 * decorator strategy invokes it’s callback
 */
export const Link = (props) =>
{
  const { url } = props.contentState.getEntity(props.entityKey).getData();

  const isInternalLink = 
    url.match(/^http(s)?:/) === null
    || url.indexOf(`${location.protocol}//${location.origin}`) === 0;

  const className = 'border-bottom';

  if (isInternalLink)
  {
    return (
      <LinkRouter to={url} className={className} title={props.decoratedText}>
        {props.children}
      </LinkRouter>
    );
  }

  return (
    <a href={url} className={className} target="_blank" title={props.decoratedText}>
      {props.children}
    </a>
  );
};


/**
 * Concept
 * 
 * Input field + button add link
 * 
 * Input írsz akkor state change
 * Visszatöltés
 * 
 */
class LinkForm extends Component
{
  constructor(props)
  {
    super(props);

    let value = '';

    const { editorState } = props;

    // get url
    const selection = editorState.getSelection();

    if (!selection.isCollapsed())
    {
      const contentState = editorState.getCurrentContent();
      const startKey = selection.getStartKey();
      const startOffset = selection.getStartOffset();
      const blockWithLinkAtBeginning = contentState.getBlockForKey(startKey);
      const linkKey = blockWithLinkAtBeginning.getEntityAt(startOffset);

      if (linkKey)
      {
        const linkInstance = contentState.getEntity(linkKey);
        value = (linkInstance.getData() || {}).url;
      }
    }

    this.state = { value };
  }

  onChangeInputHandler = (event) =>
  {
    this.setState({ value: event.target.value });
  }

  onClickButtonHandler = (event) =>
  {
    event.stopPropagation();
    event.preventDefault();

    if (this.state.value)
    {
      this.addLink();
    }
    else
    {
      this.removeLink();
    }
    this.context.store.dispatch(flush());
  }

  addLink = () =>
  {
    const { editorState, onChange } = this.props;

    let url = this.state.value;

    // add slash before link
    if (/^(([a-z]+\:\/\/)|(\/{1}))/.test(this.state.value))
    {
      url = '/' + url;
    }


    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(
      'LINK',
      'MUTABLE',
      { url }
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

    const newEditorState = EditorState.set(editorState, { currentContent: contentStateWithEntity });

    onChange(
      RichUtils.toggleLink(
        newEditorState,
        newEditorState.getSelection(),
        entityKey
      ),
    );
  }

  removeLink = () =>
  {
    const { editorState, onChange } = this.props;

    const selection = editorState.getSelection();

    if (!selection.isCollapsed())
    {
      onChange(
        RichUtils.toggleLink(editorState, selection, null)
      );
    }
  }

  render()
  {
    const {
      buttonLabel
    } = this.props;

    return (
      <div className="v-center">
        <input
          id="url"
          className="border px-1 text-s text-gray-dark rounded shadow"
          value={this.state.value}
          onChange={this.onChangeInputHandler}
          style={{
            width: 250,
          }}
        />

        <button
          className="ml-1 bg-gray text-white shadow w-auto hover:bg-black"
          onClick={this.onClickButtonHandler}
        >
          {buttonLabel}
        </button>
      </div>
    )
  }
};

LinkForm.defaultProps =
{
  buttonLabel: 'Insert',
}

LinkForm.contextTypes = 
{
  store: PropTypes.object,
}


export default LinkForm;