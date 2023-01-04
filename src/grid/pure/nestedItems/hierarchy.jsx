
import React, { Component } from 'react';
import classNames from 'classnames';


/* !- React Elements */

import IconCheck from '../../../icon/mui/navigation/check';
import IconMaterial from '../../../icon/mui/image/contrast';
import IconRotation from '../../../icon/mui/image/rotate_90_degrees_cw';
import IconPosition from '../../../icon/mui/maps/my_location';
import IconDimension from '../../../icon/mui/text/design_services';
import IconFitToZoom from '../../../icon/mui/audioVideo/view_in_ar';
import IconVisibility from '../../../icon/mui/action/visibility';
import IconVisibilityHide from '../../../icon/mui/action/visibility_off';


/* !- Constants */

const intlRegex = new RegExp(/^[a-z0-9.]+$/);



/**
 * [Messages description]
 */
const Hierarchy = (props) =>
{
  const {
    index,
    children,
    level,
    items,
    isFirst,
    isLast,
    model,
    intl,
    nestedDataKey,
    onClickControllerA,
    onClickControllerB,
  } = props;

  const record = model.data.find(record => record[nestedDataKey] === index.substring(1)) || {};

  const {
    name,
    title,
    material,
    position,
    rotation,
    dimension,
    visible,
  } = record;

  const isParentChild = level || children.length;

  const onClick = (event) =>
  {
    if (typeof props.onClick === 'function')
    {
      props.onClick(record, event);
    }
  }

  const onMouseEnter = (event) =>
  {
    if (typeof props.onMouseEnter === 'function')
    {
      props.onMouseEnter(record, event);
    }
  }

  const onMouseLeave = (event) =>
  {
    if (typeof props.onMouseLeave === 'function')
    {
      props.onMouseLeave(record, event);
    }
  }


  const icon = items.icon || (
    <div className="w-2 text-center">
      <svg viewBox="0 0 12 12" className="w-1 h-1 fill-blue-dark"> 
        { !isParentChild &&
        <path d="M6,12 C2.6862915,12 0,9.3137085 0,6 C0,2.6862915 2.6862915,0 6,0 C9.3137085,0 12,2.6862915 12,6 C12,9.3137085 9.3137085,12 6,12 Z M6,10 C8.209139,10 10,8.209139 10,6 C10,3.790861 8.209139,2 6,2 C3.790861,2 2,3.790861 2,6 C2,8.209139 3.790861,10 6,10 Z" />
        }
        { isParentChild &&
        <circle cx="6" cy="6" r="6" />
        }
      </svg>
    </div>
  )


  return (
    <div>
      <div
        className={classNames({ "text-black-light fill-black-light pointer": visible === false })}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >

        <div className='h-center no-select'>

          { icon }

          <div
            className="bold grow p-1/2 px-1 firstcase"
          >
            { title && intlRegex.test(title) ? intl.formatMessage({ id: title }) : title }
          </div>

          <IconFitToZoom className="fill-black-light w-2 h-2 mx-1 pointer hover:fill-black" onClick={() => onClickControllerA(record)} />
          
          { visible !== false &&
          <IconVisibility className="fill-black-light w-2 h-2 pointer hover:fill-black" onClick={() => onClickControllerB(record)} />
          }

          { visible === false &&
          <IconVisibilityHide className="fill-black-light w-2 h-2 pointer hover:fill-black" onClick={() => onClickControllerB(record)} />
          }

        </div>

        <div
          className={classNames({
            "pl-2 pt-1": true,
            "border-left border-blue-dark border-2": isParentChild && (children.length || !isLast),
          })}
          style={{ marginLeft: 9 }}
        >
          <div className='flex pb-2 text-s'>

            { material &&
            <div className='h-center'>
              <IconMaterial className="w-3/2 h-3/2" />
              <div className="text-s px-1/2 pr-1 firstcase">{material}</div>
            </div>
            }

            { dimension &&
            <div className='h-center'>
              <IconDimension className="@h-1 @w-1" />
              <div className="text-s px-1/2 pr-1">{dimension}</div>
            </div>
            }

          </div>


          <div className='flex'>
            { rotation &&
              <div className='v-center pb-1'>
                <IconRotation className="w-3/2 h-3/2" />
                <div className="text-s px-1">{rotation}</div>
              </div>
            }

            { position &&
              <div className='v-center pb-1'>
                <IconPosition className="w-3/2 h-3/2" />
                <div className="text-s px-1">{position}</div>
              </div>
            }
          </div>

          { level >= 1 && children }

        </div>
      </div>

      { level < 1 && children }

    </div>
  )
};



export default Hierarchy;
