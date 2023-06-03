import React from 'react';
import { convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';


/* !- React Elements */

import Form from '../../../src/form/form';
import { Input } from '../../../src/form/intl';
import Wysiwyg from '../../../src/form/wysiwyg/editor';


/* !- Constants */

const defaultValue = JSON.stringify({"blocks":[{"key":"1mseb","text":"hello bello csokis leo","type":"header-two","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}});

const format = editorState => typeof editorState === 'object' && editorState.getCurrentContent !== undefined ?
draftToHtml(convertToRaw(editorState.getCurrentContent()))
: ''

/**
 * [Example description]
 */
const Example = () =>
(
  <div>
    <h2>Custom wysiwyg</h2>
    <Form id="example">
      <Wysiwyg
        id="content"
        // value={defaultValue}
        // format={format}
        className="border rounded p-1/2"
      />

      {/* <Input
        disabled
        id="content"
        className="my-2"
      />


      <Wysiwyg
        id="content"
        value={defaultValue}
        disabled
        className="my-2"
      /> */}
    </Form>
  </div>
);

export default Example;
