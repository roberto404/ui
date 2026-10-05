'use client';

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import classNames from 'classnames';
import { useAppContext } from '../context';
import { File } from '../form/file';

/* !- Actions */

import { closeTutorial, nextTutorialStep, prevTutorialStep } from './actions';

/* !- React Elements */

import IconClose from '../icon/mui/navigation/close';

/* !- Constants */

import { extendPositions, getDynamicPopoverStyle } from '../layer/position';
import { getTutorial } from './reducers';
import { findTarget, matchUrl } from './utils';

/* !- Types */

import { TutorialMedia, TutorialStateType } from './types';


/** térköz a kiemelt elem körül (px) */
const PADDING = 6;
/** a buborék nyilának magassága (px), ennyivel távolabb kerül a buborék */
const ARROW = 8;
/** a nyíl legalább ennyire marad a buborék sarkától (lekerekítés) */
const ARROW_EDGE = 24;
const RADIUS = 6;
/** ennyi ideig várunk a cél elemre (lassan töltő oldal, navigáció után) */
const WAIT_FOR_TARGET = 3000;
/** a buborék legalább ennyire marad a képernyő szélétől */
const VIEWPORT_MARGIN = 8;
const VIDEO_EXTS = ['mp4', 'webm', 'mov', 'ogg'];
const SHORTCUTS = 'tutorial';

// SSR (website2): a szerveren nincs layout, ott useEffect (nincs figyelmeztetés)
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

type Rect = { left: number, top: number, width: number, height: number };

/**
 * Teljes képernyős sötétítés, a cél elem helyén lekerekített kivágással (evenodd)
 */
const getOverlayPath = (hole: Rect | null) => {
  const outer = 'M-10 -10 H100000 V100000 H-10 Z';

  if (!hole) {
    return outer;
  }

  const { left: x, top: y, width: w, height: h } = hole;
  const r = Math.min(RADIUS, w / 2, h / 2);

  return `${outer} M${x + r} ${y} H${x + w - r} A${r} ${r} 0 0 1 ${x + w} ${y + r} V${y + h - r} A${r} ${r} 0 0 1 ${x + w - r} ${y + h} H${x + r} A${r} ${r} 0 0 1 ${x} ${y + h - r} V${y + r} A${r} ${r} 0 0 1 ${x + r} ${y} Z`;
};

const Media = ({ media, mediaUrl }: { media: TutorialMedia, mediaUrl: string }) => {
  const src = mediaUrl + new File(media).getUrl('', 0);

  if (VIDEO_EXTS.includes((media.ext || '').toLowerCase())) {
    return <video className="tutorial-media" src={src} autoPlay muted loop playsInline controls />;
  }

  return <img className="tutorial-media" src={src} alt="" />;
};


type PropTypes = {
  /**
   * Router navigáció, ha a lépés másik oldalon van (`url`).
   * Nélküle a lépés az aktuális oldalon jelenik meg.
   */
  navigate?: (url: string) => void,
  /** a /library/ fájlok host-ja, ha nem ugyanarról a domainről jönnek (website2) */
  mediaUrl?: string,
  /** buborék háttérszíne (alapból a --tutorial-color CSS változó) */
  color?: string,
  /** buborék szövegszíne (alapból fehér) */
  textColor?: string,
  className?: string,
};

/**
 * Tutorial lejátszó: egyszer kell az apphoz csatolni (a <Layer /> mellé),
 * a redux `tutorial` state alapján jelenik meg.
 *
 * @example
 * <Tutorial navigate={url => history.push(url)} />
 */
const Tutorial = ({ navigate, mediaUrl = '', color, textColor, className }: PropTypes) => {
  const dispatch = useDispatch();
  const { addShortcuts, removeShortcuts } = (useAppContext() || {}) as {
    addShortcuts?: (shortcuts: { keyCode: string, handler: () => void, description?: string }[], collection?: string) => void,
    removeShortcuts?: (collection: string) => void,
  };

  const { active, tutorial, index } = useSelector(getTutorial, shallowEqual) as TutorialStateType;
  const step = active && tutorial ? tutorial.steps[index] : null;
  const total = tutorial?.steps.length || 0;

  const [target, setTarget] = useState<Element | null>(null);
  const [searching, setSearching] = useState(false);
  const [rect, setRect] = useState<Rect | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  /**
   * Lépésváltás: navigáció (ha kell), majd a cél elem keresése
   */
  useEffect(() => {
    if (!step) {
      setTarget(null);
      return;
    }

    const url = (step.url || '').trim();

    if (url && !url.endsWith('*') && navigate && !matchUrl(url, window.location.pathname)) {
      navigate(url);
    }

    const element = findTarget(step.dom);

    if (element || !step.dom) {
      setTarget(element);
      setSearching(false);
      return;
    }

    setTarget(null);
    setSearching(true);

    let timer: ReturnType<typeof setTimeout>;

    const observer = new MutationObserver(() => {
      const found = findTarget(step.dom);

      if (found) {
        done(found);
      }
    });

    const done = (found: Element | null) => {
      observer.disconnect();
      clearTimeout(timer);
      setTarget(found);
      setSearching(false);
    };

    // nem került elő → középre igazított lépés
    timer = setTimeout(() => done(null), WAIT_FOR_TARGET);

    observer.observe(document.body, { childList: true, subtree: true, attributes: true });

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [step]);

  /**
   * A cél elem látótérbe görgetése és pozíciójának követése
   */
  useEffect(() => {
    if (!target) {
      setRect(null);
      return;
    }

    const measure = () => {
      const { left, top, width, height } = target.getBoundingClientRect();
      setRect({ left, top, width, height });
    };

    const { top, bottom } = target.getBoundingClientRect();

    if (top < 0 || bottom > window.innerHeight) {
      target.scrollIntoView({ block: 'center', inline: 'nearest', behavior: 'smooth' });
    }

    let frame = 0;

    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };

    measure();

    window.addEventListener('resize', update);
    // capture: a belső görgethető konténerek (pl. kontakt2 tartalom) scroll eseménye is
    window.addEventListener('scroll', update, true);

    const resizeObserver = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(update) : null;
    resizeObserver?.observe(target);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
      resizeObserver?.disconnect();
    };
  }, [target]);

  /**
   * Billentyűk: Esc bezár, nyilak lapoznak
   */
  useEffect(() => {
    if (!active || !addShortcuts) {
      return;
    }

    addShortcuts(
      [
        { keyCode: 'Escape', handler: () => dispatch(closeTutorial()), description: 'Close tutorial' },
        { keyCode: 'ArrowRight', handler: () => dispatch(nextTutorialStep()), description: 'Next tutorial step' },
        { keyCode: 'ArrowLeft', handler: () => dispatch(prevTutorialStep()), description: 'Previous tutorial step' },
      ],
      SHORTCUTS,
    );

    return () => removeShortcuts?.(SHORTCUTS);
  }, [active]);

  /**
   * A buborék ne lógjon ki a képernyőből (keskeny kijelzőn a getDynamicPopoverStyle igazítása nem elég),
   * a nyíl pedig a cél elem közepére mutasson
   */
  useIsomorphicLayoutEffect(() => {
    const element = popoverRef.current;

    if (!element) {
      return;
    }

    element.style.marginLeft = '0px';
    element.style.marginTop = '0px';

    const { left, right, top, bottom } = element.getBoundingClientRect();

    const shift = (start: number, end: number, size: number) => {
      if (start < VIEWPORT_MARGIN) {
        return VIEWPORT_MARGIN - start;
      }

      if (end > size - VIEWPORT_MARGIN) {
        return Math.max(VIEWPORT_MARGIN - start, size - VIEWPORT_MARGIN - end);
      }

      return 0;
    };

    const marginLeft = shift(left, right, window.innerWidth);

    element.style.marginLeft = `${marginLeft}px`;
    element.style.marginTop = `${shift(top, bottom, window.innerHeight)}px`;

    if (rect) {
      const width = right - left;
      const x = (rect.left + (rect.width / 2)) - (left + marginLeft);

      element.style.setProperty('--tutorial-arrow-x', `${Math.min(Math.max(x, ARROW_EDGE), width - ARROW_EDGE)}px`);
    }
  });

  if (!step || searching || typeof document === 'undefined') {
    return null;
  }

  const hole = rect && target ? {
    left: rect.left - PADDING,
    top: rect.top - PADDING,
    width: rect.width + (PADDING * 2),
    height: rect.height + (PADDING * 2),
  } : null;

  // a nyíl helye miatt a buborék a kiemelésnél ARROW-val távolabb kerül
  const position = hole ? getDynamicPopoverStyle(extendPositions({
    left: hole.left,
    top: hole.top - ARROW,
    width: hole.width,
    height: hole.height + (ARROW * 2),
  }, true)) : undefined;

  const isAbove = !!position?.transform?.includes('translateY(-100%)');

  const style = {
    ...position,
    ...(color ? { '--tutorial-color': color } : {}),
    ...(textColor ? { '--tutorial-text-color': textColor } : {}),
  } as React.CSSProperties;

  const isLast = index >= total - 1;
  const media = step.media?.[0];

  const onClickOverlayHandler = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  return createPortal(
    <div className={classNames('tutorial', className)}>
      {step.highlight && (
        <svg className="tutorial-overlay" onClick={onClickOverlayHandler}>
          <path fillRule="evenodd" d={getOverlayPath(hole)} />
        </svg>
      )}

      <div
        ref={popoverRef}
        key={index}
        className={classNames('tutorial-popover', {
          'is-center': !hole,
          'is-above': hole && isAbove,
          'is-below': hole && !isAbove,
        })}
        style={style}
      >
        <div className="flex h-center v-justify mb-1">
          {total > 1 ? (
            <div className="tutorial-badge">{`${index + 1} / ${total}`}</div>
          ) : <div />}
          <button
            className="initial tutorial-close pointer"
            title="Bezárás"
            onClick={() => dispatch(closeTutorial())}
          >
            <IconClose />
          </button>
        </div>

        {media && <Media media={media} mediaUrl={mediaUrl} />}

        {step.title && <div className="tutorial-title">{step.title}</div>}

        {step.description && <div className="tutorial-description">{step.description}</div>}

        {total > 1 && (
          <div className="flex h-center v-justify mt-2">
            {index > 0 ? (
              <button className="initial tutorial-action" onClick={() => dispatch(prevTutorialStep())}>
                Vissza
              </button>
            ) : <div />}

            <button className="initial tutorial-action is-primary" onClick={() => dispatch(nextTutorialStep())}>
              {isLast ? 'Kész' : 'Tovább'}
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
};

export default Tutorial;
