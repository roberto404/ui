/**
 * Popover / tutorial pozicionálás egy elem befoglaló téglalapja alapján.
 */

export type Positions = {
  left: number,
  top: number,
  width: number,
  height: number,
  center: { x: number, y: number },
  /** az elem bal-felső sarka a viewporthoz képest (0..1) */
  screen: { x: number, y: number },
};

/**
 * @param rect getBoundingClientRect() (viewport koordináták)
 * @param fixed true = viewport koordináták (position: fixed), false = dokumentum koordináták (position: absolute)
 */
export const extendPositions = (
  { left, top, width, height }: { left: number, top: number, width: number, height: number },
  fixed = false,
): Positions => {
  const offsetX = fixed ? 0 : window.pageXOffset;
  const offsetY = fixed ? 0 : window.pageYOffset;

  const positions = { width, height, center: {}, screen: {} } as Positions;

  positions.left = left + offsetX;
  positions.top = top + offsetY;
  positions.center.x = positions.left + (positions.width / 2);
  positions.center.y = positions.top + (positions.height / 2);
  positions.screen.x = (positions.left - offsetX) / window.innerWidth;
  positions.screen.y = (positions.top - offsetY) / window.innerHeight;

  return positions;
};

export const getPositionsElement = (target?: Element | null, fixed = false): Positions | {} => {
  if (!target) {
    return {};
  }

  const rect = target.getBoundingClientRect();
  return extendPositions(rect, fixed);
};

/**
 * A képernyő melyik részén van az elem → onnan nyílik befelé a popover
 * (bal harmad: balra igazít, jobb harmad: jobbra, alsó 40%: fölé kerül).
 */
export const getDynamicPopoverStyle = (position: Positions) => {
  const style: { left?: number | string, top?: number | string, transform?: string } = {};
  const { screen, left, top, center, width, height } = position;

  if (screen.x < 0.3) {
    style.left = left;
    style.transform = '';
  }
  else if (screen.x > 0.7) {
    style.left = left + width;
    style.transform = 'translateX(-100%)';
  }
  else {
    style.left = `${center.x}px`;
    style.transform = 'translateX(-50%)';
  }

  if (screen.y > 0.6) {
    style.top = `${top - 6}px`;
    style.transform += ' translateY(-100%)';
  }
  else {
    style.top = `${top + height + 6}px`;
  }

  return style;
};
