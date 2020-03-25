import React from 'react';


/* !- React Elements */

import { Grid as GridView } from '../../../src/view';
import Connect from '../../../src/grid/connect';
import Grid from '../../../src/grid/pure/grid';
import Sortable from '../../../src/dragAndDrop/sortable';

import Card from '../../../src/card/card';
import { createMoveableMarkersHelper, createMarkers, MARKER_ELEMENTS, MARKER_ALIGNS } from '../../../src/card/marker';

/* !- Constants */

import { DATA, SETTINGS } from './constants';

const fakeApi = () => new Promise(resolve => resolve({ status: 'SUCCESS', records: DATA }));

const Basic = () =>
(
  <div>
    <Card
      image="http://beta.rs.hu/img/uploads/5821x2890_1562579018.5589_5d230d4e5e765.jpg"
      markers={[
        {
          category: 'heading',
          position: [0, 100],
          settings: 'Nappali bútorok',
        },
        {
          category: 'tooltip',
          position: [17, 36],
          settings: 'Nem eladó!',
        },
        {
          category: 'product',
          position: [50, 50],
          settings: 'sku',
        },
      ]}
      onDragMarker={marker => console.log(marker)}
    />



    {/*<h1>Basic</h1>
    <Sortable onChange={data => console.log(data)} className="grid-2-2 p-4 border">
      <div className="col-1-4"><div className="bg-red border">1</div></div>
      <div className="col-1-4"><div className="bg-red border">2</div></div>
      <div className="col-1-4"><div className="bg-red border">3</div></div>
      <div className="col-1-4"><div className="bg-red border">4</div></div>
      <div className="col-1-4"><div className="bg-red border">5</div></div>
      <div className="col-1-4"><div className="bg-red border">6</div></div>
    </Sortable>
*/}
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
