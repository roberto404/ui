import React from 'react';
import PropTypes from 'prop-types';


import Form,
{
  Slider
}
from '../../../src/form/pure';



const Example = (props, { store }) =>
{
  return (
    <Form
      id="example"
      className="p-2"
    >
      <Slider
        id="slider"
        label="Slider"
        // value={[0, 30]}
        steps={10}
      />
      <Slider
        id="slider2"
        label="Slider"
        from={1000}
        to={2200}
        // value={[1220, 1650]}
        stateFormat={state => state.map(v => `${Math.round(v)} Ft`)}
        enableStartHandler
        onTheFly
      />
    </Form>
  );
};

Example.contextTypes = {
  store: PropTypes.object,
};

export default Example;
