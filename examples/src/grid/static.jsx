
import React from 'react';
import produceNumericArray from '@1studio/utils/array/produceNumericArray';

/* !- React Elements */

import Grid from '@1studio/ui/grid/pure/grid';
// import Grid from '../../../src/grid/pure/grid';
import GridRow from './row';

/* !- Constants */

import { DATA, SETTINGS } from './constants';


/**
 * Example Component
 */
export default () => (
  <div className="p-2">
    <h1>Static Grid</h1>
    <h2>Basic compontent</h2>
    <Grid
      className="card grid"
      data={DATA.slice(0, 5)}
    />

    <h2>Customized Grid compontent (hook, helper, order, row and header click => console.log)</h2>
    <Grid
      className="card grid"
      data={DATA.slice(0, 5)}
      hook={SETTINGS.hook}
      helper={SETTINGS.helper}
      orderColumn="gender"
      orderDirection="desc"
      onClickCell={(record, index) => console.log(record, index)}
      onChangeOrder={columnId => console.log(columnId)}
    />

    <h2>Grid with Freeze Header compontent</h2>
    <Grid
      className="card grid"
      height="300px"
      freezeHeader
      data={DATA}
      hook={SETTINGS.hook}
      helper={SETTINGS.helper}
    />

    <h2>Infinity Grid compontent</h2>
    <Grid
      freezeHeader
      className="card grid"
      height="300px"
      data={produceNumericArray(0, 1000, i => ({ id: i, name: `${i} name` }))}
      infinity
    />

    <h2>Grid with custom Row compontent</h2>
    <Grid
      className="grid"
      data={DATA}
      showHeader={false}
      rowElement={GridRow}
    />

    <h2>Selectable (multipleSelect = true) Grid compontent (shift+click, ctrl+click)</h2>
    <Grid
      id="example_grid_selectable"
      className="card grid"
      data={DATA.slice(0, 5)}
      selectable
    />

    <h2>ExpandSelect Grid compontent</h2>
    <Grid
      id="example_grid_expandSelect"
      className="card grid"
      data={DATA.slice(0, 5)}
      selectable
      expandSelect
    />

    <h2>CheckboxSelect Grid compontent</h2>
    <Grid
      id="example_grid_checkboxSelect"
      className="card grid"
      data={DATA.slice(0, 5)}
      selectable
      expandSelect
      checkboxSelect
    />
  </div>
);
