import React from 'react';
import moment from 'moment';

import Form,
{
  Input,
  Radio,
  Checkbox,
  Toggle,
  Select,
  Textarea,
  DateTime,
  Dropdown,
  Button,
  Submit,
  CalendarMonthButton,
  CalendarMonth,
}
from '../../../src/form/pure/intl';

import IconFavorite from '../../../src/icon/mui/action/favorite';



import { DATE_FORMAT_HTML5 } from '../../../src/calendar/constants';

const ExampleForm = () =>
(
  <div
    className="p-2 bg-white form active"
  >
    <Input
      id="input"
      label="Input"
      value="something is complete."
      className="transparent"
      complete
    />
    <Input
      id="input2"
      label="Input"
      preload
    />

    <Input
      id="input3"
      label="Input"
      error="Something went wrong."
    />

    <Input
      id="input4"
      label="Input"
      postfix={<IconFavorite />}
      className="postfix-inside fill-blue complete"
    />

  </div>
);


export default ExampleForm;
