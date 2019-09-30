import React from 'react';
import PropTypes from 'prop-types';


/* !- Redux Actions */

import { setValues } from '../../../src/form/actions';


/* !- React Elements */

import Form,
{
  Collection,
}
from '../../../src/form/pure/intl';

import { CollectionItem } from '../../../src/grid/pure/gridSearch';


/* !- Constants */


/**
 * [Example description]
 */
const Example = (props, { store }) =>
{
  store.dispatch(setValues({
    collection: [
      { id: 1, title: 'foo' },
      { id: 2, title: 'bar' },
    ],
    collection2: [
      { field: 'name', operator: '=', value: 'Á' },
      { field: 'gender', operator: '==', value: 'male' },
      { field: 'id', operator: '<', value: '10' },
    ],
  }, 'example'));

  return (
    <Form
      id="example"
    >
      <Collection
        id="collection"
        label="Collection"
      />
      <h2>Custom UI</h2>
      <Collection
        id="collection2"
        UI={CollectionItem}
      />
    </Form>
  );
};

Example.contextTypes = {
  store: PropTypes.object,
};

export default Example;
