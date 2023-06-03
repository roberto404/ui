
import React from 'react';


/* !- React Elements */

import { Grid as GridView } from 'src/view';
import Connect from 'src/grid/connect';
import Grid from 'src/grid/pure/grid';
import GridDownload from 'src/grid/pure/gridDownload';
import GridOrder from 'src/grid/pure/gridOrder';
import GridSelectableButton from 'src/grid/pure/gridSelectableButton';


/* !- Constants */

import { DATA, SETTINGS } from './constants';

const fakeApi = () => new Promise(resolve => resolve({ status: 'SUCCESS', records: DATA }));

/**
 *
 */
const Example = () =>
(
  <GridView
    id="sample"
    api={fakeApi}
    settings={SETTINGS}
    className="p-4"
  >
    <Connect
      UI={({ rawData }) => <div className="tag text-white">Total: {rawData.length}</div>}
    />

    <GridOrder
      data={[
        { id: 'name', title: 'Name' },
        { id: 'visits', title: 'Visits' },
        { id: 'gender', title: 'Gender' },
      ]}
    />

    <GridSelectableButton
      className="primary w-auto"
      // onClick={onClickGridButton}
      label="GridSelectableButton"
    />

    <Connect
      UI={Grid}
      selectable
    />

    <GridDownload />

  </GridView>
);

export default Example;
