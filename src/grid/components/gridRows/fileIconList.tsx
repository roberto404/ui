import React from 'react';
import classNames from 'classnames';
import File from '../../../form/file';


/* !-- Types */

type PropTypes = {
  data: [],
  onClick: () => void,
  className: string,
}

/**
 * [FileIconListGridRow description]
 */
const FileIconListGridRow = ({
  data,
  onClick,
  className="col-auto"
}: PropTypes) =>
{

  let imageSrc = data.url;

  if (!data.percent && typeof data.url === 'undefined' && ['jpg', 'jpeg', 'png'].indexOf(data.ext) !== -1) {
    imageSrc = new File(data).getUrl('75x75');
  }

  const percent = parseInt(data.percent) === 100 ? 'resizing' : `${data.percent}%`;

  const isPreloaded = data.percent !== undefined;

  if (!isPreloaded && !data.ext && !data.url) {
    return (
      <></>
    );
  }

  return (
    <div className='col-auto' onClick={onClick}>
      <div className='shadow-outer-2 overflow' style={{ width: 75, borderTopRightRadius: 20, }}>

        <div
          className='border-bottom  border-gray-light'
          style={{
            height: 75,
            background: imageSrc ?
              `url(${imageSrc}), linear-gradient(0.1turn, #ececec, #e2e2e2)` : 'linear-gradient(0.1turn, #3f87a6, #ebf8e1)',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div
            className='bg-white shadow-outer-2'
            style={{
              width: 23,
              height: 23,
              right: 0,
              marginRight: 0,
              marginLeft: 'auto',
              borderBottomLeftRadius: 5
            }}
          /> 

          { isPreloaded &&
            <div className='v-center'>
              <div className="preloader" />
            </div>
          }
        </div>

        <div className="text-center bg-white-light uppercase text-xs text-gray py-1/2">
          { isPreloaded ? percent : data.ext || data.url.split('.').at(-1) }
        </div>
      </div>
    </div>
  );
};

export default FileIconListGridRow;
