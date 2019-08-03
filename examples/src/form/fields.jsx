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
  <Form
    id="example"
    className="p-2"
  >
    <Input
      id="input"
      label="Input"
      postfix={<IconFavorite />}
      className="postfix-inside fill-blue"
    />

    {/*<Radio
      id="radio"
      label="Radio"
      data={[
        { id: 1, title: 'Option #1' },
        { id: 2, title: 'Option #2' },
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

    <Dropdown
      id="dropdown-multiple"
      label="Multiple Dropdown"
      placeholder="Please select"
      data={[{ id: 1, title: '#1' }, { id: 2, title: '#2' }]}
      multiple
    />

    <Textarea
      id="textarea"
      label="textarea"
    />

    <DateTime
      id="date"
      label="date"
      disableTime
    />

    <DateTime
      id="time"
      label="time"
      disableDate
    />

    <DateTime
      id="year-month"
      label="year/month"
      disableTime
      disableDay
    />*/}


    <Button
      id="button"
      label="button"
      data={{
        0: 'off',
        1: 'on',
      }}
      buttonClassName="blue"
      icon={IconFavorite}
    />

    <Button
      id="button2"
      label="button"
      onClick={() => false}
      stateFormat={v => v}
      buttonClassName="blue"
      postfix={<IconFavorite />}
    />

    <CalendarMonthButton
      id="dateOfBirth"
      label="field.dateOfBirth"
      placeholder="placeholder.dateOfBirth"
      buttonClassName="input"
      stateFormat={value => value ? moment(value, DATE_FORMAT_HTML5).format('LL') : ''}
    />

    {/*


    <Multiple
      id="multiple"
      label="Multiple"
      placeholder="Please select"
      data={[{ id: 1, title: 'elso' }, { id: 2, title: 'masodik' }]}
    />
    <Multiple
      id="nested_menu"
      label="Nested"
      placeholder="Please select"
      data={[
        {
          id: 1,
          title: 'first item',
          children: [
            { id: 11, title: '1.1' },
            { id: 12, title: '1.2' },
          ],
        },
        {
          id: 2,
          title: 'second item',
          children: [
            { id: 21, title: '2.1' },
            { id: 22, title: '2.2' },
          ],
        },
      ]}
    />*/}


    {/*<Submit />*/}

  </Form>
);


export default ExampleForm;
