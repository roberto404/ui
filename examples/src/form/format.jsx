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
      <div>
        <div><b>format: </b>modify value before send redux</div>
        <div className="py-1 italic text-s">* FormField value will transform before transfer to redux reducer.</div>
        <div className="pt-1 pb-2 text-s bold">FormField change => call FormField onChangeHandler => the formated value pass to [props|context].onChange => default is Redux setValues action</div>

        <div className="py-1 pb-2 italic text-s">[REDUX CHANGED]</div>
        <div><b>stateFormat: </b>modify redux value.</div>
        <div className="py-1 italic text-s mb-2">* FormField state.value will be visible on the field</div>
      </div>

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
