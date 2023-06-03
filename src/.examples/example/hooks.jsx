import React, { useState, useEffect, useMemo, useContext } from 'react';
import { useSelector, useDispatch, ReactReduxContext } from 'react-redux';



import { setValues } from '../../form/actions';


const Component = ({ memoProp }) =>
{
  const [counter, setCounter] = useState(1);

  const formCounter = useSelector((state) =>
  {
    return state.form.counter;
  }); // getState()
  console.log(formCounter);


  const dispatch = useDispatch();
  const { store } = useContext(ReactReduxContext);

  // invoke if counter change
  useEffect(
    () =>
    {
      console.log(`useEffect: ${counter}`);
    },
    [counter],
  );

  useEffect(
    () =>
    {
      console.log(`useEffect formCounter: ${formCounter}`);
    },
    [formCounter], // if empty invoke only once like componentDidMount, if set props mean componentDidUpdate 
  );

  // if invoke if memoProp change
  const memo = useMemo(
    () =>
    {
      console.log('use Memo');
      return 1;
    },
    [memoProp],
  );

  const onClickCounterHandler = () =>
  {
    setCounter(counter + 1);
  }

  const onClickCounterHandler2 = () =>
  {
    dispatch(setValues({ id: 'counter', value: counter }));
  }

  return (
    <div>
      <div className="button primary" onClick={onClickCounterHandler}>{counter}</div>
      <div className="button primary" onClick={onClickCounterHandler2}>add redux form</div>
    </div>
  )
};


export default Component;