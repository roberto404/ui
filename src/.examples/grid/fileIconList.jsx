
import React from 'react';
import simplify from '@1studio/utils/math/simplify';


/* !- React Elements */

import { Grid as GridView } from '../../../src/view';
import Connect from '../../../src/grid/connect';
import Grid from '../../../src/grid/components/grid';
import FileListIconGridRow from '../../../src/grid/components/gridRows/fileIconList';
import Form, {
  Input,
} from '../../../src/form/intl';


/* !- Constants */

export const DATA = [
  { "id": 89224, "title": "Megan Joseph Cushmanshower", "ext": 'jpg', "size": "1203898" },
  { "id": 2, },
  { "id": 89224, "title": "Taylor R. Fallin", "ext": 'jpg', "size": "1203898", percent: 29 },
  { "id": 5, "title": "June K. Jenkins", "ext": 'jpg', "size": "1203898" },
  { "id": 6, "title": "Pamela R. Benson", "ext": 'jpg', "size": "1203898" },
];


const fakeApi = () => new Promise(resolve => resolve({ status: 'SUCCESS', records: DATA }));



/**
 * GridView + Filters + Connect + Custom Grid
 */
const Example = () =>
(
  <GridView
    id="sample"
    api={fakeApi}
    onLoad="selectFirst"
    className="p-4"
  >


    {/* List-View */}

    <Connect>
      <Grid
        className="card p-2 shadow-outer border border-white scroll-y no-select"
        style={{ height: '400px' }}
        bodyClassName="grid-2-2"
        rowElement={FileListIconGridRow}
        showHeader={false}
        // infinity
        // selectable
        // expandSelect
      />
    </Connect>

  </GridView>
);

export default Example;
