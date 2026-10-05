/**
 * @fileOverview Redux Tutorial Actions
 * @namespace Actions/Tutorial
 */

import { Tutorial } from './types';


/**
 * Tutorial indítása a megadott lépéstől (betöltött adatból).
 * Betöltéssel együtt: useStartTutorial() (hooks).
 *
 * @example
 * dispatch(setTutorial({ id: 1, title: 'Rendelés', steps: [...] }));
 */
export const setTutorial = (tutorial: Tutorial, index = 0) =>
({
  type: 'SET_TUTORIAL',
  tutorial,
  index,
});

export const setTutorialStep = (index: number) =>
({
  type: 'SET_TUTORIAL_STEP',
  index,
});

/**
 * Az utolsó lépésen bezárja a tutorialt.
 */
export const nextTutorialStep = () =>
({
  type: 'NEXT_TUTORIAL_STEP',
});

export const prevTutorialStep = () =>
({
  type: 'PREV_TUTORIAL_STEP',
});

export const closeTutorial = () =>
({
  type: 'CLOSE_TUTORIAL',
});
