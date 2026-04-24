

import { render, screen, fireEvent } from '@testing-library/react';
// import Example from '../../src/.examples/form/format';
// import Example from '@1studio/ui/.examples/stepper/stepper';

import Stepper from '@1studio/ui/stepper/stepper';

describe('stepper/Stepper', () => {

  it('data length', () => {

    const { container } = render(
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
    );
    
    const svgElement = container.querySelector('svg');
    expect(svgElement.children.length).toBe(3);
  });

});