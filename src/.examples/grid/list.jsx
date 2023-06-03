
import React from 'react';


/* !- React Elements */

import { Grid as GridView } from '../../../src/view';
import Connect from '../../../src/grid/connect';
import Grid from '../../../src/grid/pure/grid';

import Form, {
  Input,
  Submit,
  Plain,
} from '../../../src/form/intl';

import IconAdd from '../../../src/icon/mui/content/add_circle_outline';
import IconSave from '../../../src/icon/mui/action/done';

/* !- Constants */

import { DATA, SETTINGS, HOOK_LIST } from './constants';

const fakeApi = () => new Promise(resolve => resolve({ status: 'SUCCESS', records: DATA }));



/**
 * Submit button
 * @param {[type]} onClick [description]
 */
const SubmitButton = ({ onClick }) =>
(
  <div className="pin-br w-auto column center p-3 py-2">
    <button className="action large red shadow mt-1/2" onClick={onClick}><IconSave /></button>
  </div>
);

/**
 * Right colum data viewr
 */
const ExampleForm = () =>
(
  <Form
    id="sample"
  >
    <Plain id="name" />
    <Input id="name" />
    <Submit api={fakeApi}>

    </Submit>
  </Form>
);


/**
 * GridView + Filters + Connect + Paginate
 */
const Example = () =>
(
  <GridView
    id="sample"
    api={fakeApi}
    className="column h-screen p-4"
    style={{ height: '400px' }}
    settings={{ ...SETTINGS, hook: HOOK_LIST, paginate: { limit: 0 } }}
    onLoad="selectFirst"
  >
    {/* Add new + Filters */}

    <div className="grid">

      <div className="col-1-3 mb-1">
        <button
          className="green outline shadow w-auto mr-2 inline-block"
        >
          <IconAdd />
          <span>Sample Button</span>
        </button>
      </div>

      <div className="col-2-3">
        <div className="filters">
          <Input
            id="search"
            label={<div className="icon embed-search-gray-dark">Search</div>}
            placeholder="Name..."
            autoFocus // important for infinity or reload dom
          />
        </div>
      </div>

    </div>

    {/* List-View */}

    <div
      className="card mb-0 p-0 shadow-outer border border-white grid grow scroll-y"
    >
      <div className="grid grow">
        <div className="col-1-3 bg-white-semi-light">
          <Connect
            UI={Grid}
            uiProps={{
              className: 'w-full scroll-y',
              selectable: true,
              expandSelect: false,
              showHeader: false,
              infinity: true,
            }}
          />
        </div>
        <div className="col-2-3 border-left border-gray-light p-4 scroll-y">
          <ExampleForm />
        </div>
      </div>
    </div>

  </GridView>
);

export default Example;
