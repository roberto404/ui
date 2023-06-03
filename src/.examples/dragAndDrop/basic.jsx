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
    <h1>Basic</h1>

    <Sortable
      onChange={data => console.log(data)}
      className="rounded p-1 border"
      classNameDragElement="my-1 p-1 text-s text-center text-gray content-dropHere opacity-100"
      classNameDragGhostElement="rounded bg-green my-1 p-1 text-s text-center opacity-100"
    >
      <div className="rounded bg-blue my-1 p-1 text-s text-center">Apples</div>
      <div className="rounded bg-blue my-1 p-1 text-s text-center">Bananas</div>
      <div className="rounded bg-blue my-1 p-1 text-s text-center">Cranberries</div>
      <div className="rounded bg-blue my-1 p-1 text-s text-center">Strawberries</div>
    </Sortable>


  </div>
);

export default Basic;
