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
  <div>
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

      <Input
        id="input5"
        label="Input"
        prefix={<IconFavorite />}
        className="prefix-inside fill-blue"
        placeholder="placeholder"
      />

      <Input
        id="input6"
        label="Input"
        value="disabled"
        disabled
      />

    </div>

    <h2>small gray with floated postfix</h2>

    <div className='mt-4 flex'>
      <Input
        id="input234"
        value="234"
        className="postfix-inside postfix-float gray small m-0 w-6 mr-1"
        postfix={<div className="text-xs text-gray bg-gray-light">x</div>}
        type="number"
      />
      <Input
        id="input234"
        value="234"
        className="postfix-inside postfix-float gray small m-0 w-6 mr-1"
        postfix={<div className="text-xs text-gray bg-gray-light">y</div>}
        type="number"
      />
      <Input
        id="input234"
        value="234"
        className="postfix-inside postfix-float gray small m-0 w-6"
        postfix={<div className="text-xs text-gray bg-gray-light">z</div>}
        type="number"
      />
    </div>
  </div>
);


export default ExampleForm;
