import React from 'react';

/* !- React Elements */

import Form,
{
  Input,
  Submit,
}
from '../../../src/form/pure';

import Icon from '@1studio/ui/icon/mui/action/open_with';

/* !- Constants */

const fakeApi = () => new Promise(resolve => resolve({ status: 'SUCCESS', records: ['foo'] }));



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
      className="_card p-2"
      onSuccess={(respond => console.log(response))}
      onFailed={(respond => console.log(response))}
    >
      <Input
        id="input"
        label="Input"
      />

      <Submit
        api={fakeApi}
      />
    </Form>
  </div>
);

export default Example;
