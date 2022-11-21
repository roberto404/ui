import React, { Component } from 'react';

/* !- React Elements */

import Form,
{
  Input,
  Submit,
}
from '../../../src/form/pure';
import InputStandalone from '../../../src/form/pure/inputStandalone';

import Icon from 'src/icon/mui/action/open_with';

/* !- Constants */

const fakeApi = () => new Promise(resolve => setTimeout(() => resolve({ status: 'SUCCESS', records: ['foo'] }), 1000));



const CustomSubmit = ({ onClick }) =>
(
  <div className="pin-br w-auto column center p-3">
    <button className="action large red shadow mt-1/2" onClick={onClick}><Icon /></button>
  </div>
)

const CustomSubmit2 = ({ onClick }) =>
  <button className="blue" onClick={onClick}><Icon /></button>





/**
 * [Example description]
 */
const Example = () =>
(
  <div>
    <h2>Private callback</h2>

    <Form
      id="example"
      className="_card p-2"
    >
      <Input
        id="input"
        label="Input"
      />

      <Submit
        label="Send"
        api={fakeApi}
      />

      <Submit
        api={fakeApi}
        children={<CustomSubmit2 />}
      />

      <Submit
        api={fakeApi}
      >
        <CustomSubmit />
      </Submit>

      <Submit
        api={fakeApi}
        onFinish={({ status, records }) =>
        {
          console.log(status, records);
          // if (status === 'SUCCESS')
          // {
          //   setValues(records, 'product');
          //   modifyRecord(records, 'product');
          //   close();
          // }
        }}
      />

    </Form>


    <h2>Predefined callback</h2>

    <Form
      id="example"
      scheme={{
        input: {
          presence: {
            message: '^validator.presence',
          },
        },
      }}
      className="h-center"
      onSuccess={(response => console.log(response))}
      onFailed={(response => console.log(response))}
    >
      <Input
        id="input"
        prefix="Input"
        className="m-0 mr-2"
      />

      <Submit
        className="m-0"
        api={fakeApi}
      />
    </Form>

    <InputStandalone
      prefix="Input"
      buttonLabel="Submit"
      onSubmit={({ value }) => fakeApi()}
      onSuccess={response => console.log(response)}
    />
  </div>
);

export default Example;
