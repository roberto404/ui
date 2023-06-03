import React from 'react';
import PropTypes from 'prop-types';
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
from '../../../src/form/intl';

import IconFavorite from '../../../src/icon/mui/action/favorite';

import { setValues } from '../../../src/form/actions';


import { DATE_FORMAT_HTML5 } from '../../../src/calendar/constants';

const Example = (props, { store }) =>
{
  store.dispatch(setValues({
    input: 'input text',
    radio: '2',
    checkbox: ['1', '2'],
    toggle: true,
    select: '1',
    dropdown: 1,
    textarea: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    button: true,
    calendar: '2019-08-17T20:42',
  }, 'example'));

  return (
    <Form
      id="example"
      className="p-2 flat"
      readOnly
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
    </Form>
  )
};

Example.contextTypes = {
  store: PropTypes.object,
};

export default Example;
