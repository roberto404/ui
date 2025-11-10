import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

import Item from './item';
import IconCheckmark from '../icon/mui/alert/error';
import IconCheckmark2 from '../icon/mui/action/zoom_out';
import ItemProgress from "./itemProgress";

interface Toast {
  id: number;
  title: string;
  color: 'blue' | 'yellow' | 'red';
  Icon: React.FC;
}

const data = [
  {
    color: 'blue',
    Icon: IconCheckmark,
  },
  {
    color: 'yellow',
    Icon: IconCheckmark2,
  },
  {
    color: 'red',
    Icon: IconCheckmark2,
    buttons: [
      {
        title: 'Ignore',
      }
    ]
  }
];

const AUTO_DISMISS = 5000;

export const App: React.FC = () => {

  const [toasts, setToasts] = useState<Toast[]>([]);
  const idCounter = React.useRef(0);


  const addToastWithData = () => {

    const id = ++idCounter.current;

    const newToast: Toast = {
      id,
      // text: 'hello',
      // color: 'none',
      // Icon: IconAnimatedCheckmark,
      children: (
        <ItemProgress
          title={{
            49: 'Loading data...',
            99: 'Loading second half data...',
            100: 'Success',
          }}
          onClose={() => removeById(id)}
          caption="1.2Gb • About 2 seconds left."
        />
      ),
    };
    setToasts((prev) => [newToast, ...prev]);
  }

  const addToast = () => {
    const id = ++idCounter.current;
    const randomIndex = Math.floor(Math.random() * data.length);

    const newToast: Toast = {
      id,
      ...data[randomIndex],
    };
    setToasts((prev) => [newToast, ...prev]);
    setTimeout(() => removeById(id), AUTO_DISMISS);
  };

  const removeById = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const removeToast = () => {
    setToasts((prev) => prev.slice(1));
  };

  const removeAll = () => {
    setToasts([]);
  };

  return (
    <div>
      <div className="gap-1 m-2 flex">
        <button onClick={addToast}>Add</button>
        <button onClick={removeToast}>Remove</button>
        <button onClick={removeAll}>Remove All</button>
      </div>
      <div className="gap-1 m-2 flex">
        <button onClick={addToastWithData}>Add Progress</button>
      </div>

      <div className="pin-t pin-r mt-2 mr-2 column gap-1" style={{ width: 380 }}>
        <AnimatePresence initial={false}>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: -30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              <Item
                onClose={() => removeById(toast.id)}
                {...toast}
              />
              <motion.div
                // className="progress"
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: AUTO_DISMISS / 1000, ease: "linear" }}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default App;
