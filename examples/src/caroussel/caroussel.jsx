
import React from 'react';
import { connect } from 'react-redux';


/* !- React Elements */

import Caroussel from '../../../src/caroussel/caroussel';
import IconArrow from '../../../src/icon/mui/navigation/arrow_drop_up';


/* !- Actions */

import { setData } from '@1studio/ui/grid/actions';


/* !- Constants */

// import { SLIDES, PHOTO_SLIDES, CUSTOM_SLIDES } from './constants';

const SLIDES = [
  { id: 1, slide: <div>1</div> },
  { id: 2, slide: <div>2</div> },
  { id: 3, slide: <div>3</div> },
  { id: 4, slide: <div>4</div> },
];



/**
 * GridView + Filters + Connect + Paginate
 */
const Example = ({ setData }) =>
{
  setData(SLIDES, {}, 'sample');
  // setData(SLIDES, {}, 'sample2');
  // setData(PHOTO_SLIDES, {}, 'sample_photo');
  // setData(PHOTO_SLIDES, {}, 'sample_autoplay');
  // setData(PHOTO_SLIDES, {}, 'sample_more');
  // setData(CUSTOM_SLIDES, {}, 'sample_custom');

  return (
    <div>
      <h1>Caroussel</h1>

      <h2>Simple caroussel</h2>
      <Caroussel id="sample" visibleSlides={4} />
{/*
      <h2>Photo caroussel</h2>
      <div style={{ width: '300px', height: '200px' }}>
        <Caroussel id="sample_photo" />
      </div>

      <h2>Autoplay photo caroussel</h2>
      <div style={{ width: '300px', height: '200px' }}>
        <Caroussel
          id="sample_autoplay"
          autoplay={1}
          pagerPrevUI={<IconArrow />}
          pagerNextUI={<IconArrow />}
        />
      </div>

      <h2>More slides</h2>
      <div style={{ width: '300px', height: '200px' }}>
        <Caroussel
          id="sample_more"
          visibleSlides={2}
        />
      </div>

      <div
        className="underline pointer"
        onClick={() => window.location.href = '/?example=caroussel/slides'}
      >
        More example in the Slides component
      </div>*/}
    </div>
  );
};

export default connect(null, { setData })(Example);
