import React from 'react';
import moment from 'moment';

import Form,
{
  CalendarMonthButton,
  CalendarMonth,
}
from '../../../src/form/pure/intl';

import IconFavorite from '../../../src/icon/mui/action/favorite';



import { DATE_FORMAT, DATE_FORMAT_HTML5 } from '../../../src/calendar/constants';

const ExampleForm = () =>
(
  <Form
    id="example"
    className="p-2"
  >
    <div style={{ width: '300px' }}>
      <CalendarMonth
        id="dateOfBirth"
        label="field.dateOfBirth"
        placeholder="placeholder.dateOfBirth"
        dateFormat={DATE_FORMAT}
        // min="2020-08-5"
        // max="2020-08-25"
        validator={timestamp => [6, 0].indexOf(new Date(timestamp).getDay()) === -1}
      />
    </div>

    <CalendarMonthButton
      id="dateOfBirth"
      label="field.dateOfBirth"
      placeholder="placeholder.dateOfBirth"
      buttonClassName="input"
      dateFormat={DATE_FORMAT}
      // stateFormat={value => value ? moment(value, DATE_FORMAT_HTML5).format('LL') : ''}
      // format={value => value ? moment(value, DATE_FORMAT_HTML5).format(DATE_FORMAT) : ''}
      // min="2020-08-10"
      // max="2020-10-20"
      validator={timestamp => [1,3,5].indexOf(new Date(timestamp).getDay()) === -1}
    />

  </Form>
);


export default ExampleForm;
