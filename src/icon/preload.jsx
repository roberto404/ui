import React from 'react';

export default (props) =>
(
  <svg version="1.0" viewBox="0 0 36 36" className="spinning" { ...props } >
{/*
    <path style={{ fill: '#fff' }} d='M5.2721,5.2721,7.3934,7.3934a15,15,0,0,1,21.2132,0l2.1213-2.1213A18,18,0,0,0,5.2721,5.2721Z'/>
    */}
    <path d='M28.6066,28.6066A15,15,0,0,1,7.3934,7.3934L5.2721,5.2721a18,18,0,1,0,25.4558,0L28.6066,7.3934A15,15,0,0,1,28.6066,28.6066Z'/>
  </svg>
)