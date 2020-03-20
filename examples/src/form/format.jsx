import React from 'react';
import { connect } from 'react-redux';


import Form,
{
  Input,
  Checkbox,
}
from '../../../src/form/pure';



const ExampleForm = () =>
(
  <div>
    <Form
      id="example"
      className="card p-2"
    >

      <Input
        id="input"
        label="Demostrate format and stateFormat data manipulation"
        stateFormat={value => value + ' <- formated component value, user sees it *** Run first!!!'}
        format={(value, reduce) => {
          console.log(`input value (not state formated): ${value}`);
          console.log(`reduce: ${reduce}`);
          return value;
        }}
      />

      <Checkbox
        label="Manipulate state value. Convert array to i/o string"
        id="checkbox"
        data={[{ id: 1, title: 'apply' }]}
        stateFormat={(value) =>
        {
          const nextValue = value ? [value] : [];

          console.log(`state input value: ${JSON.stringify(value)}`);
          console.log(`state output value: ${JSON.stringify(nextValue)}`);

          return nextValue;
        }}
        format={(value, reduce) =>
        {
          const nextValue = value[0];

          console.log(`input value for format: ${JSON.stringify(value)}`);
          console.log(`formated state value: ${JSON.stringify(nextValue)}`);

          return nextValue;
        }}
      />

    </Form>
  </div>
);

export default ExampleForm;
