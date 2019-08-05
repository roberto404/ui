import React from 'react';


import Form,
{
  Input,
}
from '../../../src/form/pure';

import Connect from '../../../src/form/connect';


const Example = () =>
(
  <div>
    <Form
      id="example"
      className="card p-2"
    >
      <Input
        label="Classic Field"
        id="input"
        placeholder="..."
      />
      <Connect
        UI={({ input }) => <div className="text-blue text-xl">{input}</div>}
      />
    </Form>
  </div>
);

export default Example;
