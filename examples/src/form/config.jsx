import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import formatThousand from '@1studio/utils/string/formatThousand';

/* !- Redux Actions */

import { setValues } from '../../../src/form/actions';


/* !- React Elements */

import { Grid as GridView } from '../../../src/view';
import GridConnect from '../../../src/grid/connect';
import FormConnect from '../../../src/form/connect';
import Grid from '../../../src/grid/pure/grid';

import Form,
{
  Input,
  Field,
  Textarea,
}
from '../../../src/form/pure';


/* !- Constants */

const DATA = [
  {
    id: "payment",
    gridLabel: 'Payment',
    component: 'Checkbox',
    data: [{ id: 'cash', title: 'cash' }, { id: 'online', title: 'online' }],
    label: null,
    initValue: ['online'], 
  },
  {
    id: "takeover", 
    gridLabel: 'Takeover',
    component: 'Radio',
    data: [{ id: '1', title: '1' }, { id: '2', title: '2' }],
    label: null,
    initValue: ['1'], 
  },
];

const fakeApi = () => new Promise(resolve => resolve({ status: 'SUCCESS', records: DATA }));


const ExampleForm = (props, { store }) =>
(
  <div>
    <h2>Field component</h2>

    <div className="grid-2">
      <div className="col-1-2">
        <Field
          {...{
            id: 'example',
            component: 'Input',
            type: 'number',
            regexp: '[0-9]*',
            label: "Create by config (only number)",
          }}
        />

      </div>
      <div className="col-1-2">
        <Input label="Classic <Input /> (only number)" id="example" type="number" regexp="[0-9]*" />
      </div>
    </div>

    <h2>case study #1</h2>

    {/* {
  "checkout.payment.data": ["cash", "online", "transfer"],
  "checkout.takeover.data": ["102"]
} */}


    
    <GridView
      id="caseStudy1"
      api={fakeApi}
      className="column"
      settings={{
        hook: {
          gridLabel: "Name",
        },
      }}
      onLoad="selectFirst"
    >
      <div className="card mb-0 p-0 shadow-outer border border-white grid grow scroll-y">
        <div className="grid grow">
          <div className="col-1-3 bg-white-light column">
            <GridConnect
              UI={Grid}
              selectable
              showHeader={false}
              className="grow w-full _scroll-y no-select"
            />
          </div>
          <div className="col-2-3 border-left border-gray-light p-4 scroll-y">
            <FormConnect
              listen="grid@caseStudy1"
              UI={(props) =>
              {
                const id = (props[props.listen] || [])[0];
                const field = DATA.find(fields => fields.id === id) || {};
                const currentValue = (props[props] || {})[id];

                return (
                  <Field
                    {...field}
                    id="props"
                    format={value => ({ ...props['props'], [field.id]: value }) }
                    stateFormat={value => value ? value[field.id] : currentValue || field.initValue}
                  />
                );
              }}
            />
              
          </div>
        </div>
      </div>
    </GridView>

    <FormConnect
      className="mt-2"
      id="props"
    >
      <Textarea
        id="props"
        label="Results (json)"
        stateFormat={value => JSON.stringify(value || [])}
        disabled
      />
    </FormConnect>

    {/* <h1>Use auto props to fields</h1>
    <Form
      id="example2"
      fields={FIELDS}
    >
      <Input id="input" />
    </Form> */}
  </div>
);

ExampleForm.contextTypes =
{
  store: PropTypes.object,
}

export default ExampleForm;
