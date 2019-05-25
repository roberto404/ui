import React from 'react';
// import PropTypes from 'prop-types';


/* !- React Elements */

import Field from '../../form/formField';


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
    const placeholder = Array.isArray(this.state.value) ? multipleDataText() : this.state.placeholder;
    const value = (Array.isArray(this.state.value) ? '' : this.state.value) || placeholder;

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
            <div>{value}</div>
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
