
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

/* !- Components */

import IconArrowForward from '../../../src/icon/mui/navigation/arrow_forward';


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
  form,
  className,
  children,
},
context,
) =>
{
  const onClickButtonHandler = (event) =>
  {
    event.preventDefault();

    const formId = form || context.form;
    const store = context.store;

    const formState = store.getState().form;

    const ids = Array.isArray(id) ? id : [id];

    ids.forEach((formStateId) =>
    {
      const date = (formId ? formState[formId] || {} : formState)[formStateId];

      if (date)
      {
        const value = moment(date, DATE_FORMAT_HTML5).add(days, 'days').format(DATE_FORMAT_HTML5);
        store.dispatch(setValues({ id: formStateId, value }, formId));
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
  form: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.element,
};

CalendarPager.defaultProps =
{
  id: 'start',
  days: 1,
  form: '',
  className: 'outline w-auto shadow',
  children: <IconArrowForward />,
};

CalendarPager.contextTypes =
{
  form: PropTypes.string,
  store: PropTypes.object,
};

export default CalendarPager;
