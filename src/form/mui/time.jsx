import React from 'react';
// import moment from 'moment';
// import IntlPolyfill from 'intl';


/* !- React Elements */

// import MuiDate from 'material-ui/DatePicker';
import MuiTime from 'material-ui/TimePicker';
// import MuiTime from '/Users/roberto/Sites/omnibus/engine/admin/dev/node_modules/material-ui/DatePicker';
import Field from '../formField';


/* !- Constants */

// require('intl/locale-data/jsonp/hu');
//
// moment.locale('hu');


/**
* Date Component
*
* @extends Field
* @example
* <TimeField id="date" />
*/
class TimeField extends Field
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
    // console.log(event, date);
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

    return (
      <MuiTime
        value={this.state.value}
        onChange={this.onChangeInputHandler}
        // formatDate={date => moment(date).format('L')}
        // DateTimeFormat={IntlPolyfill.DateTimeFormat}

        floatingLabelText={this.label}
        hintText={this.props.placeholder}
        errorText={this.state.error}

        dialogContainerStyle={{ zIndex: '3000' }}
        cancelLabel="Mégsem"
        // firstDayOfWeek={1}
        // locale="hu"
        autoOk
        fullWidth
        format="24hr"

        name={this.props.name}
        data-name={this.props.name}
      />
    );
  }
}

export default TimeField;
