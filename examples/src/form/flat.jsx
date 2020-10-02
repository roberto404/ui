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
  CalendarMonth,
  CalendarMonthButton,
  Plain,
}
from '../../../src/form/pure/intl';

import IconFavorite from '../../../src/icon/mui/action/favorite';



import { DATE_FORMAT_HTML5 } from '../../../src/calendar/constants';

const ExampleForm = () =>
(
  <Form
    id="example"
    className="p-2 flat"
  >
    <Input
      id="input"
      label="Input"
      postfix={<IconFavorite />}
      className="postfix-inside fill-gray"
    />
    <Radio
      id="radio"
      label="Radio"
      data={[
        { id: 1, title: 'Option #1' },
        { id: 2, title: 'Option #2' },
        { id: 3, title: 'Option #3' },
        { id: 4, title: 'Option #4' },
        { id: 5, title: 'Option #5' },
      ]}
    />
    <Checkbox
      id="checkbox"
      label="Checkbox"
      data={[
        { id: 1, title: 'Option #1' },
        { id: 2, title: 'Option #2' },
      ]}
    />
    <Toggle
      id="toggle"
      label="Toggle"
    />
    <Select
      id="select"
      label="Select"
      placeholder="Please select"
      data={[
        { id: 1, title: 'Option #1' },
        { id: 2, title: 'Option #2' },
      ]}
    />
    <Dropdown
      id="dropdown"
      label="Dropdown"
      placeholder="Please select"
      data={[{ id: 1, title: '#1' }, { id: 2, title: '#2' }]}
    />
    <Textarea
      id="textarea"
      label="Textarea"
    />
    <DateTime
      id="date"
      label="Date"
      disableTime
    />
    <Button
      id="button"
      label="Button"
      data={{
        0: 'off',
        1: 'on',
      }}
      buttonClassName="border border-gray-light shadow white"
      icon={IconFavorite}
    />
    <CalendarMonthButton
      id="calendar"
      label="Calendar"
      placeholder="Please select"
      buttonClassName="input"
      stateFormat={value => value ? moment(value, DATE_FORMAT_HTML5).format('LL') : ''}
    />
    <CalendarMonth
      id="calendar"
      label="Calendar"
      width="200"
    />

    <Plain
      id="input"
      label="Input"
      postfix={<IconFavorite />}
      className="postfix-inside fill-red"
    />
    <Plain
      id="radio"
      label="Radio"
    />
    <Plain
      id="checkbox"
      label="Checkbox"
      stateFormat={value => value.length}
    />
    <Plain
      id="toggle"
      label="Toggle"
      stateFormat={value => value.toString()}
    />
    <Plain
      id="select"
      label="Select"
    />
    <Plain
      id="dropdown"
      label="Dropdown"
    />
    <Plain
      id="textarea"
      label="Textarea"
    />
    <Plain
      id="date"
      label="Date"
    />
    <Plain
      id="button"
      label="Button"
      stateFormat={value => value.toString()}
    />
    <Plain
      id="calendar"
      label="Calendar"
    />

    <div className="grid">
      <div className="col-1-2">
        <Plain
          id="calendar"
          label="Calendar"
        />
      </div>
      <div className="col-1-2">
        <Plain
          id="calendar"
          label="Calendar"
        />
      </div>
    </div>

  </Form>
);


export default ExampleForm;
