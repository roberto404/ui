import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import clamp from '@1studio/utils/math/clamp';


/* !- Constants */

// touch/mouse movement under this distance (px) is a click
const CLICK_TOLERANCE = 5;


/* !- Types */

type PropTypes = {
  src: string,
  /**
   * High resolution source, loaded in the background on the first zoom
   */
  srcZoom?: string,
  alt?: string,
  scale?: number,
  className?: string,
};


/**
 * Zoomable image: click on a point to zoom there, click again to zoom out.
 * Zoomed: the mouse pans by moving, the touch pans by dragging.
 * The zoomed image stops the pointer events, so a parent Caroussel doesn't swipe.
 *
 * @example
 * <ZoomImage src="image_1200x1200.jpg" srcZoom="image_3600x3600.jpg" alt="Kitchen" />
 */
const ZoomImage = ({
  src,
  srcZoom,
  alt = '',
  scale = 2.5,
  className = '',
}: PropTypes) => {
  const [zoomed, setZoomed] = useState(false);
  const [origin, setOrigin] = useState({ x: 50, y: 50 });
  const [isHighResolution, setIsHighResolution] = useState(false);

  const image = useRef<HTMLImageElement>(null);
  const pointer = useRef({ x: 0, y: 0, startX: 0, startY: 0, down: false, moved: false });

  /**
   * Preload the high resolution image, swap after it is loaded
   */
  useEffect(() => {
    if (!zoomed || !srcZoom || isHighResolution) {
      return;
    }

    const preload = new Image();
    preload.onload = () => setIsHighResolution(true);
    preload.src = srcZoom;
  }, [zoomed, srcZoom, isHighResolution]);

  /**
   * Position of pointer on the image in percent.
   * Offset values ignore the css transform, so it works on zoomed image too.
   * (the container is the offsetParent)
   */
  const getPercent = (event: React.PointerEvent | React.MouseEvent) => {
    const { offsetLeft, offsetTop, offsetWidth, offsetHeight } = image.current;
    const rect = event.currentTarget.getBoundingClientRect();

    return {
      x: clamp(((event.clientX - rect.left - offsetLeft) / offsetWidth) * 100, 0, 100),
      y: clamp(((event.clientY - rect.top - offsetTop) / offsetHeight) * 100, 0, 100),
    };
  };


  /* !- Handlers */

  const onPointerDownHandler = (event: React.PointerEvent) => {
    pointer.current = {
      x: event.clientX,
      y: event.clientY,
      startX: event.clientX,
      startY: event.clientY,
      down: true,
      moved: false,
    };

    if (zoomed) {
      event.stopPropagation();
    }
  };

  const onPointerMoveHandler = (event: React.PointerEvent) => {
    const current = pointer.current;

    if (
      current.down
      && Math.hypot(event.clientX - current.startX, event.clientY - current.startY) > CLICK_TOLERANCE
    ) {
      current.moved = true;
    }

    if (!zoomed) {
      return;
    }

    event.stopPropagation();

    if (event.pointerType === 'mouse') {
      setOrigin(getPercent(event));
      return;
    }

    if (current.down) {
      const { offsetWidth, offsetHeight } = image.current;
      const dx = event.clientX - current.x;
      const dy = event.clientY - current.y;

      // move the content together with the finger
      setOrigin(prev => ({
        x: clamp(prev.x - ((dx / ((scale - 1) * offsetWidth)) * 100), 0, 100),
        y: clamp(prev.y - ((dy / ((scale - 1) * offsetHeight)) * 100), 0, 100),
      }));

      current.x = event.clientX;
      current.y = event.clientY;
    }
  };

  const onPointerUpHandler = () => {
    pointer.current.down = false;
  };

  const onClickHandler = (event: React.MouseEvent) => {
    if (pointer.current.moved) {
      return;
    }

    if (zoomed) {
      setZoomed(false);
      return;
    }

    setOrigin(getPercent(event));
    setZoomed(true);
  };

  return (
    <div
      className={classNames({
        'relative flex h-center v-center w-full h-full overflow': true,
        'touch-none': zoomed,
        [className]: !!className,
      })}
      onPointerDown={onPointerDownHandler}
      onPointerMove={onPointerMoveHandler}
      onPointerUp={onPointerUpHandler}
      onPointerCancel={onPointerUpHandler}
      onClick={onClickHandler}
    >
      <img
        ref={image}
        className={classNames({
          'block m-auto': true,
          'cursor-zoom-in': !zoomed,
          'cursor-zoom-out': zoomed,
        })}
        src={zoomed && isHighResolution ? srcZoom : src}
        alt={alt}
        draggable={false}
        style={{
          maxWidth: '100%',
          maxHeight: '100%',
          transform: zoomed ? `scale(${scale})` : 'none',
          transformOrigin: `${origin.x}% ${origin.y}%`,
          transition: 'transform 0.3s ease-out',
        }}
      />
    </div>
  );
};

export default ZoomImage;
