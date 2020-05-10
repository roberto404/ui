import React from 'react';
import classNames from 'classnames';
import { File } from '../../../form/pure/dropzone';

/**
 * [FileListGridRow description]
 */
const FileListGridRow = ({ data, onClick, className, dispatch }) =>
{
  const active = className === 'active';

  const imageClassName = classNames({
    "mx-1 ratio pointer": true,
    "bg-gray-light rounded-m": active,
  });

  const titleClassNames = classNames({
    'mt-1/2 p-1/2 pointer': true,
    'bg-blue-dark text-white rounded': active,
  });

  const imageSrc = new File(data).getUrl('250x250');

  const percent = parseInt(data.percent) === 100 ? 'resizing' : `${data.percent}%`;


  return (
    <div style={{ width: 'calc(6rem + 6px + 100px)' }} onClick={onClick}>
      <div className={imageClassName}>
        <div className="p-1 w-full v-center h-center h-full">
          { data.percent !== undefined &&
          <div>
            <div className="text-center pb-1 text-xs text-gray">{percent}</div>
            <div className="preloader" />
          </div>
          }
          { data.percent === undefined && ['jpg', 'jpeg', 'png'].indexOf(data.ext) !== -1 &&
          <div className="border border-white border-3 shadow-outer">
            <img src={imageSrc} width="100%" className="block" />
          </div>
          }
          { data.percent === undefined &&
          <div className="border border-white border-3 shadow-outer grow h-full">
            <div className="v-center h-center w-full">
              <div className="tag red">{data.ext}</div>
            </div>
          </div>
          }
        </div>
      </div>
      <div className={titleClassNames}>
        <div className="text-center text-s ellipsis">{data.title}</div>
      </div>
    </div>
  );
};

export default FileListGridRow;
