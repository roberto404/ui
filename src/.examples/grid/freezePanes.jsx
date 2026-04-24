import React from 'react';
import produceNumericArray from '@1studio/utils/array/produceNumericArray';


const GridFreezePanes = () => {


  return (
    <div className='relative border w-full h-full freezePanes' style={{ width: 200, height: 200 }}>

      <div>

        {/* Header */}
        <div>
          <div className="bg-gray-dark bold">#</div>
          <div className="bg-gray">RS2 Áruház</div>
          <div className="bg-gray">RS6 Áruház</div>
          <div className="bg-gray">RS8 Áruház</div>
          <div className="bg-gray">Web</div>
          <div className="bg-gray">RS</div>
        </div>

        {/* Rows */}
        {produceNumericArray(0, 24).map((rowIndex) => (
          <div key={rowIndex}>
            <div>Row {rowIndex}</div>
            <div>Data {rowIndex * 1}</div>
            <div>Data {rowIndex * 2}</div>
            <div>Data {rowIndex * 3}</div>
            <div>Data {rowIndex * 4}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GridFreezePanes;