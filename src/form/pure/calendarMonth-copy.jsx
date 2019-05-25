import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import moment from 'moment';

// moment.locale('ro');


/* !- React Elements */

import Form from '../form';
import Field from '../formField';
import CalendarMonth from '../../calendar/month';
import DateTime from './datetime';


/* !- React Actions */

import { popover, close } from '../../layer/actions';
import { setValues } from '../../form/actions';


/* !- Constants */

import { DATE_FORMAT_HTML5 } from '../../calendar/constants';


/**
 * CalendarMonth Dynamic Caroussel helper
 * @param  {String} field Form field name, which store selected date value
 * @param  {Function} [onChange] invoke when value change
 * @param  {String} [value=current week] start value
 * @param  {Integer} [width] component width, default 100%
 * @return {Function}       Dynamic Caroussel component fetchData props
 */
export const fetchData = (field, onChange, value, width, initDate) =>
  (page) =>
  {
    console.log(initDate);
    // const initDate = page === 0 && value ? value : undefined;
    const items = [];

    for (let i = 0; i < 3; i += 1)
    {
      const actualPage = i + page - 1;

      items.push({
        id: i,
        slide: <CalendarMonthForm
          id={field}
          dateFormat={DATE_FORMAT_HTML5}
          value={value}
          year={moment(initDate).add(actualPage, 'months').format('YYYY')}
          month={moment(initDate).add(actualPage, 'months').format('M')}
          width={width}
          onChange={onChange}
        />,
      });
    }

    return items;
  };



/**
* Day selector. Component show selected year/month month-calendar
* where you can select one day.
* If you want more month you can use Dynamic Caroussel.
*
* @extends Field
* @example
*
* <CalendarMonth
*   id="dayselect"
*   year={2019}
*   month={8}
*   width={200}
*   dateFormat="MM-DD-YYYY"
* />
*
* @example Responsive
*
* <div style={{ width: '300px' }}>
*   <CalendarMonth
*     id="dayselect"
*   />
* </div>
*
* @example locale (hungary)
*
* import moment from 'moment';
* moment.locale('hu');
*
*/
class CalendarMonthForm extends Field
{
  constructor(props)
  {
    super(props);

    this.state.width = props.width;
    this.state.height = props.height;
  }

  /* !- Handlers */

  /**
   * Extends default onChangeHandler
   * @private
   * @override
   * @emits
   * @param  {Object} event
   * @return {void}
   */
  onChangeDateHandler = (date) =>
  {
    const valueDate = moment(this.getValue());
    const selectedDate = moment(date);

    selectedDate.hour(parseInt(valueDate.format('H')));
    selectedDate.minute(parseInt(valueDate.format('m')));

    this.onChangeHandler(
      selectedDate.format(this.props.dateFormat),
    );
  }

  componentDidMount()
  {
    super.componentDidMount();
    this.initWidth();
  }

  componentWillReceiveProps(nextProps)
  {
    super.componentWillReceiveProps(nextProps);
    this.initWidth(nextProps);
  }

  initWidth(props = this.props)
  {
    if (!props.width)
    {
      const state = {};
      state.width = this.element.offsetWidth;

      if (!props.height)
      {
        state.height = state.width;
      }

      this.setState(state);
    }
  }

  render()
  {
    const startDate = new Date(this.props.year, this.props.month - 1, 1);
    const valueDate = moment(this.getValue(), this.props.dateFormat);
    const active = [parseInt(valueDate.format('D'))];

    const classNames = (typeof this.props.classNames === 'function') ?
      this.props.classNames(startDate) : this.props.classNames;

    return (
      <div
        className="field calendar-month-field"
        ref={(ref) =>
        {
          this.element = ref;
        }}
      >

        { this.label }

        <CalendarMonth
          {...this.props}
          year={parseInt(valueDate.format('YYYY'))}
          month={parseInt(valueDate.format('M'))}
          classNames={{
            active,
            ...classNames,
          }}
          onChange={this.onChangeDateHandler}
        />


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
CalendarMonthForm.propTypes =
{
  ...CalendarMonthForm.propTypes,
  /**
   * Moment date format
   */
  dateFormat: PropTypes.string,
  /**
   * SVG width
   */
  width: PropTypes.number,
  /**
   * SVG height
   */
  height: PropTypes.number,
};

/**
 * defaultProps
 * @type {Object}
 */
CalendarMonthForm.defaultProps =
{
  ...CalendarMonthForm.defaultProps,
  value: moment().format(DATE_FORMAT_HTML5),
  width: 0,
  height: 0,
  dateFormat: DATE_FORMAT_HTML5,
};






export const CalendarMonthButton = (
{
  id,
  value,
  label,
  placeholder,
  dateFormat,
  onChange,
  className,
  buttonClassName,
  popover,
  close,
  setValues,
},
{
  form,
}) =>
{
  const onChangeCalendar = ({ id, value, form }) =>
  {
    setValues({ [id]: value }, form);
    close();
  };

  const onClickButtonHandler = (event) =>
  {
    event.preventDefault();
    popover(
      <div
        className="calendar-button-month"
      >
        <DateTime
          id={id}
          disableDay
          disableTime
          dateFormat={dateFormat}
          form={form}
          value="1900-01-01"
        />
        <CalendarMonthForm
          id={id}
          width={200}
          disableTitle
          dateFormat={dateFormat}
          onChange={onChangeCalendar}
          form={form}
        />
      </div>,
      event,
    );
  };

  const formattedValue = onChange && value ? onChange(value, moment(value)) : value;

  const fieldClass = classNames({
    field: true,
    'button-field': true,
    [className]: true,
    active: formattedValue,
  });

  return (
    <div className={fieldClass}>

      { this.label }

      <button
        onClick={onClickButtonHandler}
        className={buttonClassName}
      >
        { formattedValue || placeholder }
      </button>

      {/* { this.state.error &&
        <div className="error">{this.state.error}</div>
      } */}
    </div>
  );
};

export const CalendarButton = connect(
  ({ form }, { id }) => ({ value: form.request ? form.request[id] : undefined }),
  {
    popover,
    close,
    setValues,
  },
)(CalendarMonthButton);


/**
 * defaultProps
 * @type {Object}
 */
CalendarMonthButton.defaultProps =
{
  label: '',
  buttonClassName: '',
};

/**
 * contextTypes
 * @type {Object}
 */
CalendarMonthButton.contextTypes =
{
  store: PropTypes.object,
  id: PropTypes.string,
  form: PropTypes.string,
};


export default CalendarMonthForm;
