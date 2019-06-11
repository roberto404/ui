
import React from 'react';


/* !- React Elements */

import { Grid as GridView } from '@1studio/ui/view';
import Connect from '@1studio/ui/grid/connect';
import Grid from '@1studio/ui/grid/pure/grid';
import IconMore from '../../../src/icon/mui/navigation/expand_more';

import {
  Input,
} from '@1studio/ui/form/pure/intl';


/* !- Redux Actions */

import { dialog } from '../../../src/layer/actions';


/* !- Constants */

import { DATA, SETTINGS } from './constants';

const fakeApi = () => new Promise(resolve => resolve({ status: 'SUCCESS', records: DATA }));


/**
 * GridRow component Example
 */
const GridRow = ({ data, columns, className, onClick, onClickCell, dispatch }) =>
{
  const onClickButtonHandler = (event) =>
  {
    event.stopPropagation();
    dispatch(dialog(<div>{data.gender}</div>));
  };

  return (
    <div className={className} onClick={onClick}>
      <div className="checkbox" />
      <div>{data.name}</div>
      <div>{data.visits}</div>
      <div>
        <button className="gray w-auto" onClick={onClickButtonHandler}>
          <IconMore /><span>gender</span>
        </button>
      </div>
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
      rowElement={GridRow}
      selectable
      expandSelect
      checkboxSelect
    />

  </GridView>
);

export default Example;
