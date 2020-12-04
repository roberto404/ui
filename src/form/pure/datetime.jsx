import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import produceNumericArray from '@1studio/utils/array/produceNumericArray';


/* !- React Elements */

import Field from '../formField';
import Select from './select';


/* !- Constants */

import { DATE_FORMAT_HTML5 } from '../../calendar/constants';

const NOW = new Date();

const SELECT_DATA_HELPER = i => ({ id: i, title: i.toString() });

const YEAR_DATA = produceNumericArray(
  1900,
  NOW.getFullYear(),
  i => ({ id: i, title: i.toString() }),
);

const MONTH_DATA = produceNumericArray(
  1,
  12,
  i => ({ id: i, title: moment().month(i - 1).format('MMM') }),
);
const HOUR_DATA = produceNumericArray(0, 24, SELECT_DATA_HELPER);

const MINUTE_DATA = produceNumericArray(0, 3, i => ({ id: i * 15, title: (i * 15).toString() }));


/**
* Classic Dropdown date/time fields
* @extends Field
*
* @example
* <DateTime id="datetime" />
*
* @example
* <DateTime
*   id="datetime"
*   value="1979-12-08T12:30"
*   disableTime
*   disaleData
* />
*/
class DateTime extends Field
{
  // componentWillMount()
  // {
  //   super.componentWillMount();
  //
  //   const { id, value } = this.props;
  //
  //   this.context.store.dispatch(setValues(
  //     { [id]: value },
  //     this.context.form,
  //   ));
  // }

  /**
   * Override default onChangeDateHandler
   * @private
   * @override
   * @emits
   * @param  {Object} event
   * @return {void}
   */
  onChangeDateHandler = method =>
    (payload) =>
    {
      if (!this.state.value)
      {
        return;
      }

      const date = moment(this.state.value, this.props.dateFormat);

      if (method === 'month')
      {
        date.month(parseInt(payload.value) - 1);
      }
      else
      {
        date[method](payload.value);
      }

      this.onChangeHandler(date.format(this.props.dateFormat));
    }

  stateFormat = format =>
    value => parseInt(moment(value, this.props.dateFormat).format(format));


  render()
  {
    return (
      <div
        className={`field date-field ${this.props.className}`}
      >

        { this.label }

        { this.props.disableDate === false &&
        <div className="date-fields">

          <Select
            id={this.props.id}
            data={this.props.yearData}
            stateFormat={this.stateFormat('YYYY')}
            onChange={this.onChangeDateHandler('year')}
            form={this.props.form}
            disableLabel
          />

          <Select
            id={this.props.id}
            data={this.props.monthData}
            stateFormat={this.stateFormat('MM')}
            onChange={this.onChangeDateHandler('month')}
            form={this.props.form}
            disableLabel
          />

          { this.props.disableDay === false &&
          <Select
            id={this.props.id}
            data={(state, value) =>
              produceNumericArray(
                1,
                moment(value, this.props.dateFormat).endOf('month').format('DD'),
                SELECT_DATA_HELPER,
              )
            }
            stateFormat={this.stateFormat('DD')}
            onChange={this.onChangeDateHandler('date')}
            form={this.props.form}
            disableLabel
          />
          }

        </div>
        }

        { this.props.disableTime === false &&
        <div className="time-fields">

          <Select
            id={this.props.id}
            data={this.props.hourData}
            stateFormat={this.stateFormat('HH')}
            onChange={this.onChangeDateHandler('hour')}
            form={this.props.form}
          />

          <div className="field time-colon">:</div>

          <Select
            id={this.props.id}
            data={this.props.minuteData}
            stateFormat={this.stateFormat('mm')}
            onChange={this.onChangeDateHandler('minute')}
            form={this.props.form}
          />
        </div>
        }

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
DateTime.propTypes =
{
  ...DateTime.propTypes,
  /**
   * Visibility of date fields
   */
  disableDate: PropTypes.bool,
  /**
   * Visibility of day fields
   */
  disableDay: PropTypes.bool,
  /**
   * Visibility of date time
   */
  disableTime: PropTypes.bool,
};

/**
 * defaultProps
 * @type {Object}
 */
DateTime.defaultProps =
{
  ...DateTime.defaultProps,
  dateFormat: DATE_FORMAT_HTML5,
  value: moment().format(DATE_FORMAT_HTML5),
  disableDate: false,
  disableTime: false,
  disableDay: false,
  yearData: YEAR_DATA,
  monthData: MONTH_DATA,
  hourData: HOUR_DATA,
  minuteData: MINUTE_DATA,
};

export default DateTime;
