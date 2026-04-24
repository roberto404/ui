
import React from 'react';


/* !- React Elements */

import { Grid as GridView } from '../../view/grid';
import Connect from '../../grid/connect';
import Grid from '../../grid/components/grid';
import Pagination from '../../pagination/pure/pagination';

/* !- Constants */

import { DATA, SETTINGS } from './constants';
import { useSummaryHandler } from '../../grid/components/handlers/summary';
import { useStore } from 'react-redux';

const fakeApi = () => new Promise(resolve => resolve({ status: 'SUCCESS', records: DATA }));

/**
 * Connect
 */
const Example = () => {

  const { SummaryHandler } = useSummaryHandler();
  const store = useStore();

  const onClickSummaryHandler = (event) => {

    const { rawData, data, helper = {} } = store.getState().grid.sample;

    const column = 'time';

    SummaryHandler({
      records: rawData,
      column,
      data: rawData,
      helper: helper[column],
      event,
    })

  }

  return (
    <GridView
      id="sample"
      api={fakeApi}
      settings={{
        ...SETTINGS,
        paginate:
        {
          limit: 0,
        },
      }}
      className="p-4"
    >
      <div className='button blue w-content large mb-2' onClick={onClickSummaryHandler}>gender summary</div>

      <Connect
        UI={Grid}
      />



    </GridView>
  )
};

export default Example;
