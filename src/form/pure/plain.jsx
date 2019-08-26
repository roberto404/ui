import React from 'react';
// import PropTypes from 'prop-types';


/* !- React Elements */

import Field from '../formField';

import IconFalse from '../../icon/mui/content/remove';
import IconTrue from '../../icon/mui/action/done';


/**
* Input Component
*
* @extends Field
*/
class Plain extends Field
{
  /* !- Renders */

  /**
   * This method is called when render the Component instance.
   * @override
   * @return {ReactElement}
   */
  render()
  {
    const { intl, multipleData } = this.props;
    const multipleDataText = () => intl ? intl.formatMessage({ id: multipleData }) : multipleData;
    const placeholder =
      Array.isArray(this.state.value) ? multipleDataText() : this.state.placeholder;

    let value = this.state.value;
    const data = this.getData();

    // checkbox, radio
    if (data.length)
    {
      const values = Array.isArray(value) ? value : [value];

      value =
        values
          .map(v => data.find(({ id }) => id.toString() === v.toString()).title)
          .join(', ');
    }
    // toggle, button
    else if (typeof value === 'boolean')
    {
      // button data
      if (typeof data[+value] !== 'undefined')
      {
        value = data[+value];
      }
      else
      {
        value = value ? <IconTrue className="w-1 h-1" /> : <IconFalse className="w-1 h-1" />;
      }
    }

    return (
      <div className={this.getClasses('plain')}>

        { this.label }

        <div className="table">

          { this.state.prefix &&
          <div className="prefix">{this.state.prefix}</div>
          }

          { this.props.dangerouslySetInnerHTML &&
            <div dangerouslySetInnerHTML={{ '__html': value }} />
          }
          { !this.props.dangerouslySetInnerHTML &&
            <div>{value || placeholder}</div>
          }

          { this.props.postfix &&
          <div className="postfix">{this.state.postfix}</div>
          }

        </div>

        { this.state.error &&
          <div className="error">{this.state.error}</div>
        }
      </div>
    );
  }
}

export default Plain;
