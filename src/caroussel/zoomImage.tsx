import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import clamp from '@1studio/utils/math/clamp';


/* !- Constants */

// touch/mouse movement under this distance (px) is a click / tap
const CLICK_TOLERANCE = 5;
// max delay (ms) and distance (px) between two taps of a double tap
const DOUBLE_TAP_DELAY = 300;
const DOUBLE_TAP_DISTANCE = 30;
// zoom in/out animation (ms)
const TRANSITION = 300;

/**
 * translate (px, from the not transformed image position) and scale, origin: top left
 */
type Transform = { scale: number, x: number, y: number };

const INITIAL_TRANSFORM: Transform = { scale: 1, x: 0, y: 0 };


/* !- Types */

type PropTypes = {
  src: string,
  /**
   * High resolution source, loaded in the background on the first zoom
   */
  srcZoom?: string,
  alt?: string,
  /**
   * Zoom of click / double tap
   */
  scale?: number,
  /**
   * Max zoom of pinch
   */
  maxScale?: number,
  className?: string,
  /**
   * Overlay of the image (ex. markers), positioned in percent of the image.
   * It follows the zoom, but its elements keep their size.
   */
  children?: React.ReactNode,
};


/**
 * Zoomable image.
 *
 * Mouse: click on a point to zoom there, the zoomed image follows the mouse, click again to zoom out.
 * Touch: pinch to zoom, double tap to zoom in/out, drag to pan the zoomed image.
 * Not zoomed one finger swipe goes to the parent (ex. Caroussel paging),
 * zoomed or pinch gestures stop the pointer events natively (the hammer.js listener of Caroussel is under the React root).
 *
 * @example
 * <ZoomImage src="image_1200x1200.jpg" srcZoom="image_3600x3600.jpg" alt="Kitchen" />
 *
 * @example
 * // with markers
 * <ZoomImage src="image_1200x1200.jpg">{createMarkers(markers)}</ZoomImage>
 */
const ZoomImage = ({
  src,
  srcZoom,
  alt = '',
  scale = 2.5,
  maxScale = 4,
  className = '',
  children,
}: PropTypes) => {
  const [transform, setTransform] = useState<Transform>(INITIAL_TRANSFORM);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isHighResolution, setIsHighResolution] = useState(false);
  // image position in the container (not transformed), base of the overlay
  const [box, setBox] = useState({ left: 0, top: 0, width: 0, height: 0 });

  const container = useRef<HTMLDivElement>(null);
  const image = useRef<HTMLImageElement>(null);
  const overlay = useRef<HTMLDivElement>(null);

  // current values for the native listeners
  const current = useRef(INITIAL_TRANSFORM);
  const gesture = useRef({
    pointers: new Map<number, { x: number, y: number }>(),
    pointerType: 'mouse',
    moved: false,
    // single pointer pan or pinch start
    start: { x: 0, y: 0, distance: 0, transform: INITIAL_TRANSFORM },
    lastTap: { time: 0, x: 0, y: 0 },
  });

  const zoomed = transform.scale > 1;

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


  /* !- Transform helpers */

  /**
   * Keep the image in the container: centered if it is smaller, else no empty edge.
   */
  const clampTransform = ({ scale: nextScale, x, y }: Transform): Transform => {
    if (!image.current || !container.current) {
      return INITIAL_TRANSFORM;
    }

    const { offsetLeft, offsetTop, offsetWidth, offsetHeight } = image.current;
    const { clientWidth, clientHeight } = container.current;
    const s = clamp(nextScale, 1, maxScale);

    const clampAxis = (offset: number, position: number, size: number, containerSize: number) => (
      size <= containerSize
        ? ((containerSize - size) / 2) - offset
        : clamp(position, containerSize - size - offset, -offset)
    );

    return {
      scale: s,
      x: clampAxis(offsetLeft, x, offsetWidth * s, clientWidth),
      y: clampAxis(offsetTop, y, offsetHeight * s, clientHeight),
    };
  };

  const apply = (next: Transform, animate = false) => {
    const clamped = next.scale <= 1 ? INITIAL_TRANSFORM : clampTransform(next);

    current.current = clamped;
    setTransform(clamped);

    if (animate) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), TRANSITION);
    }
  };

  /**
   * Zoom so the point (container position) stays at the same place
   */
  const zoomAt = (nextScale: number, px: number, py: number, from = current.current, animate = false) => {
    const { offsetLeft, offsetTop } = image.current;
    const ratio = nextScale / from.scale;

    apply({
      scale: nextScale,
      x: px - offsetLeft - ((px - offsetLeft - from.x) * ratio),
      y: py - offsetTop - ((py - offsetTop - from.y) * ratio),
    }, animate);
  };

  /**
   * Zoomed image follows the mouse: the mouse position in the container = position on the image
   */
  const followMouse = (px: number, py: number) => {
    const { offsetLeft, offsetTop, offsetWidth, offsetHeight } = image.current;
    const { clientWidth, clientHeight } = container.current;
    const { scale: s } = current.current;

    apply({
      scale: s,
      x: -((offsetWidth * s) - clientWidth) * (px / clientWidth) - offsetLeft,
      y: -((offsetHeight * s) - clientHeight) * (py / clientHeight) - offsetTop,
    });
  };

  /**
   * Follow the image position (load, resize)
   */
  const updateBox = () => {
    if (!image.current) {
      return;
    }

    const { offsetLeft, offsetTop, offsetWidth, offsetHeight } = image.current;
    setBox({ left: offsetLeft, top: offsetTop, width: offsetWidth, height: offsetHeight });

    if (current.current.scale > 1) {
      apply(current.current);
    }
  };

  useEffect(() => {
    if (typeof ResizeObserver === 'undefined' || !image.current) {
      return;
    }

    const observer = new ResizeObserver(updateBox);
    observer.observe(image.current);
    observer.observe(container.current);

    return () => observer.disconnect();
  }, []);


  /* !- Native pointer listeners */

  useEffect(() => {
    const element = container.current;

    if (!element) {
      return;
    }

    const getPosition = (event: PointerEvent) => {
      const rect = element.getBoundingClientRect();
      return { x: event.clientX - rect.left, y: event.clientY - rect.top };
    };

    const getPinch = () => {
      const [a, b] = [...gesture.current.pointers.values()];

      return {
        distance: Math.hypot(a.x - b.x, a.y - b.y),
        x: (a.x + b.x) / 2,
        y: (a.y + b.y) / 2,
      };
    };

    const startGesture = () => {
      const g = gesture.current;

      if (g.pointers.size === 2) {
        const pinch = getPinch();
        g.start = { x: pinch.x, y: pinch.y, distance: pinch.distance, transform: current.current };
      }
      else if (g.pointers.size === 1) {
        const [pointer] = [...g.pointers.values()];
        g.start = { x: pointer.x, y: pointer.y, distance: 0, transform: current.current };
      }
    };

    const onPointerDown = (event: PointerEvent) => {
      const g = gesture.current;

      g.pointers.set(event.pointerId, getPosition(event));
      g.pointerType = event.pointerType;

      if (g.pointers.size === 1) {
        g.moved = false;
      }

      startGesture();

      // zoomed pan or pinch: the parent Caroussel must not swipe
      if (current.current.scale > 1 || g.pointers.size > 1) {
        event.stopPropagation();
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      const g = gesture.current;
      const position = getPosition(event);

      // mouse hover
      if (!g.pointers.has(event.pointerId)) {
        if (event.pointerType === 'mouse' && current.current.scale > 1) {
          followMouse(position.x, position.y);
        }

        return;
      }

      g.pointers.set(event.pointerId, position);

      // pinch zoom around the center of the fingers, the center movement pans
      if (g.pointers.size === 2) {
        const pinch = getPinch();
        const { start } = g;
        const nextScale = clamp(start.transform.scale * (pinch.distance / start.distance), 1, maxScale);
        const { offsetLeft, offsetTop } = image.current;
        const ratio = nextScale / start.transform.scale;

        g.moved = true;

        apply({
          scale: nextScale,
          x: pinch.x - offsetLeft - ((start.x - offsetLeft - start.transform.x) * ratio),
          y: pinch.y - offsetTop - ((start.y - offsetTop - start.transform.y) * ratio),
        });

        event.stopPropagation();
        return;
      }

      const dx = position.x - g.start.x;
      const dy = position.y - g.start.y;

      if (Math.hypot(dx, dy) > CLICK_TOLERANCE) {
        g.moved = true;
      }

      if (current.current.scale <= 1) {
        return;
      }

      if (event.pointerType === 'mouse') {
        followMouse(position.x, position.y);
      }
      else {
        apply({
          ...g.start.transform,
          x: g.start.transform.x + dx,
          y: g.start.transform.y + dy,
        });
      }

      event.stopPropagation();
    };

    // the up event goes to the parent: it closes its gesture (ex. hammer.js pan)
    const onPointerUp = (event: PointerEvent) => {
      const g = gesture.current;

      if (!g.pointers.has(event.pointerId)) {
        return;
      }

      const position = getPosition(event);
      g.pointers.delete(event.pointerId);

      // pinch to pan: continue with the other finger
      if (g.pointers.size) {
        startGesture();
        return;
      }

      if (event.pointerType === 'mouse' || g.moved) {
        return;
      }

      // double tap
      const now = Date.now();
      const { lastTap } = g;

      if (
        now - lastTap.time < DOUBLE_TAP_DELAY
        && Math.hypot(position.x - lastTap.x, position.y - lastTap.y) < DOUBLE_TAP_DISTANCE
      ) {
        g.lastTap = { time: 0, x: 0, y: 0 };

        if (current.current.scale > 1) {
          apply(INITIAL_TRANSFORM, true);
        }
        else {
          zoomAt(scale, position.x, position.y, INITIAL_TRANSFORM, true);
        }
      }
      else {
        g.lastTap = { time: now, x: position.x, y: position.y };
      }
    };

    element.addEventListener('pointerdown', onPointerDown);
    element.addEventListener('pointermove', onPointerMove);
    element.addEventListener('pointerup', onPointerUp);
    element.addEventListener('pointercancel', onPointerUp);

    return () => {
      element.removeEventListener('pointerdown', onPointerDown);
      element.removeEventListener('pointermove', onPointerMove);
      element.removeEventListener('pointerup', onPointerUp);
      element.removeEventListener('pointercancel', onPointerUp);
    };
  }, [scale, maxScale]);


  /* !- Handlers */

  /**
   * Mouse click zoom (touch uses double tap)
   */
  const onClickHandler = (event: React.MouseEvent) => {
    const g = gesture.current;

    // click on an overlay element (ex. marker)
    if (
      g.pointerType !== 'mouse'
      || g.moved
      || (overlay.current && overlay.current !== event.target && overlay.current.contains(event.target as Node))
    ) {
      return;
    }

    if (current.current.scale > 1) {
      apply(INITIAL_TRANSFORM, true);
      return;
    }

    const rect = container.current.getBoundingClientRect();
    zoomAt(scale, event.clientX - rect.left, event.clientY - rect.top, INITIAL_TRANSFORM, true);
  };

  const transition = isAnimating ? `${TRANSITION}ms ease-out` : 'none';

  /**
   * Overlay box: the scaled image box, so the overlay elements keep their size
   */
  const overlayStyle = {
    left: box.left + transform.x,
    top: box.top + transform.y,
    width: box.width * transform.scale,
    height: box.height * transform.scale,
    transition: isAnimating ? `all ${transition}` : 'none',
  };

  return (
    <div
      ref={container}
      className={classNames({
        'relative flex h-center v-center w-full h-full overflow touch-none': true,
        [className]: !!className,
      })}
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
          transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
          transformOrigin: '0 0',
          transition: isAnimating ? `transform ${transition}` : 'none',
        }}
        onLoad={updateBox}
      />

      {children && (
        <div
          ref={overlay}
          className={classNames({
            absolute: true,
            'cursor-zoom-in': !zoomed,
            'cursor-zoom-out': zoomed,
          })}
          style={overlayStyle}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export default ZoomImage;
