
import React from 'react';


/* !- React Elements */

import { Grid as GridView } from '../../../src/view';
import Connect from '../../../src/grid/connect';
import Grid from '../../../src/grid/pure/grid';


/* !- Constants */

import { DATA, SETTINGS } from './constants';

const fakeApi = () => new Promise(resolve => resolve({ status: 'SUCCESS', records: DATA }));


/**
 * GridRow component Example
 */
const GridRow = ({ data, className, dispatch }) =>
{

  return (
    <div className={`mx-2 p-2 rounded ${className}`}>
      <div className="avatar h-4 w-4 border-double-gray">
        <span>R</span>
      </div>
      <div className="pt-2">{data.name}</div>
    </div>
  );
};

/**
 * GridView + Filters + Connect + Custom Grid
 */
const Example = () =>
(
  <GridView
    id="sample"
    api={fakeApi}
    settings={SETTINGS}
    className="p-4"
    onLoad="selectFirst"
  >
    <Connect
      UI={Grid}
      rowElement={GridRow}
      selectable
      showHeader={false}
      bodyClassName="tbody infinity flex"
    />

  </GridView>
);

export default Example;
