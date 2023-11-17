
import React from 'react';
import { useDispatch } from 'react-redux';


/* !- React Elements */

import Caroussel from '../../../src/caroussel/caroussel';
import IconArrow from '../../../src/icon/mui/navigation/arrow_drop_up';


/* !- Actions */

import { setData } from '../../../src/grid/actions';


/* !- Constants */

import { SLIDES, PHOTO_SLIDES, CUSTOM_SLIDES } from './constants';


/**
 * GridView + Filters + Connect + Paginate
 */
const Example = () =>
{
  const dispatch = useDispatch();
  dispatch(setData(SLIDES, {}, 'sample'));
  // dispatch(setData(SLIDES, {}, 'sample2'));
  // dispatch(setData(PHOTO_SLIDES, {}, 'sample_photo'));
  // dispatch(setData(PHOTO_SLIDES, {}, 'sample_autoplay'));
  // dispatch(setData(PHOTO_SLIDES, {}, 'sample_more'));
  // dispatch(setData(CUSTOM_SLIDES, {}, 'sample_custom'));

  return (
    <div>
      <h1>Caroussel</h1>

      <h2>Simple caroussel</h2>
      <Caroussel id="sample" visibleSlides={4} />

      {/* <h2>Photo caroussel</h2>
      <div style={{ width: '300px', height: '200px' }}>
        <Caroussel id="sample_photo" />
      </div> */}

      {/* <h2>Autoplay photo caroussel</h2>
      <div style={{ width: '300px', height: '200px' }}>
        <Caroussel
          id="sample_autoplay"
          autoplay={1}
          pagerPrevUI={<IconArrow />}
          pagerNextUI={<IconArrow />}
        />
      </div> */}

      {/* <h2>More slides</h2>
      <div style={{ width: '300px', height: '200px' }}>
        <Caroussel
          id="sample_more"
          visibleSlides={2}
        />
      </div> */}

      {/* <div
        className="underline pointer"
        onClick={() => window.location.href = '/?example=caroussel/slides'}
      >
        More example in the Slides component
      </div> */}
    </div>
  );
};

export default Example;