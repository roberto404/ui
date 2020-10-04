import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';


import { setValues, unsetValues } from '../../../src/form/actions';

import Form,
{
  Slider,
}
from '../../../src/form/pure';



const Example = ({ setValues, unsetValues }) =>
{
  return (
    <Form
      id="example"
      className="p-2"
    >
      <Slider
        id="slider"
        label="Slider"
        value={[0, 70]}
        steps={10}
      />
      <div className="button value" onClick={() => setValues({ slider: [0, 50] }, 'example')}>
        set center
      </div>
      <div className="button value" onClick={() => unsetValues({ slider: undefined }, 'example')}>
        reset
      </div>


      <Slider
        id="slider2"
        label="Slider"
        from={1000}
        to={2200}
        value={[1220, 1650]}
        stateFormat={state => state.map(v => `${Math.round(v)} Ft`)}
        enableStartHandler
        onTheFly
      />
      <div className="button value" onClick={() => setValues({ slider2: [1400, 1800] }, 'example')}>
        set center
      </div>
      <div className="button value" onClick={() => unsetValues({ slider2: undefined }, 'example')}>
        reset
      </div>


      <Slider
        id="slider2"
        label="Full lock slide not on the fly"
        from={1000}
        to={2200}
        value={[1220, 1650]}
        stateFormat={state => state.map(v => `${Math.round(v)} Ft`)}
        enableStartHandler
        enableFullLock
      />

    </Form>
  );
};

export default connect(
  null,
  {
    setValues,
    unsetValues,
  }
)(Example);
