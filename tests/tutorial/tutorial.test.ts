import reducers, { getTutorialStep } from '@1studio/ui/tutorial/reducers';
import {
  setTutorial,
  setTutorialStep,
  nextTutorialStep,
  prevTutorialStep,
  closeTutorial,
} from '@1studio/ui/tutorial/actions';
import {
  getSelector,
  findTarget,
  matchUrl,
  isTutorialSeen,
  setTutorialSeen,
} from '@1studio/ui/tutorial/utils';
import { extendPositions, getDynamicPopoverStyle } from '@1studio/ui/layer/position';

const step = (title: string) => ({ title, description: '', dom: '', media: [], url: '', highlight: true });

const TUTORIAL = {
  id: 1,
  status: 2 as const,
  title: 'Teszt',
  steps: [step('a'), step('b'), step('c')],
};

describe('tutorial/reducers', () => {
  it('starts only with steps', () => {
    const state = reducers(undefined, {});

    expect(reducers(state, setTutorial({ ...TUTORIAL, steps: [] }))).toBe(state);
    expect(reducers(state, setTutorial(TUTORIAL, 1))).toEqual({ active: true, tutorial: TUTORIAL, index: 1 });
  });

  it('clamps the index', () => {
    const state = reducers(undefined, setTutorial(TUTORIAL, 99));
    expect(state.index).toBe(2);
    expect(reducers(state, setTutorialStep(-5)).index).toBe(0);
  });

  it('next closes on the last step, prev stops at the first', () => {
    let state = reducers(undefined, setTutorial(TUTORIAL));

    state = reducers(state, prevTutorialStep());
    expect(state.index).toBe(0);

    state = reducers(state, nextTutorialStep());
    state = reducers(state, nextTutorialStep());
    expect(getTutorialStep({ tutorial: state })?.title).toBe('c');

    state = reducers(state, nextTutorialStep());
    expect(state.active).toBe(false);
    expect(getTutorialStep({ tutorial: state })).toBeNull();
  });

  it('close', () => {
    const state = reducers(reducers(undefined, setTutorial(TUTORIAL)), closeTutorial());
    expect(state.active).toBe(false);
  });
});

describe('tutorial/utils', () => {
  it('getSelector', () => {
    expect(getSelector('')).toBe('');
    expect(getSelector('order.filter')).toBe('[data-tutorial="order.filter"]');
    expect(getSelector('.foo')).toBe('.foo');
    expect(getSelector('#bar')).toBe('#bar');
    expect(getSelector('header button')).toBe('header button');
  });

  it('matchUrl', () => {
    expect(matchUrl('', '/x')).toBe(true);
    expect(matchUrl('/order', '/order/')).toBe(true);
    expect(matchUrl('/order', '/order?id=1')).toBe(true);
    expect(matchUrl('/order', '/order/5')).toBe(false);
    expect(matchUrl('/order/*', '/order/5')).toBe(true);
    expect(matchUrl('/order/*', '/order')).toBe(true);
    expect(matchUrl('/order/*', '/orders')).toBe(false);
    expect(matchUrl('https://www.rs.hu/kanape', '/kanape')).toBe(true);
  });

  it('findTarget returns the first visible element', () => {
    document.body.innerHTML = `
      <div data-tutorial="menu" id="desktop"></div>
      <div data-tutorial="menu" id="mobile"></div>
    `;

    const size = (width: number) => ({ width, height: width, top: 0, left: 0, right: width, bottom: width, x: 0, y: 0, toJSON: () => { } });

    document.getElementById('desktop').getBoundingClientRect = () => size(0) as DOMRect;
    document.getElementById('mobile').getBoundingClientRect = () => size(10) as DOMRect;

    expect(findTarget('menu')?.id).toBe('mobile');
    expect(findTarget('missing')).toBeNull();
    expect(findTarget('[[invalid')).toBeNull();
  });

  it('seen storage', () => {
    localStorage.clear();
    expect(isTutorialSeen(3)).toBe(false);
    setTutorialSeen(3);
    setTutorialSeen(3);
    expect(isTutorialSeen(3)).toBe(true);
    expect(JSON.parse(localStorage.getItem('tutorialSeen'))).toEqual([3]);
  });
});

describe('layer/position', () => {
  it('fixed positions ignore the page scroll', () => {
    window.pageYOffset = 500;

    const fixed = extendPositions({ left: 10, top: 20, width: 100, height: 50 }, true);
    const absolute = extendPositions({ left: 10, top: 20, width: 100, height: 50 });

    expect(fixed.top).toBe(20);
    expect(absolute.top).toBe(520);
    expect(fixed.screen.y).toBe(absolute.screen.y);

    window.pageYOffset = 0;
  });

  it('popover opens inwards from the screen edges', () => {
    const topLeft = getDynamicPopoverStyle(extendPositions({ left: 0, top: 0, width: 100, height: 50 }, true));
    expect(topLeft).toEqual({ left: 0, top: '56px', transform: '' });

    const bottomRight = getDynamicPopoverStyle(extendPositions({
      left: window.innerWidth - 100,
      top: window.innerHeight - 50,
      width: 100,
      height: 50,
    }, true));

    expect(bottomRight.left).toBe(window.innerWidth);
    expect(bottomRight.transform).toBe('translateX(-100%) translateY(-100%)');
  });
});
