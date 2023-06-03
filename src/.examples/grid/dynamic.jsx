
import React from 'react';


/* !- React Elements */

import GridView from '../../view/grid';
import Connect from '../../grid/connect';
import Grid from '../../grid/grid';

// import {
//   Input,
// } from '../../form/intl';

import Input from '../../form/input';


/* !- Constatnts */

import { DATA, SETTINGS } from './constants';

const fakeApi = () => new Promise(resolve => resolve({ status: 'SUCCESS', records: DATA }));


// import { AppContext } from '../../context';

// class Example extends React.Component
// {
//   render()
//   {
//     console.log(this.context);
//     return (
//       <div>111</div>
//     );
//   }
// }

// Example.contextType = AppContext;

/**
 * GridView + Filters + Connect + Paginate
 */
const Example = () =>
(
  <GridView
    id="sample"
    api={fakeApi}
    settings={SETTINGS}
    className="p-4"
  >
    <div className="filters">
      <Input
        id="search"
        label={<div className="icon embed-search-gray-dark">Search</div>}
        placeholder="Name..."
      />
    </div>

    <Connect
      UI={Grid}
    />

  </GridView>
);

export default Example;
