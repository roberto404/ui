import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { createMarkers } from './marker';


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
  border,
  markers,
  createMarkers,
  onClick,
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
    [className]: true,
    border: border === true,
    pointer: onClick.toString() !== Card.defaultProps.onClick.toString(),
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
    cardElement = event.currentTarget;

    if (
      event.relatedTarget &&
      (
        event.currentTarget.contains(event.relatedTarget)
        || event.relatedTarget.closest('.layer')
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

  return (
    <div
      className={classes}
      onClick={onClick}
      onMouseOut={onMouseOutHandler}
      style={{ paddingBottom: `calc(${imagePadding})` }}
    >
      { image &&
      <div className="relative">
        <img
          className="block w-full h-auto"
          src={image}
          width="100%"
          height="auto"
          alt={title}
          // onError={this.onErrorImageListener}
        />
        {markers ? createMarkers(markers) : children}
      </div>
      }
      { (title || subTitle) &&
        <div className={classNameCaption} style={{ minHeight: `calc(${imagePadding})`, padding: `${captionPadding / 2}em` }}>
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
  classNameCaption: 'bg-white p-2 pin-b absolute w-full',
  classNameTitle: 'text-l bold text-line-m',
  classNameSubTitle: 'pt-1/2 light text-line-l',
  createMarkers,
  onClick: () =>
  {},
};

Card.contextTypes =
{
  store: PropTypes.object,
  register: PropTypes.object,
};

export default Card;