
import React from 'react';
import { connect } from 'react-redux';


/* !- React Elements */

import Caroussel from '../../../src/caroussel/caroussel';


/* !- Actions */

import { setData } from '@1studio/ui/grid/actions';


/* !- Constants */

import { SLIDES, PHOTO_SLIDES, CUSTOM_SLIDES } from './constants';


/**
 * GridView + Filters + Connect + Paginate
 */
const Example = ({ setData }) =>
{
  setData(SLIDES, {}, 'sample');
  setData(SLIDES, {}, 'sample2');
  setData(PHOTO_SLIDES, {}, 'sample_photo');
  setData(PHOTO_SLIDES, {}, 'sample_autoplay');
  setData(PHOTO_SLIDES, {}, 'sample_more');
  setData(CUSTOM_SLIDES, {}, 'sample_custom');

  return (
    <div>
      <h1>Caroussel</h1>

      <h2>Simple caroussel</h2>
      <Caroussel id="sample" />

      <h2>Photo caroussel</h2>
      <div style={{ width: '300px', height: '200px' }}>
        <Caroussel id="sample_photo" />
      </div>

      <h2>Autoplay photo caroussel</h2>
      <div style={{ width: '300px', height: '200px' }}>
        <Caroussel
          id="sample_autoplay"
          autoplay={1}
        />
      </div>

      <h2>More slides</h2>
      <div style={{ width: '300px', height: '200px' }}>
        <Caroussel
          id="sample_more"
          visibleSlides={2}
        />
      </div>

      <div>More example in the Slides component</div>
    </div>
  );
};

export default connect(null, { setData })(Example);
