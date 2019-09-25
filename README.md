# ui &middot; [![travis build](https://img.shields.io/travis/roberto404/ui.svg)](https://travis-ci.org/roberto404/ui) [![codecov coverage](https://img.shields.io/codecov/c/github/roberto404/ui.svg)](https://codecov.io/gh/roberto404/ui) [![version](https://img.shields.io/npm/v/@1studio/ui.svg)](http://npm.im/@1studio/ui) [![commit](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/) [![type](https://img.shields.io/badge/type%20checking-flow-yellow.svg)](https://flow.org/)
A collection of useful React/Redux UI elements.

## Installation

Using npm:
```shell
$ npm i -S @1studio/ui
```

## Manual

### Form:

Automatically store the form state change on Redux Store (form.example). No need to Redux or Actions. Only concerned field updating.

```javascript
import React from 'react';

/* !- React Elements */

import Form,
{
  Toggle,
  Checkbox,
}
from '@1studio/ui/form';


const ExampleForm = () =>
(
  <Form
    id="example"
  >
    <Toggle
      id="status"
    />
    <Checkbox
      id="checkbox"
      data={[{ id: 1, title: 'elso' }, { id: 2, title: 'masodik' }]}
    />
  </Form>
);

// => Redux.store = {
  form: {
    'example':
    {
      status: 1,
      checkbox: [1, 2],
    }
  }
}
```
[More info](./docs/form.md)

Fields: [Checkbox](./docs/checkbox.md), [Date](./docs/date.md), [Dropdown](./docs/dropdown.md), [Input](./docs/input.md), [Multiple](./docs/multiple.md), [Toggle](./docs/toggle.md).


### Form Actions:

Every change store on Redux Store (form). Form wrapper does this.

```javascript
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as Actions from '@1studio/ui/form/actions';


/* !- React Elements */

import
{
  Toggle,
}
from '@1studio/ui/form';


/* !- Stateless Component */

const ExampleForm = (
{
  setValues,
},
) =>
(
  <Toggle
    id="status"
    label="Status"
    onChange={setValues}
  />
);

/**
 * propTypes
 * @type {Object}
 */
ExampleForm.propTypes =
{
  setValues: PropTypes.func.isRequired,
};

export default connect(
  null,
  Actions,
)(ExampleForm);
```

[More about Actions](./MANUAL.md).

## License

@1studio/ui is [BSD licensed](./LICENSE).