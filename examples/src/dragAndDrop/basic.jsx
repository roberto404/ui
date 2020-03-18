import React from 'react';


/* !- React Elements */

import { Grid as GridView } from '../../../src/view';
import Connect from '../../../src/grid/connect';
import Grid from '../../../src/grid/pure/grid';
import Sortable from '../../../src/dragAndDrop/sortable';


/* !- Constants */

import { DATA, SETTINGS } from './constants';

const fakeApi = () => new Promise(resolve => resolve({ status: 'SUCCESS', records: DATA }));

const Basic = () =>
(
  <div>
    <h1>Basic</h1>
    <Sortable onChange={data => console.log(data)} className="grid-2-2 p-4 border">
      <div className="col-1-4"><div className="bg-red border">1</div></div>
      <div className="col-1-4"><div className="bg-red border">2</div></div>
      <div className="col-1-4"><div className="bg-red border">3</div></div>
      <div className="col-1-4"><div className="bg-red border">4</div></div>
      <div className="col-1-4"><div className="bg-red border">5</div></div>
      <div className="col-1-4"><div className="bg-red border">6</div></div>
    </Sortable>

    {/*<h1>Grid</h1>
    <GridView
      id="sample"
      api={fakeApi}
      settings={SETTINGS}
      className="p-4 no-select"
    >
      <Connect
        UI={Grid}
        rowElement={({ data, draggable, onDragStart }) => (
          <div draggable={draggable} onDragStart={onDragStart} className="col-1-4">
            <div className="border border-white border-3 shadow-outer ">
              <div className="text-center p-2">{data.id}</div>
            </div>
          </div>
        )}
        className="grid-2-2"
        bodyClassName="columns"
        showHeader={false}
        sortable
        onSort={data => console.log(data)}
      />

    </GridView>*/}

  </div>
);

export default Basic;
