import React from 'react';
import { render, screen, fireEvent, act, store } from '../testing-library-with-providers';

import Tutorial from '@1studio/ui/tutorial/tutorial';
import { setTutorial, closeTutorial } from '@1studio/ui/tutorial/actions';

const step = (props = {}) => ({ title: '', description: '', dom: '', media: [], url: '', highlight: true, ...props });

const TUTORIAL = {
  id: 7,
  status: 1 as const,
  title: 'Teszt',
  steps: [
    step({ title: 'Első', description: 'Középen' }),
    step({ title: 'Második', dom: 'target', highlight: false, url: '/other' }),
  ],
};

const size = { width: 100, height: 40, top: 50, left: 20, right: 120, bottom: 90, x: 20, y: 50, toJSON: () => { } };

describe('tutorial/Tutorial', () => {
  afterEach(() => {
    act(() => {
      store.dispatch(closeTutorial());
    });
  });

  it('renders nothing when inactive', () => {
    render(<Tutorial />);
    expect(document.querySelector('.tutorial')).toBeNull();
  });

  it('steps through, highlights, navigates and closes', () => {
    const navigate = jest.fn();

    render(
      <div>
        <div data-tutorial="target">Cél</div>
        <Tutorial navigate={navigate} />
      </div>,
    );

    const target = screen.getByText('Cél');
    target.getBoundingClientRect = () => size as DOMRect;
    target.scrollIntoView = jest.fn();

    act(() => {
      store.dispatch(setTutorial(TUTORIAL));
    });

    // 1. lépés: nincs cél elem → középen, sötétítéssel
    expect(screen.getByText('Első')).toBeInTheDocument();
    expect(screen.getByText('1 / 2')).toBeInTheDocument();
    expect(document.querySelector('.tutorial-popover.is-center')).not.toBeNull();
    expect(document.querySelector('.tutorial-overlay')).not.toBeNull();
    expect(screen.queryByText('Vissza')).toBeNull();

    fireEvent.click(screen.getByText('Tovább'));

    // 2. lépés: cél elem mellett, kiemelés nélkül, másik oldalra navigál
    expect(screen.getByText('Második')).toBeInTheDocument();
    expect(navigate).toHaveBeenCalledWith('/other');
    expect(document.querySelector('.tutorial-overlay')).toBeNull();

    const popover = document.querySelector('.tutorial-popover') as HTMLElement;
    expect(popover.classList.contains('is-center')).toBe(false);
    // alatta: top + height + PADDING + ARROW + 6, nyíl a cél közepére
    expect(popover.style.top).toBe(`${50 + 40 + 6 + 8 + 6}px`);
    expect(popover.classList.contains('is-below')).toBe(true);
    expect(popover.style.getPropertyValue('--tutorial-arrow-x')).not.toBe('');

    fireEvent.click(screen.getByText('Vissza'));
    expect(screen.getByText('Első')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Tovább'));
    fireEvent.click(screen.getByText('Kész'));
    expect(document.querySelector('.tutorial')).toBeNull();
  });

  it('closes with Escape', () => {
    render(<Tutorial color="#c00" />);

    act(() => {
      store.dispatch(setTutorial(TUTORIAL));
    });

    expect(screen.getByText('Első')).toBeInTheDocument();
    expect((document.querySelector('.tutorial-popover') as HTMLElement).style.getPropertyValue('--tutorial-color')).toBe('#c00');

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(document.querySelector('.tutorial')).toBeNull();
  });
});
