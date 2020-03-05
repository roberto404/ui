
import React from 'react';
import classNames from 'classnames';


/* !- React Elements */

import { Grid as GridView } from '../../../src/view';
import Connect from '../../../src/grid/connect';
import Grid from '../../../src/grid/pure/grid';
import FileListGridRow from '../../../src/grid/pure/gridRows/filelist';
import Form, {
  Input,
} from '../../../src/form/pure/intl';


/* !- Constants */

export const DATA = [
  { "id": 1, "title": "Megan Joseph Cushmanshower", "ext": 'jpg', "size": "1203898" },
  { "id": 2, "title": "Taylor R. Fallin", "ext": 'jpg', "size": "1203898" },
  { "id": 3, "title": "Jose C. Rosado", "ext": 'jpg', "size": "1203898" },
  { "id": 4, "title": "Sammy C. Brandt", "ext": 'jpg', "size": "1203898" },
  { "id": 5, "title": "June K. Jenkins", "ext": 'jpg', "size": "1203898" },
  { "id": 6, "title": "Pamela R. Benson", "ext": 'jpg', "size": "1203898" },
  { "id": 7, "title": "James H. Kelly", "ext": 'jpg', "size": "1203898" },
  { "id": 8, "title": "Joseph D. Black", "ext": 'jpg', "size": "1203898" },
  { "id": 9, "title": "Kellie E. Franklin", "ext": 'jpg', "size": "1203898" },
  { "id": 10, "title": "Wayne D. Price", "ext": 'jpg', "size": "1203898" },
  { "id": 11, "title": "Michael P. Danley", "ext": 'jpg', "size": "1203898" },
  { "id": 12, "title": "Weston S. Taylor", "ext": 'jpg', "size": "1203898" },
];

export const SETTINGS =
{
  // hook:
  // {},
  // helper:
  // {},
  paginate:
  {
    limit: 0,
    page: 1,
  },
  // order:
  // {
    // column: 'name',
    // direction: 'desc',
  // },
  filters:
  [
    {
      id: 'search',
      handler: (record, value) =>
        record.title
          .toString()
          .toLowerCase()
          .indexOf(value.toString().toLowerCase()) >= 0,
      arguments: [],
      status: false,
    },
  ],
  };

const fakeApi = () => new Promise(resolve => resolve({ status: 'SUCCESS', records: DATA }));



/**
 * GridView + Filters + Connect + Custom Grid
 */
const Example = () =>
(
  <GridView
    id="sample"
    api={fakeApi}
    settings={SETTINGS}
    onLoad="selectFirst"
  >

    {/* Add new + Filters */}

    <div className="grid">

      <div className="col-1-3 mb-1">
      </div>

      <div className="col-2-3">
        <div className="filters">
          <Input
            id="search"
            label={<div className="icon embed-search-gray-dark">Search</div>}
            placeholder="File name..."
            autoFocus
          />
        </div>
      </div>

    </div>


    {/* List-View */}

    <Connect>
      <Grid
        className="card p-2 shadow-outer border border-white scroll-y no-select"
        style={{ height: '400px' }}
        bodyClassName="infinity:grid-2-2"
        rowElement={FileListGridRow}
        showHeader={false}
        infinity
        selectable
        expandSelect
      />
    </Connect>


  </GridView>
);

export default Example;
