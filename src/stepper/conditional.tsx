import React, { useState } from 'react';
import produceNumericArray from '@1studio/utils/array/produceNumericArray';
import IconCheckmark from '@1studio/ui/icon/mui/navigation/check';
import Tree from '@1studio/utils/models/tree';

/* Example


const Step1 = ({ onClick }) =>
{
  return (
    <div>
      <div onClick={() => onClick(1)}>cimke 1</div>
      <div onClick={() => onClick(0)}>masik 0</div>
    </div>
  )
}

const Step2a = () =>
{
  return (
    <div>Step 2a</div>
  )
}

const Step2b = () =>
{
  return (
    <div>Step 2b</div>
  )
}

const DATA = [
  {
    id: 1,
    pid: 0,
    pos: 0,
    title: 'Melyik termék tulajdonságot szerkeszted?',
    children: Step1,
  },
  {
    id: 2,
    pid: 1,
    pos: 0,
    title: 'Add meg, mit módosítasz',
    filter: (values) => values[0] == 1,
    children: Step2a,
  },
  {
    id: 3,
    pid: 1,
    pos: 1,
    title: 'Add meg mit módosítasz',
    filter: (values) => values[0] == 0,
    children: Step2b,
  }
];


*/





const Step = ({
  number,
  title,
  last,
  children,
}) => (
  <div className='flex mb-1'>

    <div className='w-3 ml-1 mr-2 column'>
      <div className='circle w-3 h-3 bg-blue-dark text-white mb-1'>
        <div className='v-center h-center h-full heavy text-s fill-white'>{last ? number : <IconCheckmark className="m-1/2" />}</div>
      </div>
      <div className='grow v-center'>
        { !last &&
        <svg height="100%" width="1px" viewBox="0 0 1 1" preserveAspectRatio="none">
          <rect width='1' height='1' fill='black' stroke-width='0' />
        </svg>
        }
      </div>
    </div>
    <div>
      <div className='heavy text-m py-1/2 mb-1'>{title}</div>
      <div className='pb-2'>
        {children}
      </div>
    </div>

  </div>
);



const StepperCondition = ({ data }) =>
  {
    const [values, setValues] = useState([]);
    
    const tree = new Tree(data);
  
    const onClickItemValueHandler = (value, index) =>
    {
      const nextValue = values.slice(0, index);
      nextValue[index] = value;

      setValues(nextValue);
    }

    let pid = 0;
  
    return (
      <div>
        {
          produceNumericArray(0, values.length).map((i, index,  indexes) => {
  
            const item =
              tree.getChildren(pid)
                .filter(({ filter }) => typeof filter !== 'function' || filter(values))?.[0];

            if (!item)
            {
              return <></>;
            }

            pid = item.id;
  
            const isLast = i === values.length || !tree.getChildren(pid).length;
  
            return (
              <Step
                number={i + 1}
                title={item.title}
                last={isLast}
              >
                <item.children
                  {...item}
                  onClick={({ value }) => onClickItemValueHandler(value, i)}
                  values={values}
                  index={index}
                />
              </Step>
            );
          })
        }
      </div>
    )
  }


  export default StepperCondition;