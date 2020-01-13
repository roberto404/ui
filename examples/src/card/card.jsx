import React from 'react';

import Card from '../../../src/card/card';

const Example = () =>
(
  <div>
    <div className="heavy text-xxl pb-1">Lorem ipsum dolor</div>
    <div className="light pb-3">Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</div>
    <div className="grid-3">
      <div className="col-1-3">
        <Card
          image="https://picsum.photos/700/500"
          title="Lorem ipsum dolor"
          subTitle="Consectetur adipisicing elit, sed do eiusmod tempor incididunt."
          border
        />
      </div>
      <div className="col-1-3">
        <Card
          image="https://picsum.photos/700/500"
          title="DominoGo"
          subTitle="Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. "
          border
        />
      </div>
      <div className="col-1-3">
        <Card
          image="https://picsum.photos/700/500"
          title="Nepo"
          subTitle="Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
          border
        />
      </div>
    </div>

    <div className="heavy text-xxl pb-1 pt-4">Missing captions</div>
    <div className="grid-3">
      <div className="col-1-3">
        <Card
          image="https://picsum.photos/700/500"
          // title="Lorem ipsum dolor"
          // subTitle="Consectetur adipisicing elit, sed do eiusmod tempor incididunt."
          border
        />
      </div>
      <div className="col-1-3">
        <Card
          image="https://picsum.photos/700/500"
          // title="DominoGo"
          subTitle="Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. "
          border
        />
      </div>
      <div className="col-1-3">
        <Card
          image="https://picsum.photos/700/500"
          title="Nepo"
          // subTitle="Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
          border
        />
      </div>
    </div>

    <div className="heavy text-xxl pb-1 pt-4">Long caption</div>
    <div className="grid-3-3">
      <div className="col-1-2">
        <Card
          image="https://picsum.photos/700/500"
          title="Esse cillum dolore esse cillum dolore esse cillum dolore"
          subTitle="Consectetur adipisicing elit, sed do eiusmod tempor incididunt. Consectetur adipisicing elit, sed do eiusmod tempor incididunt. Consectetur adipisicing elit, sed do eiusmod tempor incididunt."
          border
        />
      </div>
      <div className="col-1-2">
        <Card
          image="https://picsum.photos/700/500"
          title="Lorem ipsum dolor"
          subTitle="Consectetur adipisicing elit, sed do eiusmod tempor incididunt."
          border
        />
      </div>
      <div className="col-1-2">
        <Card
          image="https://picsum.photos/700/500"
          // title="DominoGo"
          subTitle="Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. "
          border
        />
      </div>
      <div className="col-1-2">
        <Card
          image="https://picsum.photos/700/500"
          // title="DominoGo"
          subTitle="Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. "
          border
        />
      </div>
      <div className="col-1-2">
        <Card
          image="https://picsum.photos/700/500"
          title="Nepo Nepo Nepo Nepo Nepo Nepo Nepo Nepo Nepo Nepo Nepo Nepo Nepo Nepo Nepo Nepo Nepo"
          // subTitle="Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
          border
        />
      </div>
      <div className="col-1-2">
        <Card
          image="https://picsum.photos/700/500"
          title="Nepo"
          // subTitle="Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
          border
        />
      </div>
    </div>

  </div>
);


export default Example;
