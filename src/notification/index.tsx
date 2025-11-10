import React, { Suspense, useMemo, useState } from "react";
import { useSelector, useStore } from "react-redux";
import { motion, AnimatePresence } from "motion/react";


/* !-- Actions */


/* !-- Components */

import Item from './item';
import IconCheckmark from '../icon/mui/alert/error';



/* !-- Globals */

const importCache = new Map();
const componentResolvers = new Map<string, () => Promise<any>>();

/**
 * @example
 * addComponentResolver('notificationCustom', () => import('@/views/notificationCustom.tsx'))
 */
export const addComponentResolver = (key: string, importer: () => Promise<any>) => {
  componentResolvers.set(key, importer);
};


/* !-- LazyItem */

const LazyItem = (item) => {

  const LazyComponent = useMemo(() => {

    // 1️⃣ resolverből próbál betölteni
    if (item.componentKey && componentResolvers.has(item.componentKey)) {
      const resolver = componentResolvers.get(item.componentKey);
      if (!importCache.has(item.componentKey)) {
        importCache.set(item.componentKey, React.lazy(resolver));
      }
      return importCache.get(item.componentKey);
    }

    // 2️⃣ ha nincs resolver, de van componentPath
    if (item.componentPath) {
      if (!importCache.has(item.componentPath)) {
        importCache.set(
          item.componentPath,
          React.lazy(() => import(/* @vite-ignore */ `${item.componentPath}`))
        );
      }
      return importCache.get(item.componentPath);
    }

    // 3️⃣ fallback
    return null;

  }, [item.componentKey, item.componentPath]);

  const Content = LazyComponent || Item;

  return (
    <Suspense fallback={<div className="p-4">Betöltés...</div>}>
      <Content {...item} />
    </Suspense>
  );
};




/* !-- Constants */

import { AUTO_DISMISS } from './const';
import classNames from "classnames";


/* !-- Types */

type PropTypes = {

};



/**
*
*/
const Notification = ({ }: PropTypes) => {

  const items = useSelector(({ notification }) => notification?.items || []);
  const store = useStore();

  const { layer } = store.getState();

  return (
    <div
      className={classNames({
        "pin-t pin-r m-8 mr-2 column gap-1": true,
        "mt-2": layer.active && layer.method === 'dialog',
      })}
      style={{ width: 380, zIndex: 1000000 }}
    >
      <AnimatePresence initial={false}>
        {items.map((item) => {

          return (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: -30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >

              <LazyItem {...item} />

              <motion.div
                // className="progress"
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: AUTO_DISMISS / 1000, ease: "linear" }}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

export default Notification;