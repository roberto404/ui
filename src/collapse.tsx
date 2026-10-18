import React, { useContext, useEffect, useId, useRef, useState } from 'react';
import { ReactReduxContext } from 'react-redux';
import { AnimatePresence, motion } from 'motion/react';
import classNames from 'classnames';


/* !- Constants */

import { useAppContext } from './context';
import { getActive as getLayerActive } from './layer/reducers';


/* !- Types */

type PropTypes =
  {
    /**
     * Nyitott állapot
     */
    open: boolean,
    children?: React.ReactNode,
    /**
     * Melyik méret animálódik: fentről/lentről nyíló panel `height`,
     * oldalt megjelenő panel `width`
     */
    axis?: 'height' | 'width',
    /**
     * Nyitott méret. `auto` esetén a tartalom mérete, egyébként fix (pl. 240 vagy '20rem')
     */
    size?: number | string,
    /**
     * Animáció hossza másodpercben
     */
    duration?: number,
    /**
     * Mérettel együtt úsztassa be a tartalmat
     */
    fade?: boolean,
    /**
     * Egyedi motion transition, felülírja a `duration`-t
     * @example
     * { type: 'spring', stiffness: 400, damping: 40 }
     */
    transition?: Record<string, unknown>,
    /**
     * A szélénél fogva húzással átméretezhető: a szegélyre állva átvált a kurzor
     */
    draggable?: boolean,
    /**
     * A húzható szél: `start` = felső / bal (lentről / jobbról nyíló panel),
     * `end` = alsó / jobb (fentről / balról nyíló panel)
     */
    dragEdge?: 'start' | 'end',
    /**
     * Húzással elérhető legkisebb méret (px)
     */
    minSize?: number,
    /**
     * Billentyűparancs (az app `addShortcuts`-szal), pl. `Escape` vagy `CTRL+O`;
     * lenyomásra az `onShortcut` hívódik a következő állapottal (`!open`).
     * Nyitott layer (dialog, popover …) mellett nem fut: az ESC előbb azt zárja.
     */
    shortcut?: string,
    /**
     * A `shortcut` kezelője: a nyitás / zárás a hívó dolga (a `open` vezérelt)
     * @example
     * onShortcut={(next) => !next && setOpen(false)} // csak zár
     */
    onShortcut?: (open: boolean) => void,
    className?: string,
    style?: React.CSSProperties,
  };


/* !- Constants */

// a szegély érzékeny sávja (px)
const DRAG_AREA = 12;


/**
 * Méretváltozás után a benne lévő listák (pl. Grid infinity → react-list)
 * újramérik a látható részt: azok az ablak `resize` eseményére figyelnek
 */
const notifyResize = () => window.dispatchEvent(new Event('resize'));


/**
 * Animálva nyíló-csukódó tartály.
 *
 * A méret (magasság vagy szélesség) folyamatosan változik, így a mellette
 * vagy alatta lévő tartalom is folyamatosan igazodik hozzá.
 * Csukott állapotban a gyerekek nincsenek a DOM-ban.
 *
 * Flex konténerben `flex: 0 0 auto`, tehát a nyitott méret pontosan a `size`
 * (vagy a tartalom) marad: a testvérek nem tudják összenyomni, és a maradék
 * helyre sem nyúlik meg. Felülírható a `style` proppal.
 *
 * Az animáció végén (és húzás közben) `resize` eseményt küld, így a benne lévő,
 * a látható részt mérő listák a végleges méretet kapják.
 *
 * @example
 * <Collapse open={isOpen}>
 *   <Stat />
 * </Collapse>
 *
 * @example oldalsó panel, fix szélességgel, rugós animációval
 * <Collapse
 *   open={isOpen}
 *   axis="width"
 *   size="20rem"
 *   transition={{ type: 'spring', stiffness: 400, damping: 40 }}
 * >
 *   <Filter />
 * </Collapse>
 *
 * @example lentről becsúszó, a felső szélénél húzható, ESC-re záródó panel
 * <Collapse
 *   open={isOpen}
 *   size="55%"
 *   draggable
 *   shortcut="Escape"
 *   onShortcut={(next) => !next && setOpen(false)}
 * >
 *   <Orders />
 * </Collapse>
 */
const Collapse = ({
  open,
  children,
  axis = 'height',
  size = 'auto',
  duration = 0.35,
  fade = true,
  transition,
  draggable = false,
  dragEdge = 'start',
  minSize = 40,
  shortcut,
  onShortcut,
  className,
  style,
}: PropTypes) =>
{
  const element = useRef<HTMLDivElement>(null);
  const drag = useRef<{ position: number, size: number, frame?: number } | null>(null);

  // a húzással beállított méret (px), a következő nyitáskor is megmarad
  const [dragSize, setDragSize] = useState<number | null>(null);
  const [dragging, setDragging] = useState(false);

  const { addShortcuts, removeShortcuts } = (useAppContext() || {}) as {
    addShortcuts?: (shortcuts: { keyCode: string, handler: () => void, description?: string }[], collection?: string) => void,
    removeShortcuts?: (collection: string) => void,
  };

  // Provider nélkül is használható (pl. story): ilyenkor nincs layer-ellenőrzés
  const redux = useContext(ReactReduxContext);
  const collection = `collapse-${useId()}`;

  // a kezelő mindig a friss `open` / `onShortcut` értéket látja
  const shortcutState = useRef({ open, onShortcut });
  shortcutState.current = { open, onShortcut };

  useEffect(() => {
    if (!shortcut || !addShortcuts) {
      return undefined;
    }

    addShortcuts(
      [
        {
          keyCode: shortcut,
          description: 'Panel nyitása / zárása',
          handler: () => {
            if (redux && getLayerActive(redux.store.getState())) {
              return;
            }

            shortcutState.current.onShortcut?.(!shortcutState.current.open);
          },
        },
      ],
      collection,
    );

    return () => removeShortcuts?.(collection);
  }, [shortcut, addShortcuts, removeShortcuts, collection]);

  const collapsed = { [axis]: 0, opacity: fade ? 0 : 1 };
  const isHeight = axis === 'height';

  const getPosition = (event: React.PointerEvent) => (isHeight ? event.clientY : event.clientX);

  const onPointerDownHandler = (event: React.PointerEvent<HTMLDivElement>) =>
  {
    if (!element.current) {
      return;
    }

    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);

    drag.current = {
      position: getPosition(event),
      size: element.current.getBoundingClientRect()[axis],
    };

    setDragging(true);
  };

  const onPointerMoveHandler = (event: React.PointerEvent<HTMLDivElement>) =>
  {
    if (!drag.current || !element.current) {
      return;
    }

    const delta = getPosition(event) - drag.current.position;
    const parent = element.current.parentElement;
    const maxSize = parent ? parent.getBoundingClientRect()[axis] : Infinity;

    const next = drag.current.size + (dragEdge === 'start' ? -delta : delta);

    setDragSize(Math.round(Math.min(Math.max(next, minSize), maxSize)));

    if (!drag.current.frame) {
      drag.current.frame = requestAnimationFrame(() => {
        if (drag.current) {
          drag.current.frame = undefined;
        }

        notifyResize();
      });
    }
  };

  const onPointerUpHandler = (event: React.PointerEvent<HTMLDivElement>) =>
  {
    if (!drag.current) {
      return;
    }

    event.currentTarget.releasePointerCapture(event.pointerId);

    if (drag.current.frame) {
      cancelAnimationFrame(drag.current.frame);
    }

    drag.current = null;
    setDragging(false);
    notifyResize();
  };

  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          key="collapse"
          ref={element}
          className={className}
          style={{
            overflow: 'hidden',
            // a méretet a `size` (vagy a tartalom) adja, nem a flex elrendezés:
            // a szülő flex konténer sem összenyomni, sem megnyújtani nem tudja
            flexGrow: 0,
            flexShrink: 0,
            ...(draggable ? { position: 'relative' } : {}),
            ...style,
          }}
          initial={collapsed}
          animate={{ [axis]: dragSize ?? size, opacity: 1 }}
          exit={collapsed}
          transition={dragging ? { duration: 0 } : transition || { duration, ease: [0.4, 0, 0.2, 1] }}
          onAnimationComplete={notifyResize}
        >
          {children}

          {draggable && (
            <div
              role="separator"
              aria-orientation={isHeight ? 'horizontal' : 'vertical'}
              className={classNames('absolute touch-none', {
                'cursor-ns-resize w-full': isHeight,
                'cursor-ew-resize h-full': !isHeight,
                'pin-t': isHeight && dragEdge === 'start',
                'pin-b': isHeight && dragEdge === 'end',
                'pin-l': !isHeight && dragEdge === 'start',
                'pin-r': !isHeight && dragEdge === 'end',
              })}
              style={isHeight ? { height: DRAG_AREA, left: 0 } : { width: DRAG_AREA, top: 0 }}
              onPointerDown={onPointerDownHandler}
              onPointerMove={onPointerMoveHandler}
              onPointerUp={onPointerUpHandler}
              onPointerCancel={onPointerUpHandler}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Collapse;
