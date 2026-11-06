import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import classNames from 'classnames';

/* !- Actions */

import { menu, close } from '../layer/actions';

/* !- Components */

import IconMore from '../icon/mui/navigation/more_horiz';
import IconExpand from '../icon/mui/navigation/expand_more';


/* !- Types */

type PropTypes = {
  children?: React.ReactNode,
  className?: string,
  style?: React.CSSProperties,
  /**
   * Az első n elem soha nem kerül a Több menübe (pl. darabszám összesítő)
   */
  pinned?: number,
  /**
   * A jobb oldali határ eleme (alapból a szülőben lévő `.filters` sor).
   * Ha nincs ilyen, a szülő jobb szélétől `rightOffset` távolság a határ.
   */
  boundarySelector?: string,
  /**
   * Határ a szülő jobb szélétől, ha nincs boundary elem (rem)
   */
  rightOffset?: number,
  /**
   * Térköz a határ előtt (rem)
   */
  gap?: number,
  moreLabel?: string,
};


/* !- Constants */

const getRem = () =>
  parseFloat(getComputedStyle(document.documentElement).fontSize) || 10;

/**
 * Pinned: a Toolbar ezt az elemet soha nem teszi a Több menübe
 * @example
 * <Toolbar>
 *   <ToolbarPinned><Summaries /></ToolbarPinned>
 * </Toolbar>
 */
export const ToolbarPinned = ({ children }: { children: React.ReactNode }) => <>{children}</>;

/**
 * Flatten fragments: a `<>…</>` gyerekei külön elemek
 */
const flattenChildren = (children: React.ReactNode): React.ReactElement[] =>
  React.Children.toArray(children).reduce((result: React.ReactElement[], child) => {
    if (React.isValidElement(child) && child.type === React.Fragment) {
      return [...result, ...flattenChildren(child.props.children)];
    }

    return React.isValidElement(child) ? [...result, child] : result;
  }, []);

/**
 * The small label under the icon (the count badge is absolute)
 */
const LABEL_SELECTOR = '[data-toolbar-title], .text-xs:not(.absolute)';

/**
 * Menu row title: `data-toolbar-title` > the small label > whole text
 */
const getItemTitle = (element: HTMLElement): string => {
  const custom = element.querySelector('[data-toolbar-title]');

  if (custom) {
    return custom.getAttribute('data-toolbar-title') || custom.textContent || '';
  }

  const labels = element.querySelectorAll(LABEL_SELECTOR);
  const label = labels.length ? labels[labels.length - 1] : element;

  return (label.textContent || '').trim();
};

/**
 * Buttons of a toolbar item: a group (ex. view buttons in one component)
 * is split until each part has max one label / icon
 */
const getItemButtons = (element: Element): HTMLElement[] => {
  const labels = element.querySelectorAll(LABEL_SELECTOR).length;
  // without labels (ex. ViewButtons: icon + span) the icons count
  const isGroup = labels > 1 || (!labels && element.querySelectorAll('svg').length > 1);

  if (isGroup && element.children.length) {
    return Array.from(element.children).flatMap(getItemButtons);
  }

  return element.querySelector('svg') || getItemTitle(element as HTMLElement)
    ? [element as HTMLElement]
    : [];
};

/**
 * Click the toolbar button: the event bubbles from the icon to the handler
 * (the handler may be on any ancestor, ex. Tooltip, ViewButton)
 */
const clickItem = (element: HTMLElement) => {
  const target = element.querySelector('[data-toolbar-click], button, a[href], [role="button"]')
    || element.querySelector('svg')?.parentElement
    || element;

  target.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
};

/**
 * Menu icon: the clone of the button svg
 */
const SvgClone = ({ node }: { node: Element }) => {
  const ref = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    if (ref.current) {
      ref.current.replaceChildren(node.cloneNode(true));
    }
  }, [node]);

  return <span ref={ref} className="toolbar-menu-icon" />;
};


/**
 * Toolbar: a bal oldali gombsor kitölti a helyet a jobb oldali szűrőkig (`.filters`),
 * ami nem fér ki, az a „Több” menübe kerül.
 *
 * A kilógó elemek mountolva maradnak (állapot, ref, saját layer megmarad), csak
 * láthatatlanok a Több gomb alatt; a menüpont az eredeti gomb kattintását váltja ki.
 *
 * @example
 * <Toolbar className="bg-white absolute pin-l pin-t h-center no-select" style={{ height: '6rem', left: '3rem' }}>
 *   <Summaries />
 *   <div className="text-center ml-2 border-left border-gray-light pl-2">…</div>
 * </Toolbar>
 */
const Toolbar = ({
  children,
  className,
  style,
  pinned = 1,
  boundarySelector = '.filters',
  rightOffset = 20,
  gap = 2,
  moreLabel = 'Több',
}: PropTypes) => {
  const dispatch = useDispatch();

  const ref = useRef<HTMLDivElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [hidden, setHidden] = useState<number[]>([]);

  const items = flattenChildren(children);

  const getBoundary = useCallback((): HTMLElement | null => {
    const parent = ref.current?.parentElement;

    if (!parent || !boundarySelector) {
      return null;
    }

    return Array
      .from(parent.querySelectorAll<HTMLElement>(boundarySelector))
      .find(element => !ref.current?.contains(element)) || null;
  }, [boundarySelector]);

  const calculate = useCallback(() => {
    const element = ref.current;
    const container = element?.offsetParent as HTMLElement | null;

    // hidden view (display: none)
    if (!element || !container || !container.clientWidth) {
      return;
    }

    const rem = getRem();
    const boundary = getBoundary();
    const left = element.getBoundingClientRect().left;

    const boundaryRect = boundary?.getBoundingClientRect();
    const limit = boundaryRect && boundaryRect.width
      ? boundaryRect.left
      : container.getBoundingClientRect().right - (rightOffset * rem);

    const available = Math.max(0, limit - left - (gap * rem));

    const widths = itemRefs.current
      .slice(0, items.length)
      .map(item => (item ? item.getBoundingClientRect().width : 0));

    const total = widths.reduce((sum, width) => sum + width, 0);

    let nextHidden: number[] = [];

    if (total > available) {
      const budget = available - (moreRef.current?.getBoundingClientRect().width || 0);
      let used = 0;
      let overflow = false;

      widths.forEach((width, index) => {
        if (!width) {
          return;
        }

        if (!overflow && (index < pinned || used + width <= budget)) {
          used += width;
        }
        else {
          overflow = true;
          nextHidden.push(index);
        }
      });
    }

    setHidden(prev => (prev.join() === nextHidden.join() ? prev : nextHidden));
  }, [items.length, pinned, rightOffset, gap, getBoundary]);

  useLayoutEffect(() => {
    calculate();
  });

  useLayoutEffect(() => {
    if (typeof ResizeObserver === 'undefined') {
      return undefined;
    }

    let frame = 0;
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(calculate);
    };

    const observer = new ResizeObserver(schedule);
    const container = ref.current?.offsetParent || ref.current?.parentElement;
    const boundary = getBoundary();

    if (container) observer.observe(container);
    if (boundary) observer.observe(boundary);
    itemRefs.current.forEach(item => item && observer.observe(item));

    window.addEventListener('resize', schedule);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('resize', schedule);
    };
  }, [calculate, getBoundary, items.length]);

  const onClickMoreHandler = (event: React.MouseEvent<HTMLElement>) => {
    const menuItems = hidden
      .flatMap(index => getItemButtons(itemRefs.current[index] || document.createElement('div'))
        .map((element, buttonIndex) => {
          const svg = element.querySelector('svg');

          return {
            id: `${index}-${buttonIndex}`,
            title: getItemTitle(element) || ' ',
            icon: svg ? () => <SvgClone node={svg} /> : false,
            className: classNames({
              disabled: element.matches('.disabled') || !!element.querySelector('.disabled'),
              // active view button
              active: element.matches('.active, .bg-blue-dark') || !!element.querySelector('.active, .bg-blue-dark'),
            }),
            handler: () => {
              dispatch(close());
              // after the menu closed: the button may open its own layer
              setTimeout(() => clickItem(element), 0);
            },
          };
        }));

    dispatch(menu({ items: menuItems, className: 'toolbar-menu' }, event));
  };

  return (
    <div
      ref={ref}
      className={classNames('toolbar-overflow', className)}
      style={style}
    >
      {items.map((child, index) => (
        <div
          key={child.key ?? index}
          ref={(item) => { itemRefs.current[index] = item; }}
          className={classNames('toolbar-item', {
            'toolbar-item-hidden': hidden.includes(index),
          })}
          aria-hidden={hidden.includes(index) || undefined}
        >
          {child}
        </div>
      ))}

      <div
        ref={moreRef}
        className={classNames('toolbar-item toolbar-more', {
          'toolbar-item-hidden': !hidden.length,
        })}
      >
        <div className="text-center ml-2 border-left border-gray-light pl-2">
          <div
            className="pointer hover:bg-gray-light rounded p-1/4 text-line-0 inline-block fill-gray-dark"
            onClick={onClickMoreHandler}
          >
            <IconMore className="w-2 h-2" />
          </div>
          <div className="pt-2/3 text-xs light text-gray flex h-center v-center nowrap">
            {moreLabel}
            <IconExpand className="toolbar-more-arrow fill-gray" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
