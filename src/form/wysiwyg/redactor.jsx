import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import $ from 'jquery';
// window.jQuery = $;
// import Redactor from './vendor/redactor/redactor.min';
var Redactor = require('./vendor/redactor/redactor.js');

// console.log(jQuery);
// console.log(Redactor);

/* !- React Elements */

import Field from '../../form/formField';


const REDACTOR_FULL = {
  buttons: ['formatting', 'bold', 'italic', 'alignment', 'unorderedlist', 'orderedlist', 'indent', 'outdent'/*, 'horizontalrule'*/, 'fontcolor'],
  pastePlainText: true,
  // allowedTags: ['p', 'div', 'span', 'em', 'sub', 'ul', 'li', 'ol', 'strong', 'b', 'i', 'a', 'br'],
  // allowedAttr: [
  //   ['a', 'href'],
  //   ['a', 'target']
  // ],
  // plugins: ['fontcolor'],
  //           fontcolors: [
  //               '#000', '#333', '#555', '#777', '#999', '#aaa',
  //               '#bbb', '#ccc', '#ddd', '#eee', '#f4f4f4'
  //           ],
  maxHeight: 400,
};

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
  onChangeRedactorHandler = () =>
  {
    this.disableReload = true;
    const value = $(this.element).redactor('code.get');

    if (this.validate(value))
    {
      this.onChangeHandler(value);
    }
  }

  componentDidMount()
  {
    super.componentDidMount();

    $(this.element).redactor({
      ...REDACTOR_FULL,
      changeCallback: this.onChangeRedactorHandler,
    });
  }


  /* !- Renders */

  /**
   * This method is called when render the Component instance.
   * @override
   * @return {ReactElement}
   */
  render()
  {
    if (!this.disableReload)
    {
      $(this.element).redactor('code.set', this.state.value);
    }
    else
    {
      this.disableReload = false;
    }

    return (
      <div className={`field textarea-field ${this.props.className}`}>

        { this.label }

        <textarea
          id={this.props.id}
          name={this.props.name}
          value={this.state.value}

          ref={(ref) =>
          {
            this.element = ref;
          }}
          data-name={this.props.name}
        />

        { this.state.error &&
          <div className="error">{this.state.error}</div>
        }
      </div>
    );
  }
}

export default injectIntl(Wysywig);
