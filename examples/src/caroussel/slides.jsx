
import React from 'react';
import { connect } from 'react-redux';


/* !- React Elements */

import Slides from '../../../src/caroussel/slides';


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
      <h1>Slides</h1>
      
      <h2>Draggable slides</h2>
      <Slides id="sample" />

      <h2>Draggable photo slides</h2>
      <div style={{ width: '300px', height: '200px' }}>
        <Slides id="sample_photo" />
      </div>

      <h2>Autoplay photo slides</h2>
      <div style={{ width: '300px', height: '200px' }}>
        <Slides
          id="sample_autoplay"
          autoplay={1}
        />
      </div>

      <h2>More slides</h2>
      <div style={{ width: '300px', height: '200px' }}>
        <Slides
          id="sample_more"
          visibleSlides={2}
        />
      </div>

      <h2>Custom slides</h2>
      <Slides
        id="sample_custom"
        Slide={({ id, name }) => <div>{id}. {name}</div>}
      />

      <h2>transition, onPaginate</h2>
      <Slides
        id="sample2"
        transition="0.5s cubic-bezier(0.60,1,0.70,0) 0s"
        onPaginate={() => console.log('end')}
      />
    </div>
  );
};

export default connect(null, { setData })(Example);
