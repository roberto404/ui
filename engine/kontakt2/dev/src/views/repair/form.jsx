
import React from 'react';
import PropTypes from 'prop-types';

/* !- React Elements */

// import Form from '@1studio/ui/view/form';
import Form from '@1studio/ui/form/form';

import {
  Select,
  Checkbox,
  Radio,
  Toggle,
  Input,
} from '@1studio/ui/form/pure';

import Connect from '@1studio/ui/form/connect';

import Features from '../../components/formFieldFeatures';



/* !- Constants */

// import { FIELDS, SCHEME } from './const';
import { FIELDS, SCHEME } from '../product/const';

/**
* RepairForm Component
*/
const RepairForm = (props, { register }) =>
(
  <Form
    id="repair"
    scheme={SCHEME}
    fields={FIELDS}
  >
    <Select
      {...FIELDS.category}
      data={register.data.repair ? register.data.repair.categories : []}
    />

    <Connect
      UI={Features}
    />
  </Form>
);

RepairForm.contextTypes = {
  register: PropTypes.object,
};

export default RepairForm;
