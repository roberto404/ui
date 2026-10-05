import React from 'react';
import { Provider } from 'react-redux';
import { render, screen, fireEvent, act } from '@testing-library/react';

import storeWrapper from '@1studio/ui/store';
import { AppContext } from '@1studio/ui/context';
import { Status } from '@1studio/ui/apiType';
import TutorialButton from '@1studio/ui/tutorial/button';

const TUTORIAL = {
  id: 3,
  status: 1,
  title: 'Teszt',
  steps: [{ title: 'Első', description: '', dom: '', media: [], url: '', highlight: true }],
};

const setup = (ui: React.ReactElement) => {
  const store = storeWrapper();
  let resolve: (value: any) => void = () => { };
  const api = jest.fn(() => new Promise((r) => { resolve = r; }));

  render(
    <Provider store={store}>
      <AppContext.Provider value={{ store, api }}>{ui}</AppContext.Provider>
    </Provider>,
  );

  return { store, api, respond: (value: any) => act(async () => resolve(value)) };
};

describe('tutorial/TutorialButton', () => {
  beforeEach(() => localStorage.removeItem('tutorialSeen'));

  it('shows the default preloader while loading, then starts', async () => {
    const { store, api, respond } = setup(<TutorialButton id={3} />);

    fireEvent.click(screen.getByText('Súgó'));

    expect(api).toHaveBeenCalledWith({ url: 'tutorial/readOneToWebsite/3' });
    expect(document.querySelector('.tutorial-button .preloader')).not.toBeNull();
    expect(screen.getByRole('button')).toBeDisabled();

    await respond({ status: Status.SUCCESS, records: TUTORIAL });

    expect(screen.getByText('Súgó')).toBeInTheDocument();
    expect(store.getState().tutorial.active).toBe(true);
  });

  it('custom children and loading', async () => {
    const { store, respond } = setup(
      <TutorialButton id={3} loading="Betöltés...">Hogyan működik?</TutorialButton>,
    );

    fireEvent.click(screen.getByText('Hogyan működik?'));
    expect(screen.getByText('Betöltés...')).toBeInTheDocument();

    await respond({ status: Status.ERROR, records: null });

    expect(screen.getByText('Hogyan működik?')).toBeInTheDocument();
    expect(store.getState().tutorial.active).toBe(false);
  });
});
