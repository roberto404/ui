import React from 'react';
import { useDispatch } from 'react-redux';
import produceNumericArray from '@1studio/utils/array/produceNumericArray';


/* !- Actions */

import { setData, addRecords } from '../../grid/actions';


/* !- Components */

import Connect from '../../connect';


/* !- Constants */

const DATA = [
  {
    id: 1,
    title: '1',
  },
  {
    id: 2,
    title: '2',
  },
  {
    id: 3,
    title: '3',
  },
];



const TargetElement = ({ totalPage }) =>
  (
    <div>{`Total page: ${totalPage}`}</div>
  );

  
const ExampleResize = () =>
{
  const dispatch = useDispatch();

  dispatch(setData(DATA, {}, 'example'));

  const onClickHandler = () =>
  {
    dispatch(addRecords(
      produceNumericArray(0, 20)
        .map(n => ({
          id: parseInt(Math.random() * 10000),
        })
        ),
      'example',
    ));
  }

  return (
    <div>
      <Connect
        store="grid"
        grid="example"
        id="example"
        listen="totalPage"
      >
        <TargetElement />
      </Connect>

      <div className="button w-content outline mt-2" onClick={onClickHandler}>Add records</div>
    </div>
  )
};

export default ExampleResize;