import React from 'react';
import PropTypes from 'prop-types';


/* !- Redux Actions */

import { swapView } from '../../../src/view/actions';


/* !- React Elements */

import View from '../../../src/view/view';
import Grid from '../../../src/grid/pure/grid';
import Connect from '../../../src/form/connect';
import { Collection } from '../../../src/form/pure/intl';

import { Example2 } from '../form/collection';

import IconEdit from '../../../src/icon/mui/content/create';
import IconClose from '../../../src/icon/mui/navigation/arrow_back';


const exampleGridData = 
  [{"id":"141171","invoiceNumber":"T007725\/21","invoicingDate":"2021-10-19","paymentDate":"2021-10-17","priceGross":"15000"},{"id":"141851","invoiceNumber":"T007956\/21","invoicingDate":"2021-10-27","paymentDate":"2021-10-26","priceGross":"18850"}];

const ViewBasic = ({},{ store }) =>
{
  const onClickSwitchViewHandler = () =>
  {
    store.dispatch(swapView());
  }

  return (
    <div>
      <View
        id='sample-view'
        defaultView='group1'
        settings={{
          groups: {
            group1: [
              { id: 'grid', pos: 0, status: 1 },
              { id: 'form', pos: 1, status: 0 },
            ],
            group2: [
              { id: 'hidden', pos: 0, status: 1 }
            ],
          }
        }}
        >
        <div
          data-view="form"
        >

          <div
            className="button outline w-auto shadow inline-block yellow"
            onClick={onClickSwitchViewHandler}
          >
            <IconClose />
            <span>Close</span>
          </div>

          <div className="mt-2 text-xs h-center w-full pb-1" style={{ paddingRight: '5rem' }}>
            <div className="col-1-6">Azonosító</div>
            <div className="col-1-6">Száma száma</div>
            <div className="col-1-6">Számla kelte</div>
            <div className="col-1-6">Fizetés ideje</div>
            <div className="col-1-6">Bruttó összeg</div>
            <div className="col-1-6 col-br">Fizetés módja</div>
          </div>

          <Collection
            form="exampleForm"
            id="grid"
            UI={Example2}
            value={exampleGridData}
          />

        </div>
        <div
          data-view="grid"
        >
          <div
            className="button outline w-auto shadow inline-block yellow"
            onClick={onClickSwitchViewHandler}
          >
            <IconEdit />
            <span>Edit</span>
          </div>

          <Connect 
            id="exampleForm"
            listen="grid"
            UI={({ grid }) => (
              <Grid
                data={grid || exampleGridData}
                className="text-s mb-6"
                hook={{
                  invoiceNumber: 'Invoice Number',
                  priceGross: {
                    title: 'Gross',
                    format: ({ value }) => `${value} HUF`, 
                  },
                }}
              />
            )}
          />
        </div>
        <div
          data-view="hidden"
        >
          c
        </div>
      </View>
    </div>
  );
};

ViewBasic.contextTypes =
{
  store: PropTypes.object,
}

export default ViewBasic;
