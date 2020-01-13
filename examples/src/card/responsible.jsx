import React from 'react';

import Card from '../../../src/card/card';


const onClickButton = (e) =>
{
  e.preventDefault();
  document.body.style.fontSize = '4rem';
}

const Example = () =>
(
  <div>
    <div onClick={onClickButton}>Change size</div>

    <div className="heavy text-xxl py-2">Col-1-2</div>
    <div className="grid-3" style={{ fontSize: '50%' }}>
      <div className="col-1-2">
        <Card
          image="https://picsum.photos/700/500"
          title="Lorem"
          // title="Lorem ipsum dolor"
          // subTitle="Consectetur adipisicing elit, sed do eiusmod tempor incididunt."
          border
        />
      </div>
      <div className="col-1-2">
        <Card
          image="https://picsum.photos/700/500"
          title="DominoGo"
          // subTitle="Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. "
          border
        />
      </div>
    </div>


    <div className="heavy text-xxl py-2">Col-1-3</div>
    <div className="grid-3 mobile:hidden">
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


    <div className="heavy text-xxl py-2">Col-2-12</div>
    <div className="grid-3 mobile:hidden">
      <div className="col-2-12">
        <Card
          image="https://picsum.photos/700/500"
          title="Lorem ipsum dolor"
          // subTitle="Consectetur adipisicing elit, sed do eiusmod tempor incididunt."
          border
        />
      </div>
      <div className="col-2-12">
        <Card
          image="https://picsum.photos/700/500"
          title="DominoGo"
          // subTitle="Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. "
          border
        />
      </div>
      <div className="col-2-12">
        <Card
          image="https://picsum.photos/700/500"
          title="Nepo"
          // subTitle="Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
          border
        />
      </div>
      <div className="col-2-12">
        <Card
          image="https://picsum.photos/700/500"
          title="Lorem ipsum dolor"
          // subTitle="Consectetur adipisicing elit, sed do eiusmod tempor incididunt."
          border
        />
      </div>
      <div className="col-2-12">
        <Card
          image="https://picsum.photos/700/500"
          title="DominoGo"
          // subTitle="Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. "
          border
        />
      </div>
      <div className="col-2-12">
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
