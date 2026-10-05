import Tutorial from './tutorial';
import TutorialButton from './button';
import TutorialAuto from './auto';

export { useStartTutorial, useAutoTutorial } from './hooks';
export { ATTRIBUTE, findTarget, matchUrl } from './utils';
export type { Tutorial as TutorialType, TutorialStep, TutorialMedia } from './types';

export {
  Tutorial,
  TutorialButton,
  TutorialAuto,
};

export default Tutorial;
