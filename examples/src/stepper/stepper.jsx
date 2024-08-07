
import React from 'react';


/* !- React Elements */

import Stepper from '../../../src/stepper/stepper';
import Resize from '../../../src/resize';
import StepTimeline from '../../../src/stepper/stepTimeline';


/* !- Actions */

// ...

/* !- Constants */

// ...


/**
 * GridView + Filters + Connect + Paginate
 */
const Example = () =>
{

  return (
    <div style={{ height: '3vh' }}>
      <h1>Stepper</h1>

      <h2>Simple stepper</h2>

      <Stepper
        data={[
          {
            label: '1',
          },
          {
            label: '2',
          },
          {
            label: '3',
          },
        ]}
      />

      <h2>Stepper with status</h2>

      <Stepper
        data={[
          {
            label: '1',
            status: 1,
          },
          {
            label: '2',
            status: 'complete',
          },
          {
            label: '3',
            status: 'warning',
          },
        ]}
      />

      <h2>numeric stepper with events</h2>

      <Stepper
        type="numeric"
        data={[
          {
            status: 'complete',
            onClick: () => console.log(1),
          },
          {},
          {},
        ]}
        onClick={() => console.log(2)}
      />


      <h2>Stepper with custom icon</h2>

      <Stepper
        data={[
          {
            label: '1',
            status: 1,
          },
          {
            label: '2',
            status: 'error',
            classNameText: 'fill-red'
          },
          {
            label: '3',
            icon: (
              <g>
                <text fill="#000000" fontSize="8">
                  <tspan x="4" y="12">RS2</tspan>
                </text>
                <path d="M35.0595472,10.1687767 C35.1237522,10.2763695 35.1567262,10.3996656 35.1567262,10.5263031 L35.1567262,20.1374908 C35.1567262,20.5264296 34.8408196,20.8405652 34.4518837,20.8405652 L31.8109807,20.8405652 C31.4522766,22.8830377 29.821715,23.9823314 28.1805492,23.9997926 C26.5401715,24.0170707 24.8886023,22.9547018 24.4833653,20.8405652 L10.7536599,20.8405652 C10.0878879,24.9243339 4.06531376,25.1554176 3.38403002,20.8405652 L1.40968536,20.8405652 C0.631804765,20.8405652 0,20.2087608 0,19.4328445 L0,1.40968538 C0,0.631804721 0.631804765,-1.62632529e-16 1.40968536,0 L21.8128179,0 C22.5904994,0 23.2223053,0.631804721 23.2223053,1.40968538 L23.2223053,2.96642565 L28.6279977,2.96642565 C28.6904301,2.96642565 28.7495227,2.97506542 28.8068575,2.9907629 C30.5563998,3.14351199 31.4314653,4.04625996 32.3583622,5.59102248 L35.0595413,10.1687694 L35.0595472,10.1687767 Z M31.8700762,12.8679842 L31.8700762,13.8033225 L34.2531925,13.8033225 L34.2531925,11.7838211 L32.5749188,11.7838211 C32.1859799,11.7838211 31.8700762,12.4792402 31.8700762,12.8679842 Z M34.0843435,10.5080377 L31.3531215,5.94094851 L25.483687,5.93933716 L25.483687,9.26957959 C25.483687,9.66539027 26.3122197,10.4941215 26.7080332,10.4941215 C26.7583073,10.4941215 26.8052269,10.499395 26.8521465,10.5080377 L34.0843435,10.5080377 Z M0.903730118,0.903722076 L0.903730118,19.9387908 L3.38403002,19.9387908 C3.53756252,17.6952717 5.37427544,16.332304 7.032915,16.3488057 C8.73101681,16.3656897 10.6154406,17.5613699 10.7536599,19.9387908 L22.318773,19.9387908 L22.318773,0.903722076 L0.903730118,0.903722076 Z M4.22866158,20.2193532 C4.1725094,24.2080918 9.81282384,24.1222918 9.86858095,20.1357095 C9.86858095,16.3376141 4.22866158,16.3855181 4.22866158,20.2193532 Z M25.3262317,20.1357095 C25.3122921,22.1039691 26.7524098,23.1087952 28.1803559,23.0844638 C29.5715822,23.0609059 30.9522337,22.0580266 30.9661499,20.1357095 C31.0238729,16.2561311 25.3802266,16.267913 25.3262317,20.1357095 Z M31.8109807,19.8121504 L31.8109807,19.8123482 L34.2531925,19.8123482 L34.2531925,14.9599289 L31.670994,14.9599289 C31.2820536,14.9599289 30.9661499,14.3911473 30.9661499,14.0022055 L30.9661499,12.8681761 C30.9661499,12.3039092 31.1884034,11.7918676 31.5494616,11.4115655 L26.7080376,11.4115655 C26.648942,11.4115655 26.5900399,11.4047246 26.5344776,11.3909549 C25.4424613,11.3006417 24.5815317,10.3839549 24.5815317,9.26955469 L24.5815317,5.74043359 C24.5815317,5.35149473 24.8956702,5.03735927 25.2846091,5.03735927 L30.7118965,5.03735927 C30.21517,4.56517265 29.1486761,3.86994942 28.2494623,3.86994942 L23.2223053,3.86994942 L23.2223053,19.8121504 L24.4833653,19.8121504 C24.7044396,17.6118257 26.421585,16.3787987 28.1442279,16.3705955 C29.8079717,16.3623498 31.6664719,17.6033822 31.8109807,19.8121504 Z" fill="#858585"  />
              </g>
            ),
          },
        ]}
      />


      <h2>stepper with tooltip</h2>

      <Stepper
        type="numeric"
        data={[
          {
            tooltip: '1'
          },
          {
            tooltip: '2'
          },
          {
            tooltip: '3'
          },
        ]}
      />


      <h2>Custom stepper with dynamic size</h2>

      <div style={{ width: '200px', }}>
        <Resize
          height={45}
        >
          <Stepper
            data={[
              {
                label: 'First',
                date: '1st',
              },
              {
                label: 'Second',
                date: '2nd',
              },
              {
                label: 'Third',
                date: '3rd',
              },
              {
                label: 'Fourth',
                date: '4th',
              },
            ]}
            step={StepTimeline}
          />
        </Resize>
      </div>


      <h2>X-Scale</h2>

      <Stepper
        width="1000"
        data={[
          {
            label: '1',
          },
          {
            label: '2',
          },
          {
            label: '3',
          },
        ]}
      />


      <h2>Scale</h2>

      <Stepper
        width="1000"
        height="100"
        data={[
          {
            label: '1',
          },
          {
            label: '2',
          },
          {
            label: '3',
          },
        ]}
      />

      <h2>Classes</h2>

      <Stepper
        data={[
          {
            label: '1',
          },
          {
            label: '2',
            // className: 'red',
            classNameText: 'yellow',
            classNameLine: 'stroke-1 stroke-yellow',
          },
          {
            label: '2',
            // className: 'red',
            classNameText: 'blue',
            classNameLine: 'dashed gray-light',
          },
        ]}
      />



    </div>
  );
};

export default Example;
