
import React, { useContext } from 'react';
import { ReactReduxContext } from 'react-redux';
import { FormContext } from '../../form/context';
import PropTypes from 'prop-types';
import moment from 'moment';
import isEmpty from 'lodash/isEmpty';

/* !- Components */

import IconArrowForward from '../../icon/mui/navigation/arrow_forward';


/* !- Actions */

import { setValues } from '../../form/actions';


/* !- Constants */

import { DATE_FORMAT_HTML5 } from '../../calendar/constants';

/**
 * Calendar Pager
 * @example
 * // -> Simple
 * <Pager days={2} />
 *
 * // -> Full
 * <Pager
 *  id={['start', 'end']}
 *  days={5}
 *  form="example"
 *  className="blue"
 * >
 *  <span>View next 5 days</span>
 * </Pager>
 */
export const CalendarPager = (
{
  id,
  days,
  months,
  date,
  form,
  className,
  children,
}) =>
{
  const { store } = useContext(ReactReduxContext);
  const context = useContext(FormContext);



  const onClickButtonHandler = (event) =>
  {
    event.preventDefault();

    const formId = form || context?.form;

    const formState = store.getState().form;

    const ids = Array.isArray(id) ? id : [id];

    ids.forEach((formStateId, index) =>
    {
      let momentDate;

      if (date instanceof Date || !isEmpty(date))
      {
        if (date instanceof Date)
        {
          momentDate = moment(date);
        }
        else if (Array.isArray(date))
        {
          momentDate = moment(date[index]);
        }
        else if (typeof date === 'object')
        {
          momentDate = moment(date[formStateId]);
        }
      }
      else
      {
        const value = (formId ? formState[formId] || {} : formState)[formStateId];

        momentDate = moment(value, DATE_FORMAT_HTML5);

        if (months)
        {
          momentDate.add(months, 'months');
        }
        else
        {
          momentDate.add(days, 'days');
        }
      }

      if (momentDate && !isNaN(momentDate.toDate()))
      {
        store.dispatch(
          setValues({
            id: formStateId,
            value: momentDate.format(DATE_FORMAT_HTML5),
          }, formId),
        );
      }
    });
  };


  return (
    <button
      className={className}
      onClick={onClickButtonHandler}
    >
      {children}
    </button>
  );
};


CalendarPager.propTypes =
{
  id: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  days: PropTypes.number,
  months: PropTypes.number,
  date: PropTypes.oneOfType([
    PropTypes.instanceOf(Date),
    PropTypes.arrayOf(PropTypes.instanceOf(Date)),
    PropTypes.objectOf(PropTypes.instanceOf(Date)),
  ]),
  form: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.element,
};

CalendarPager.defaultProps =
{
  id: 'start',
  days: 1,
  months: 0,
  date: [],
  form: '',
  className: 'outline w-auto shadow',
  children: <IconArrowForward />,
};


export default CalendarPager;
