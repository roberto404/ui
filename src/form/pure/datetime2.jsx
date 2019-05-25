import React from 'react';
// import PropTypes from 'prop-types';


/* !- React Elements */

import Field from '../formField';
// import CalendarMonth from '../../calendar/month';
import DynamicCaroussel, { CAROUSSEL_SETTINGS } from '../../caroussel/dynamicCaroussel';
import { fetchData } from './calendarMonth';


// import
// {
//   Select,
// } from './intl';
import Select from './select';

/* !- React Actions */

import { setValues } from '../actions';
import { setSettings } from '../../grid/actions';


/* !- Constants */

import { DATE_FORMAT_HTML5 } from '../../calendar/constants';


/* !- Locale */

import moment from 'moment';

moment.locale('hu');




/**
*
* @extends Field
* @example
*
* <CalendarMonth
* />
*/
class DateTime extends Field
{
  // constructor(props)
  // {
  //   super(props);
  //
  //   this.state = {
  //     width: props.width,
  //     height: props.height,
  //   };
  // }

  /* !- Handlers */

  onChangeDateHandler = (payload) =>
  {
    const time = this.state.value.substring(this.state.value.indexOf('T') + 1) || '00:00';
    const relay = {
      id: payload.id,
      value: payload.value.substring(0, payload.value.indexOf('T') + 1) + time,
    };

    if (this.props.onChange)
    {
      this.props.onChange(relay);
    }
    else
    {
      this.context.store.dispatch(setValues(
        { [relay.id]: relay.value },
        payload.form,
      ));
    }
  }

  /**
   * Override default onChangeHandler
   * @private
   * @override
   * @emits
   * @param  {Object} event
   * @return {void}
   */
  onChangeTimeHandler = (payload) =>
  {
    const partId = payload.id.substring(payload.id.indexOf('@') + 1);

    if (!this.state.value)
    {
      return;
    }

    const date = moment(this.state.value, DATE_FORMAT_HTML5);
    date[partId](payload.value);

    const relay = {
      id: this.props.id,
      value: date.format(DATE_FORMAT_HTML5),
    };

    if (this.props.onChange)
    {
      this.props.onChange(relay);
    }
    else
    {
      this.context.store.dispatch(setValues(
        { [relay.id]: relay.value },
        payload.form,
      ));
    }
  }

  render()
  {
    const hours = [];

    // hack!, azert kell, mert api autoload legyen a default érték
    // sokkal jobb lenne ha a dynamic caroussellel lehetne kommunikálni,
    // hogy hányadik felső oldalra lépjen
    if (this.initValue === undefined)
    {
      this.initValue = this.state.value;
    }

    for (let i = 0; i < 24; i += 1)
    {
      hours.push({ id: i, title: i.toString() });
    }

    return (
      <div
        className={`field date-field ${this.props.className}`}
      >

        { this.label }

        <div className="calendar-field">
          <DynamicCaroussel
            id={this.props.id}
            fetchData={fetchData(
              this.props.id,
              this.onChangeDateHandler,
              this.state.value,
              this.props.width,
              this.initValue || undefined,
            )}
          />
        </div>

        <div className="time-fields">

          <Select
            id={`${this.props.id}@hour`}
            data={hours}
            value={parseInt(moment(this.state.value, DATE_FORMAT_HTML5).format('HH'))}
            onChange={this.onChangeTimeHandler}
            prefix="óra"
          />

          <div className="field time-colon">:</div>

          <Select
            id={`${this.props.id}@minute`}
            data={[
              { id: 0, title: '00' },
              { id: 15, title: '15' },
              { id: 30, title: '30' },
              { id: 45, title: '45' },
            ]}
            value={parseInt(moment(this.state.value, DATE_FORMAT_HTML5).format('mm'))}
            onChange={this.onChangeTimeHandler}
            prefix="perc"
          />
        </div>

        { this.state.error &&
          <div className="error">{this.state.error}</div>
        }
      </div>
    );
  }
}

/**
 * propTypes
 * @override
 * @type {Object}
 */
// DateTime.propTypes =
// {
//   ...DateTime.propTypes,
//   /**
//    * Start date on the day selector component
//    */
//   // start: PropTypes.string.isRequired,
//   /**
//    * Number of days of day selector component
//    */
//   // days: PropTypes.number,
//   /**
//    * Moment date format
//    */
//   dateFormat: PropTypes.string,
//   /**
//    * Form field formated moment date format
//    */
//   // dateLongFormat: PropTypes.string,
//   /**
//    * SVG width
//    */
//   width: PropTypes.number,
//   /**
//    * SVG height
//    */
//   height: PropTypes.number,
// };

/**
 * defaultProps
 * @type {Object}
 */
// DateTime.defaultProps =
// {
//   ...DateTime.defaultProps,
//   width: 0,
//   height: 0,
//   // days: 7,
//   dateFormat: 'YYYY-MM-DD',
//   // dateLongFormat: 'YYYY. MMM. D., dddd',
// };

// DateTime.contextTypes =
// {
//   store: PropTypes.object,
// };

export default DateTime;
