import React from 'react';
import { connect } from 'react-redux';
import formatThousand from '@1studio/utils/string/formatThousand';


import Form,
{
  Input,
}
from '../../../src/form/pure';

import { setValues } from '../../../src/form/actions';

const FIELDS = {
  input: {
    id: 'input',
    title: 'Title',
    disable: true,
  }
}

const ExampleForm = ({ setValues }) =>
(
  <div>
    <Form
      id="example"
      className="card p-2"
    >
      <Input
        label="Classic Field"
        id="input"
        placeholder="field use form id"
        value="init value"
      />
      <Input
        id="input"
        placeholder="Disabled"
        label="Disabled Field, you can modify only outside via Redux. See change classic field *same redux id"
        stateFormat={value => value + ' <- formated state value'}
        disabled
      />
      <Input
        label="HUF currency"
        id="huf"
        value="123456"
        stateFormat={value => formatThousand(value)}
        format={value => value.replaceAll(/[^0-9]/g, '')}
        postfix="HUF"
      />
      <Input
        form="Use_Other_Form_state"
        id="input"
        className="p-4"
        label="Field with all props (different redux store, extend classes, default value, prefix, postfix, mandatory, autofocus, custom onChange *add _, value format *backspace remove everything)"
        value="2010-01-11"
        onChange={({ id, value, form }) => setValues({ [id]: value + '_' }, form)}
        prefix="Prefix"
        postfix="postfix"
        format={(value, reduce) => reduce ? '' : value}
        mandatory
        autoFocus
      />
    </Form>
    <h1>Use auto props to fields</h1>
    <Form
      id="example2"
      fields={FIELDS}
    >
      <Input id="input" />
    </Form>
  </div>
);

export default connect(
  null,
  {
    setValues,
  },
)(ExampleForm);
