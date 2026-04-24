import React, { useCallback, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { useDispatch } from "react-redux";
import { useAppContext } from '../../../context';
import { unsetValues } from '../../../form/actions';


/* !- Actions */


/* !- Components */

import IconClose from '@1studio/shared/icons/close';


/* !- Constants */


/**
 * 
 * @returns { LayerHandler }
 */
export function useLayerHandler() {

  const dispatch = useDispatch();

  const container = document.body;

  const [content, setContent] = useState(null);

  const { addShortcuts, removeShortcuts } = useAppContext();

  useEffect(
    () => {
      dispatch(unsetValues({ id: 'search' }));

      if (content) {
        addShortcuts(
          [{
            keyCode: 'Escape',
            handler: () => close(),
          }],
          'close-layer',
        );
      }
      else {
        removeShortcuts('close-layer');
      }
    },
    [content]
  );

  const open = useCallback((node) => {
    setContent(node);
  }, []);

  const close = useCallback(() => {
    setContent(null);
  }, []);

  const Layer = content
    ? ReactDOM.createPortal(content, container)
    : null;

  const LayerHandler = (Children) => ({ records, column, data, helper = {}, event }) => {

    setContent(
      <div
        style={{
          position: 'absolute',
          width: '100vw',
          maxHeight: '100vh',
          minHeight: '100vh',
          top: 0,
          left: 0,
          zIndex: 10,
          padding: '10px 25px 25px 25px',
          background: '#00000033',
          display: 'flex',
          pointerEvents: 'auto',
        }}
      >
        <div className='w-full flex bg-white rounded-m shadow-outer-2 relative text-left' style={{
          paddingTop: 64,
          pointerEvents: 'auto',
        }}>

          <div className="absolute pin-t pin-r p-1">
            <div className='w-4 h-4 circle hover:bg-gray hover:fill-white p-1 pointer' onClick={close}>
              <IconClose className="w-full h-full fill-gray-dark" />
            </div>
          </div>

          <Children record={records[0]} column={column} helper={helper} />
        </div>
      </div>
    )

  };

  return { open, close, Layer, LayerHandler };
}