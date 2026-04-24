import React from 'react';


import Form from '@1studio/ui/form/form';
import Input from '@1studio/ui/form/components/input';
import Checkbox from '@1studio/ui/form/components/checkbox';

export const postfix = ' [formated]';

export const format = (value) => {
  return value.replace(postfix, '');
}

export const stateFormat = (value) => {
  return value + postfix;
}


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
        stateFormat={stateFormat}
        format={format}
      />

      <Checkbox
        label="Demostrate how to use checkbox array singleton i/o string"
        id="checkbox"
        data={[{ id: 1, title: 'apply' }]}
        stateFormat={(value) =>
        {
          const nextValue = value ? [value] : [];
          return nextValue;
        }}
        format={(value, reduce) =>
        {
          const nextValue = value[0];
          return nextValue;
        }}
      />

    </Form>
  </div>
);

export default ExampleForm;
