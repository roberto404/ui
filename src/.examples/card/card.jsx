import React from 'react';

import Card from '../../../src/card/card';

const Example = () => (
  <div>
    <div className='relative'>

      <div className='col-7-12'>
        <Card
          image="https://picsum.photos/700/500"
          border
        />
      </div>
      <div className='col-6-12 absolute pin-r pin-t my-4' style={{ height: 'calc(100% - 12rem)' }}>

        <Card
          color="#FFFFFF"
          title="Lorem ipsum dolor"
          subTitle="Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
          classNameCaption='p-4 w-full'
          classNameTitle="text-black text-xl bold mb-2"
          button="Title of Button"
        />
      </div>
    </div>
  </div>
)

const Example2 = () =>
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
        {/* <Card
          image="https://picsum.photos/700/500"
          title="DominoGo"
          subTitle="Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. "
          border
        /> */}
        <Card
          color="#00853E"
          title="DominoGo"
          subTitle="Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. "
          // border
          classNameCaption='p-2 w-full'
          classNameTitle="text-white text-xl bold"
          button="title"
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
