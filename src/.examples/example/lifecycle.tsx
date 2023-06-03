import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { useForceUpdate } from '../../hooks';

import { setValues } from '../../form/actions';


const Lifecycle = ({ visible, counter }) =>
{
  const someProp = useRef('');
  const firstRender = useRef(true);

  // invoke => forceUpdate();
  const forceUpdate = useForceUpdate();


  // componentWillMount => constructor
  useMemo(
    () => {
      someProp.current = 'foo';
      console.log('componentWillMount', visible, counter);
    },
    [],
  );

  // componentWillUpdate
  useMemo(
    () => {
      if (firstRender.current)
      {
        return;
      }
      console.log('componentWillUpdate', visible, counter);
    },
    [counter],
  );

  // componentDidMount, componentWillUnmount
  useEffect(
    () =>
    {
      // componentDidMount
      console.log('componentDidMount ✓', visible, counter, someProp.current);

      // componentWillUnmount
      return () =>
      {
        console.log('componentWillUnmount', visible, counter)
      };
    },
    [],
  );

  useEffect(
    () =>
    {
      if (firstRender.current)
      {
        firstRender.current = false;
        return;
      }

      console.log('componentDidUpdate', counter);
    },
    [counter]
  )

  console.log('render', visible, counter, someProp.current);

  return (
    <div>[Component]</div>
  )
};

const Component = ({}) =>
{
  const [ visible, setVisible] = useState(true);
  const [ counter, increaseCounter] = useState(1);

  const onClickHandler = () =>
  {
    setVisible(!visible);
  }

  const onClickIncreaseCounter = () =>
  {
    increaseCounter(counter + 1);
  }

  return (
    <div>
      
      { visible &&
      <Lifecycle visible={visible} counter={counter} />
      }

      <div className="button outline w-content m-1" onClick={onClickHandler}>
        setVisible
      </div>
      <div className="button outline w-content m-1" onClick={onClickIncreaseCounter}>counter</div>
    </div>
  );
}


export default Component;