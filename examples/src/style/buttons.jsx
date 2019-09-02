import React from 'react';

import Icon from '../../../src/icon/mui/action/done';
import IconPlus from '../../../src/icon/mui/content/add';
import IconDuplicate from '../../../src/icon/mui/content/add';
import IconDelete from '../../../src/icon/mui/content/remove';
import IconArrow from '../../../src/icon/mui/navigation/expand_more';

const ExampleForm = () =>
(
  <div>
    {/*
    <div className="pin-br column w-auto center p-3">
      <button className="action small gray mb-1"><Icon /></button>
      <button className="action small gray mb-1"><Icon /></button>
      <button className="action large red shadow mt-1/2"><Icon /></button>
    </div>
    */}

    <div className="buttons action">
      <button><IconDelete /></button>
      <button><IconDuplicate /></button>
      <button><IconPlus /></button>
    </div>

    <h2>Colored Buttons</h2>
    <div className="grid-2 card">
      <div className="col-1-4">
        <button>no-class</button>
      </div>
      <div className="col-1-4">
        <button className="blue">blue</button>
      </div>
      <div className="col-1-4">
        <button className="black">black</button>
      </div>
      <div className="col-1-4">
        <a className="button green">green</a>
      </div>
    </div>

    <h2>Sized Buttons</h2>
    <div className="grid-2 card">
      <div className="col-1-4">
        <button className="gray">gray</button>
      </div>
      <div className="col-1-4">
        <button className="blue small">small</button>
      </div>
      <div className="col-1-4">
        <a className="button green large">large</a>
      </div>
      <div className="col-1-4">
        <a className="button primary large">primary</a>
      </div>
    </div>

    <h2>Action Buttons</h2>
    <div className="grid-2 card">
      <div className="col-1-4">
        <button className="primary">primary</button>
      </div>
      <div className="col-1-4">
        <button className="secondary">secondary</button>
      </div>
      <div className="col-1-4">
        <button className="warn">warn</button>
      </div>
      <div className="col-1-4">
        <a className="button disabled">disabled</a>
      </div>
    </div>

    <h2>Outlined Buttons</h2>
    <div className="grid-2 card">
      <div className="col-1-4">
        <button className="">normal</button>
      </div>
      <div className="col-1-4">
        <a className="button outline">outline</a>
      </div>
      <div className="col-1-4">
        <button className="outline yellow">yellow</button>
      </div>
      <div className="col-1-4">
        <button className="outline blue">blue</button>
      </div>
    </div>

    <h2>Icon Buttons</h2>
    <div className="grid-2 card">
      <div className="col-1-4">
        <button className=""><Icon /><span>normal</span></button>
      </div>
      <div className="col-1-4">
        <a className="button outline"><Icon /><span>outline</span></a>
      </div>
      <div className="col-1-4">
        <button className="blue"><Icon /><span>yellow</span></button>
      </div>
      <div className="col-1-4">
        <button className="outline blue"><Icon /><span>blue</span></button>
      </div>
    </div>

    <h2>Right Action Icon Buttons</h2>
    <div className="grid-2 card">
      <div className="col-1-4">
        <button className="embed-lock">normal</button>
      </div>
      <div className="col-1-4">
        <a className="button outline embed-lock"><Icon /><span>outline</span></a>
      </div>
      <div className="col-1-4">
        <button className="blue embed-lock"><Icon /><span>yellow</span></button>
      </div>
      <div className="col-1-4">
        <button className="outline blue embed-lock"><Icon /><span>blue</span></button>
      </div>
    </div>

    <h2>Right SVG Icon Buttons</h2>
    <div className="grid-2 card">
      <div className="col-1-4">
        <button className=""><span>normal</span><Icon /></button>
      </div>
      <div className="col-1-4">
        <a className="button outline "><Icon /><span>outline</span><Icon /></a>
      </div>
      <div className="col-1-4">
        <button className="blue "><Icon /><span>yellow</span><Icon /></button>
      </div>
      <div className="col-1-4">
        <button className="outline blue "><Icon /><span>blue</span><Icon /></button>
      </div>
    </div>

    <h2>SVG Icon on edge Buttons</h2>
    <div className="grid-2 card">
      <div className="col-1-4">
        <button className=""><div className="w-full">normal</div><Icon /></button>
      </div>
      <div className="col-1-4">
        <a className="button outline "><Icon /><div className="w-full">outline</div><Icon /></a>
      </div>
      <div className="col-1-4">
        <button className="blue "><Icon /><div className="w-full">yellow</div><Icon /></button>
      </div>
      <div className="col-1-4">
        <button className="outline blue "><Icon /><div className="w-full">blue</div><Icon /></button>
      </div>
    </div>

    <h2>SVG mixed position</h2>
    <div classNAme="grid-2 card">
      <div className="col-1-4">
        <button className="w-full outline shadow">
          <div className="w-full">
            <Icon />
            <span>Action</span>
          </div>
          <div>
            <IconArrow />
          </div>
        </button>
      </div>
    </div>

    <h2>Action Buttons</h2>
    <div className="grid-2 card">
      <div className="col-1-4">
        <button className="action"><Icon /></button>
      </div>
      <div className="col-1-4">
        <a className="button action outline black"><Icon /></a>
      </div>
      <div className="col-1-4">
        <button className="action primary shadow"><Icon /></button>
      </div>
      <div className="col-1-4">
        <button className="action blue"><Icon /></button>
      </div>
    </div>

  </div>
);


export default ExampleForm;
