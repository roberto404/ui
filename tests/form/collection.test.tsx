

import { render, screen, fireEvent, store } from '../testing-library-with-providers';

import Collection from '@1studio/ui/form/components/collection';


describe('form/collection', () => {

  it('Default collection UI items: element by value, add, remove function', () => {

    const value = [
      { id: 1, title: 'foo' },
      { id: 2, title: 'bar' },
    ];

    const { container } = render(
      <Collection
        id="collection"
        label="Collection"
        value={value}
      />
    );

    const fooDiv = screen.getByText(/foo/i);
    const barDiv = screen.getByText(/bar/i);

    expect(fooDiv).toBeInTheDocument();
    expect(barDiv).toBeInTheDocument();

    // click add new one
    const buttonElement = screen.getByRole("button");
    fireEvent.click(buttonElement);

    let fooDivs = screen.getAllByText(/foo/i);

    expect(fooDivs.length).toBe(2);
    expect(store.getState().form.collection.length).toBe(3);

    // click remove
    const firstRemoveElement = container.getElementsByClassName('button action')[0];
    fireEvent.click(firstRemoveElement);

    expect(store.getState().form.collection.length).toBe(2);
    expect(screen.getAllByText(/foo/i).length).toBe(1);
  });
});