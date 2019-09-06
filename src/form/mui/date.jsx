import React from 'react';
import moment from 'moment';
import IntlPolyfill from 'intl';


/* !- React Elements */

// import MuiDate from 'material-ui/DatePicker';
import MuiDate from '/Users/roberto/Sites/omnibus/engine/admin/dev/node_modules/material-ui/DatePicker';
import Field from '../formField';


/* !- Constants */


/**
* Date Component
*
* @extends Field
* @example
* <DateField id="date" />
*/
class DateField extends Field
{
  /* !- Handlers */

  /**
   * @private
   * @override
   * @emits
   * @param  {SytheticEvent} event
   * @param {Date} date
   * @return {void}
   */
  onChangeInputHandler = (event, date) =>
  {
    // const value = moment(date).format('x');
    this.onChangeHandler(date);
  }

  /* !- Renders */

  /**
   * This method is called when render the Component instance.
   * @override
   * @return {ReactElement}
   */
  render()
  {
    const value = isNaN(this.state.value) || this.state.value === '' ?
      null : new Date(parseInt(this.state.value));

      console.log(this.state.value);


    return (
      <MuiDate
        value={this.state.value}
        onChange={this.onChangeInputHandler}
        formatDate={date => moment(date).format('L')}
        DateTimeFormat={IntlPolyfill.DateTimeFormat}

        floatingLabelText={this.label}
        hintText={this.props.placeholder}
        errorText={this.state.error}

        dialogContainerStyle={{ zIndex: '3000' }}
        cancelLabel="Mégsem"
        firstDayOfWeek={1}
        locale="hu"
        autoOk
        fullWidth
        mode="landscape"

        name={this.props.name}
        data-name={this.props.name}
      />
    );
  }
}

export default DateField;
