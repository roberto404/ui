
import React, { useRef, useState, useLayoutEffect } from 'react';



/* !- Types */

const defaultProps =
{
  width: 0,
  height: 0,
  initWidth: 200,
  className: '',
};

type PropTypes = Partial<typeof defaultProps> & {
  children: JSX.Element,
};


/**
 * Resize component
 *
 * Measures its container (live, via ResizeObserver) and passes the real pixel
 * `width` / `height` to its child, so the child re-renders at the actual size
 * instead of being scaled up/down — text, markers and strokes stay crisp and
 * readable at any size.
 *
 * @example
 * <Resize><svg /></Resize>              // fluid width + height
 * <Resize height={340}><svg /></Resize> // fluid width, fixed height
 */
const Resize = (props: PropTypes) => {
  const element = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(
    () => {
      const node = element.current;

      if (!node) {
        return undefined;
      }

      const measure = () => setSize((prev) => {
        const width = node.offsetWidth;
        const height = node.offsetHeight;

        return (prev.width === width && prev.height === height) ? prev : { width, height };
      });

      measure();

      if (typeof ResizeObserver === 'undefined') {
        return undefined;
      }

      const observer = new ResizeObserver(measure);
      observer.observe(node);

      return () => observer.disconnect();
    },
    [],
  );

  const width = props.width || size.width || props.initWidth;
  const height = props.height || size.height || width;

  return (
    <div
      style={{ width: '100%', height: props.height || '100%' }}
      ref={element}
      className={props.className}
    >
      {React.cloneElement(props.children, { width, height })}
    </div>
  );
};

Resize.defaultProps = defaultProps;

export default Resize;
