import React, { useState, useRef } from 'react';
import { useForceUpdate } from '../hooks';

type PropTypes = 
{
  children?: JSX.Element,
}

/**
 * Testing lifecyles: mount, unmount
 */
const Tester = ({
  children
}: PropTypes) =>
{
  const [ visible, setVisible] = useState(true);
  const forceUpdate = useForceUpdate();
  const childrenRef = useRef(children);

  console.log(`Visible: ${visible}`);

  const onClickSwitchVisibilityHanlder = () =>
  {
    setVisible(!visible);
  }

  const onClickChangePropsHandler = () =>
  {
    childrenRef.current = React.cloneElement(
      children,
      {
        ...children.props,
        width: 300,
      },
    );

    forceUpdate();
  }

  return (
    <div>
      { visible && childrenRef.current}

      <div className="p-2 mt-2 column">
        <button onClick={onClickSwitchVisibilityHanlder}>Mount/Unmount</button>
        <button onClick={() => forceUpdate()}>ReRender</button>
        <button onClick={onClickChangePropsHandler}>Change Props</button>
      </div>
    </div>
  )
};


export default Tester;