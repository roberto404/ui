import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { createMarkers } from './marker';
import 'element-closest-polyfill';


/* !- React Actions */

import { flush } from '../layer/actions';


/* !- React Elements */

// ...


/* !- Constants */

// ...

/**
 * [Card description]
 */
const Card = ({
  image,
  title,
  subTitle,
  className,
  classNameCaption,
  classNameTitle,
  classNameSubTitle,
  titleZoom,
  border,
  markers,
  createMarkers,
  onClick,
  onDragMarker,
  children,
},
{
  store,
}) =>
{
  let cardElement;

  // const onErrorImageListener = (e) =>
  // {
  //   const item = e.currentTarget;
  //   item.parentNode.removeChild(item);
  //   e.currentTarget.src = 'http://beta.rs.hu/img/uploads/700x510_1561547628.0117_5d1352b33f6cc.jpg';
  // }

  const classes = classNames({
    relative: true,
    'no-select': true,
    border: border === true,
    pointer: onClick.toString() !== Card.defaultProps.onClick.toString(),
    [className]: true,
  });

  const captionPadding = parseInt((/p-([0-9]{1})/.exec(classNameCaption) || [])[1] || 0) * 2 / 1.6;

  let imagePadding = '0rem';

  if (title || subTitle)
  {
    imagePadding += ` + ${captionPadding}em`;
  }

  if (title)
  {
    imagePadding += ' + 1.5em + 0.5em';
  }

  if (subTitle)
  {
    imagePadding += ' + 1.5em';
  }


  const onMouseOutLayerHandler = (event) =>
  {
    if (
      event.relatedTarget &&
      (
        event.currentTarget.contains(event.relatedTarget)
        || event.relatedTarget === cardElement
        || cardElement.contains(event.relatedTarget)
      )
    )
    {
      return;
    }

    event.currentTarget.removeEventListener('mouseout', onMouseOutLayerHandler);
    store.dispatch(flush());
  }

  const onMouseOutHandler = (event) =>
  {
    if (!markers || !markers.length)
    {
      return false;
    }

    cardElement = event.currentTarget;

    if (
      event.relatedTarget &&
      (
        event.currentTarget.contains(event.relatedTarget)
        || (event.relatedTarget.closest && event.relatedTarget.closest('.layer'))
      )
    )
    {
      if (event.relatedTarget.closest('.layer'))
      {
        event.relatedTarget
          .closest('.layer .container')
          .addEventListener(
            "mouseout",
            onMouseOutLayerHandler,
          )
      }

      return;
    }

    const layer = store.getState().layer;

    if (layer && layer.method === 'popover')
    {
      store.dispatch(flush());
    }
  }

  /**
   * Invoke when marker position chage by drag.
   * Marker draging enable by onDragMarker props function.
   */
  const onDragEndHandler = (event) =>
  {
    const targetRect = event.currentTarget.getBoundingClientRect();

    const x = Math.round((event.clientX - targetRect.x) / targetRect.width * 1000) / 10;
    const y = Math.round((event.clientY - targetRect.y) / targetRect.height * 1000) / 10;

    const index = event.target.dataset.index;

    onDragMarker({ x, y, index });
  }

  return (
    <div
      className={classes}
      onClick={onClick}
      onMouseOut={onMouseOutHandler}
      style={{ paddingBottom: `calc(${imagePadding})`, fontSize: `${titleZoom}%` }}
    >
      { image &&
      <div
        className="relative"
        onDragEnd={onDragMarker ? onDragEndHandler : undefined}
        style={{ fontSize: `${100 * 100/titleZoom}%` }}
      >
        <img
          className="block m-auto w-auto h-auto"
          src={image}
          width="auto"
          height="auto"
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
          }}
          alt={title}
          // onError={this.onErrorImageListener}
        />
        { markers ? createMarkers(onDragMarker ? markers.map(marker => ({...marker, draggable: true })) : markers) : children }
      </div>
      }
      { (title || subTitle) &&
        <div className={classNameCaption} style={{ minHeight: `calc(${imagePadding})`, padding: `${captionPadding / 2}em 1em`, bottom: 0 }}>
          { title &&
          <div className={classNameTitle} style={{ wordBreak: 'break-word' }}>{title}</div>
          }
          { subTitle &&
          <div className={classNameSubTitle}>{subTitle}</div>
          }
        </div>
      }
    </div>
  );
};

Card.defaultProps =
{
  image: '',
  title: '',
  subTitle: '',
  className: '',
  classNameCaption: 'bg-white p-2 absolute w-full',
  classNameTitle: 'text-l bold text-line-m mobile:text-m',
  classNameSubTitle: 'pt-1/2 light text-line-l',
  titleZoom: 100,
  createMarkers,
  onClick: () =>
  {
    return false;
  },
};

Card.propTypes =
{
  onDragMarker: PropTypes.func,
  titleZoom: PropTypes.number,
}

Card.contextTypes =
{
  store: PropTypes.object,
  register: PropTypes.object,
};

export default Card;
