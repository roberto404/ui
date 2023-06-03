import React from 'react';

const ExampleForm = () =>
(
  <div>

    <h2>Grid-2-4</h2>

    <div className="grid-2-4 border">
      <div className="col-1-1">
        <div className="border border-3 border-black w-full h-4 bg-green" />
      </div>
      <div className="col">
        <div className="border border-3 border-black w-full h-4 bg-green" />
      </div>
      <div className="col-1-2">
        <div className="border border-3 border-black w-full h-4 bg-green" />
      </div>
      <div className="col-1-2">
        <div className="border border-3 border-black w-full h-4 bg-green" />
      </div>
    </div>

    <h2>Grid-2</h2>

    <div className="grid-2 border">
      <div className="col-1-3">
        <div className="border border-3 border-black w-full h-4 bg-green" />
      </div>
      <div className="col-1-3">
        <div className="border border-3 border-black w-full h-4 bg-green" />
      </div>
      <div className="col-1-3">
        <div className="border border-3 border-black w-full h-4 bg-green" />
      </div>
      <div className="col-1-1">
        <div className="border border-3 border-black w-full h-4 bg-green" />
      </div>
      <div className="col">
        <div className="border border-3 border-black w-full h-4 bg-green" />
      </div>
      <div className="col-1-4">
        <div className="border border-3 border-black w-full h-4 bg-green" />
      </div>
      <div className="col-2-4">
        <div className="border border-3 border-black w-full h-4 bg-green" />
      </div>
    </div>

    <h2>Grid-2 expand</h2>

      <div className="grid-2 border">
        <div className="columns">
          <div className="col-1-4">
            <div className="border border-3 border-black w-full h-4 bg-green" />
          </div>
          <div className="col-1-4">
            <div className="border border-3 border-black w-full h-4 bg-green" />
          </div>
          <div className="col-1-4">
            <div className="border border-3 border-black w-full h-4 bg-green" />
          </div>
          <div className="col-1-4">
            <div className="border border-3 border-black w-full h-4 bg-green" />
          </div>
          <div className="col-1-4">
            <div className="border border-3 border-black w-full h-4 bg-green" />
          </div>
          <div className="col-2-4">
            <div className="border border-3 border-black w-full h-4 bg-green" />
          </div>
        </div>
    </div>

    <h2>Grid-2-2 expand</h2>

    <div className="grid-2-2 border">
      <div className="columns">
        <div className="col-1-2">
          <div className="border border-3 border-black w-full h-4 bg-green" />
        </div>
        <div className="col-1-2">
          <div className="border border-3 border-black w-full h-4 bg-green" />
        </div>
        <div className="col-1-1">
          <div className="border border-3 border-black w-full h-4 bg-green" />
        </div>
        <div className="col">
          <div className="border border-3 border-black w-full h-4 bg-green" />
        </div>
      </div>
    </div>

    <h2>Grid-2-2 overflow</h2>

    <div className="grid-2-2 border overflow" style={{ marginRight: '-2rem', 'width': 'calc(100% + 2rem)' }}>
        <div className="col-1-2">
          <div className="border border-3 border-black w-full h-4 bg-green" />
        </div>
        <div className="col-1-2">
          <div className="border border-3 border-black w-full h-4 bg-green" />
        </div>
        <div className="col-1-1">
          <div className="border border-3 border-black w-full h-4 bg-green" />
        </div>
        <div className="col">
          <div className="border border-3 border-black w-full h-4 bg-green" />
        </div>
    </div>

  </div>
);


export default ExampleForm;
