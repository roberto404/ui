import React, { useCallback, useRef } from 'react';
import { createRoot, Root } from 'react-dom/client';
import printWindow from '@1studio/utils/window/print';

type PrintCallback = () => void;

type PrintableElement = React.ReactElement<{
  onReady?: () => void;
}>;

type OptionsTypes = {
  callback?: PrintCallback,
  printer?: (container: HTMLDivElement, callback: PrintCallback) => void,
  useOnReady?: void,
}

const usePrint = () => {

  const rootRef = useRef<Root | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const cleanup = () => {
    rootRef.current?.unmount();
    rootRef.current = null;

    if (containerRef.current) {
      document.body.removeChild(containerRef.current);
      containerRef.current = null;
    }
  };

  const print = useCallback(
    (
      element: PrintableElement,
      options?: OptionsTypes,
    ) => {

      const {
        callback,
        printer = printWindow,
        useOnReady = true,
      } = options || {};


      return new Promise<void>((resolve) => {

        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '-100000px';
        container.style.left = '0';
        container.style.width = '0';
        container.style.height = '0';
        container.style.overflow = 'hidden';

        document.body.appendChild(container);

        containerRef.current = container;

        const root = createRoot(container);
        rootRef.current = root;

        const onReady = () => {
          printer(
            container,
            () => {
              cleanup();
              callback?.();
              resolve();
            },
          );
        };

        root.render(
          React.cloneElement(element, {
            onReady,
          })
        );

        if (!useOnReady) {

          // Wait one tick to ensure DOM is painted
          requestAnimationFrame(() => {
            onReady()
          });
        }

      });
    },
    []
  );

  return print;
};

export default usePrint;
