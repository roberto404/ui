
import React, { useRef, useEffect } from 'react';
import { useForceUpdate } from './hooks';



/* !- Types */

const defaultProps =
{
  width: 0,
  height: 0,
  initWidth: 200,
};

type PropTypes = Partial<typeof defaultProps> & {
  children: JSX.Element,
};


/**
 * Resize component
 *
 * Calculate parent element dimension and
 * push width and height props to children
 *
 * @example
 * <Resize>{width => <svg width={width} />}</Resize>
 */
const Resize = (props: PropTypes) =>
{
  const element = useRef(null);
  const forceUpdate = useForceUpdate();

  // componentDidMount
  useEffect(
    () =>
    {
      forceUpdate();
    },
    [],
  );

  const width = element.current && !props.width ?
  element.current.offsetWidth : props.width || props.initWidth;

  const height = element.current && !props.height ?
    element.current.offsetHeight : props.height || width;

  return (
    <div
      style={{ width: '100%', height: props.height || '100%' }}
      ref={element}
    >
      {React.cloneElement(props.children, { width, height })}
    </div>
  );
}

Resize.defaultProps = defaultProps;

export default Resize;
