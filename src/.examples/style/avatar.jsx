import React from 'react';

import Icon from '../../../src/icon/mui/action/done';

const Example = () =>
(
  <div className="p-4">

    <div className="my-2">
      <div className="avatar">
        <span>1</span>
      </div>
    </div>

    <div className="my-2">
      <div className="avatar bg-red fill-white">
        <Icon />
      </div>
    </div>

    <div className="my-2">
      <div className="avatar shadow bg-yellow text-xl">
        <span>GR</span>
      </div>
    </div>

  </div>
);


export default Example;
