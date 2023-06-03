import React, { useState } from 'react';


const Test = () =>
{
  const [x, setX] = useState(1);

  return (
    <div>{`Test: ${x}`}</div>
  );
}

export default Test;