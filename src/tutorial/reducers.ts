import { TutorialStateType } from './types';


const DEFAULT_STATE: TutorialStateType = {
  active: false,
  tutorial: null,
  index: 0,
};

const clampIndex = (index: number, length: number) =>
  Math.min(Math.max(0, +index || 0), Math.max(0, length - 1));

/**
 * Tutorial Redux Reducers
 */
const reducers = (state: TutorialStateType = DEFAULT_STATE, action: any = {}): TutorialStateType => {
  switch (action.type) {
    case 'SET_TUTORIAL':
      {
        const steps = action.tutorial?.steps || [];

        if (!steps.length) {
          return state;
        }

        return {
          active: true,
          tutorial: action.tutorial,
          index: clampIndex(action.index, steps.length),
        };
      }

    case 'SET_TUTORIAL_STEP':
      {
        if (!state.active || !state.tutorial) {
          return state;
        }

        return {
          ...state,
          index: clampIndex(action.index, state.tutorial.steps.length),
        };
      }

    case 'NEXT_TUTORIAL_STEP':
      {
        if (!state.active || !state.tutorial) {
          return state;
        }

        if (state.index >= state.tutorial.steps.length - 1) {
          return { ...state, active: false };
        }

        return { ...state, index: state.index + 1 };
      }

    case 'PREV_TUTORIAL_STEP':
      {
        if (!state.active) {
          return state;
        }

        return { ...state, index: Math.max(0, state.index - 1) };
      }

    case 'CLOSE_TUTORIAL':
      {
        if (!state.active) {
          return state;
        }

        return { ...state, active: false };
      }

    default:
      return state;
  }
};

export const getTutorial = ({ tutorial }: { tutorial: TutorialStateType }) => tutorial;

export const getTutorialStep = ({ tutorial }: { tutorial: TutorialStateType }) =>
  tutorial.active && tutorial.tutorial ? tutorial.tutorial.steps[tutorial.index] : null;

export default reducers;
