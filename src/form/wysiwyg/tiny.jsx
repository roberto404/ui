import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

// import $ from 'jquery';
// window.jQuery = $;
// import Redactor from './vendor/redactor/redactor.min';
// var Redactor = require('./vendor/redactor/redactor.js');

// console.log(jQuery);
// console.log(Redactor);
//
import { Editor } from '@tinymce/tinymce-react';

/* !- React Elements */

import Field from '../../form/formField';


// const REDACTOR_FULL = {
//   buttons: ['formatting', 'bold', 'italic', 'alignment', 'unorderedlist', 'orderedlist', 'indent', 'outdent'/*, 'horizontalrule'*/, 'fontcolor'],
//   pastePlainText: true,
//   // allowedTags: ['p', 'div', 'span', 'em', 'sub', 'ul', 'li', 'ol', 'strong', 'b', 'i', 'a', 'br'],
//   // allowedAttr: [
//   //   ['a', 'href'],
//   //   ['a', 'target']
//   // ],
//   // plugins: ['fontcolor'],
//   //           fontcolors: [
//   //               '#000', '#333', '#555', '#777', '#999', '#aaa',
//   //               '#bbb', '#ccc', '#ddd', '#eee', '#f4f4f4'
//   //           ],
//   maxHeight: 400,
// };

/**
* Textarea Component
*
* @extends Field
*/
class Wysywig extends Field
{
  /* !- Handlers */

  /**
   * @private
   * @override
   * @emits
   * @param  {SytheticEvent} event
   * @return {void}
   */
  onChangeEditorHandler = (event) =>
  {
    const value = event.target.getContent();

    if (this.validate(value))
    {
      this.onChangeHandler(value);
    }
  }



  /* !- Renders */

  /**
   * This method is called when render the Component instance.
   * @override
   * @return {ReactElement}
   */
  render()
  {
    return (
      <div className={`field textarea-field ${this.props.className}`}>

        { this.label }

        <Editor
          initialValue={this.state.value}
          init={{
            plugins: 'link image code table contextmenu paste textcolor lists',
            toolbar: 'undo redo | formatselect | bold italic forecolor backcolor | link  | alignleft aligncenter alignright | bullist numlist outdent indent | removeformat | code',
            menubar: false
          }}
          onChange={this.onChangeEditorHandler}
          apiKey="bv4yjdjo1tphlujg647fsw59fq370jhab84xrbm08t89tqrc"
        />

        { this.state.error &&
          <div className="error">{this.state.error}</div>
        }
      </div>
    );
  }
}

export default injectIntl(Wysywig);
