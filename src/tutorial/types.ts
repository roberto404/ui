export type TutorialMedia = {
  id: number,
  ext: string,
};

export type TutorialStep = {
  title: string,
  description: string,
  /** data-tutorial kulcs vagy CSS selector, üres = középre igazított lépés */
  dom: string,
  media: TutorialMedia[],
  /** az oldal útvonala, ahol a lépés megjelenik (végén * = prefix), üres = bárhol */
  url: string,
  /** sötétített háttér + kivágás a cél elem körül */
  highlight: boolean,
};

export type Tutorial = {
  id: number,
  /** 0 = inaktív, 1 = csak CTA, 2 = automatikusan is */
  status: 0 | 1 | 2,
  title: string,
  steps: TutorialStep[],
};

export type TutorialStateType = {
  active: boolean,
  tutorial: Tutorial | null,
  index: number,
};
