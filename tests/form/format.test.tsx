

import { render, screen, fireEvent, store } from '../testing-library-with-providers';

import Example, { postfix } from '@1studio/ui/.examples/form/format';



describe('form/Format', () => {

  it('format and stateFormat in input', () => {

    render(
      <Example />
    );

    const inputNextValue = '123';
    const inputElement = screen.getByLabelText(/Demostrate/i) as HTMLInputElement;

    // default value
    expect(inputElement.value).toBe(postfix); 

    // modified value
    fireEvent.change(inputElement, { target: { value: inputNextValue } });
    expect(inputElement.value).toBe(inputNextValue + postfix); 

    // redux value
    expect(store.getState().form.example.input).toBe(inputNextValue);

  });

  it('format and stateFormat in checkbox', () => {

    render(<Example />);

    const checkbox = screen.getByLabelText(/apply/i) as HTMLInputElement;

    // default uncheck state
    expect(checkbox.checked).toBe(false); 
    
    // onClick
    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(true);

    // redux value
    expect(store.getState().form.example.checkbox).toBe("1");
  })

});