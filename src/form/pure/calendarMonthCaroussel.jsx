import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import moment from 'moment';



/* !- React Actions */

import { popover } from '../../layer/actions';


/* !- React Elements */

import Field from '../formField';
// import CalendarMonth from '../../calendar/month';
import DynamicCaroussel from '../../caroussel/dynamicCaroussel';
import { fetchData } from './calendarMonth';


/* !- Constants */

// const DIMENSION_DIVIDER = '0.6';

/**
 * Use fetchData, determine the start date to Dynamic Caroussel
 * @type {string}
 */
// const start = moment().startOf('week').subtract(1, 'weeks').format('YYYY-MM-DD');



export const CalendarMonthCarousselButton = ({ placeholder, className, label, id, value, onChange }, { store } ) =>
{
  const onClickButtonHandler = (event) =>
  {
    event.preventDefault();

    store.dispatch(popover(
      <div style={{ width: '200px', height: '200px' }}>
        <CalendarMonthCaroussel
          id={id}
        />
      </div>,
      event,
    ));
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

      <div className="label">
        { label }
      </div>

      <button
        onClick={onClickButtonHandler}
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
  ({ form }, { id }) => ({ value: form[id] }),
  // {
  //   setData: Actions.setData,
  //   // preload,
  //   // close,
  //   // modal,
  // },
)(CalendarMonthCarousselButton);


/**
 * defaultProps
 * @type {Object}
 */
CalendarMonthCarousselButton.defaultProps =
{
  label: '',
};

/**
 * contextTypes
 * @type {Object}
 */
CalendarMonthCarousselButton.contextTypes =
{
  store: PropTypes.object,
  id: PropTypes.string,
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
* />
*/
class CalendarMonthCaroussel extends Field
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

  /**
   * Extends default onChangeHandler
   * @private
   * @override
   * @emits
   * @param  {Object} event
   * @return {void}
   */
  // onChangeDateHandler = (date) =>
  // {
  //   this.onChangeHandler(
  //     moment(date).format(this.props.dateFormat),
  //   );
  // }

  // componentDidMount()
  // {
  //   super.componentDidMount();
  //   this.initWidth();
  // }

  // componentWillReceiveProps(nextProps)
  // {
  //   this.initWidth(nextProps);
  // }

  // initWidth(props = this.props)
  // {
  //   if (!props.width)
  //   {
  //     const state = {};
  //     state.width = this.element.offsetWidth;
  //
  //     if (!props.height)
  //     {
  //       state.height = state.width / props.days;
  //     }
  //
  //     this.setState(state);
  //   }
  // }

  render()
  {
    // const startDate = new Date(this.props.year, this.props.month - 1, 1);
    // const valueDate = moment(this.state.value, this.props.dateFormat);
    // const active = [];
    //
    // if (this.props.year === valueDate.format('YYYY') && this.props.month === valueDate.format('M'))
    // {
    //   active.push(parseInt(valueDate.format('D')));
    // }
    //
    //
    // const classNames = (typeof this.props.classNames === 'function') ?
    //   this.props.classNames(startDate) : this.props.classNames;

    return (
      <div
        className="field calendar-month-field"
        ref={(ref) =>
        {
          this.element = ref;
        }}
      >

        { this.label }

        <DynamicCaroussel
          id={this.props.id}
          fetchData={fetchData(this.props.id, this.props.onChange)}
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
CalendarMonthCaroussel.propTypes =
{
  ...CalendarMonthCaroussel.propTypes,
  /**
   * Start date on the day selector component
   */
  // start: PropTypes.string.isRequired,
  /**
   * Number of days of day selector component
   */
  // days: PropTypes.number,
  /**
   * Moment date format
   */
  dateFormat: PropTypes.string,
  /**
   * Form field formated moment date format
   */
  // dateLongFormat: PropTypes.string,
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
CalendarMonthCaroussel.defaultProps =
{
  ...CalendarMonthCaroussel.defaultProps,
  width: 0,
  height: 0,
  // days: 7,
  dateFormat: 'YYYY-MM-DD',
  // dateLongFormat: 'YYYY. MMM. D., dddd',
};

export default CalendarMonthCaroussel;
