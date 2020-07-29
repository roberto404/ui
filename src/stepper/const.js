
import StepNumeric from './stepNumeric';
import StepTimeline from './stepTimeline';


export const ICON_WIDTH = 24;
export const ICON_HEIGHT = 24;
export const ICON_PADDING = 7;
export const ICON_ABS_WIDTH = ICON_PADDING + ICON_WIDTH + ICON_PADDING;
export const LINE_WIDTH = 40;
export const CANVAS_PADDING_X = LINE_WIDTH / 2 - ICON_PADDING;
export const TEXT_PADDING_BOTTOM = 5;
export const TEXT_BOTTOM = 40;


export const STEP_TYPES = {
  'numberic': StepNumeric,
  'timeline': StepTimeline,
};
