import React from 'react';
import { AnimatePresence, motion } from 'motion/react';


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
    className?: string,
    style?: React.CSSProperties,
  };


/**
 * Animálva nyíló-csukódó tartály.
 *
 * A méret (magasság vagy szélesség) folyamatosan változik, így a mellette
 * vagy alatta lévő tartalom is folyamatosan igazodik hozzá.
 * Csukott állapotban a gyerekek nincsenek a DOM-ban.
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
 */
const Collapse = ({
  open,
  children,
  axis = 'height',
  size = 'auto',
  duration = 0.35,
  fade = true,
  transition,
  className,
  style,
}: PropTypes) =>
{
  const collapsed = { [axis]: 0, opacity: fade ? 0 : 1 };

  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          key="collapse"
          className={className}
          style={{ overflow: 'hidden', ...style }}
          initial={collapsed}
          animate={{ [axis]: size, opacity: 1 }}
          exit={collapsed}
          transition={transition || { duration, ease: [0.4, 0, 0.2, 1] }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Collapse;
