import React from 'react';

/* !- React Elements */

import MuiToogle from 'material-ui/Toggle';
import Field from '../formField';

/**
* Toggle Component
*
* @extends Field
* @example
<Toggle
  id="status"
  label="Status"
  value={1}
  onChange={(relay) =>
  {
    console.log(relay.id, relay.value, relay.form);
  }}

  error="Something wrong"
  mandatory
/>
*/
class Toggle extends Field
{
  /**
   * This method is called when render the Component instance.
   * @override
   * @return {ReactElement}
   */
  render()
  {
    return (
      <div>
        <MuiToogle
          id={this.props.id}
          toggled={!!parseInt(this.state.value)}
          onToggle={(event, boolValue) => this.onChangeHandler(+boolValue)}

          label={this.label}
          disabled={this.props.disabled}

          labelPosition={'right'}
        />

        <div className="error">{this.state.error}</div>
      </div>
    );
  }
}

export default Toggle;
