
import React from 'react';


/* !- React Elements */

import { Grid as GridView } from '@1studio/ui/view';
import Connect from '@1studio/ui/grid/connect';
import Grid from '@1studio/ui/grid/pure/grid';
import GridDownload from '@1studio/ui/grid/pure/gridDownload';
import GridOrder from '@1studio/ui/grid/pure/gridOrder';
import GridSelectableButton from '@1studio/ui/grid/pure/gridSelectableButton';

import {
  Input,
} from '@1studio/ui/form/pure/intl';


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
