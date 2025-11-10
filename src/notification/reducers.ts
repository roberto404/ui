import React from 'react';
import replaceAt from '@1studio/utils/array/replaceAt';


/* !- Types */

import { PropTypes as Item } from './item';
export type { Item };

type ActionTypes = {
  type: string;
  item: Item,
}


/* !- Constants */

const DEFAULT_STATE = {
  active: false,
  items: [],
};

function uniqueId() {
  const now = Date.now(); // ms timestamp
  const rand = Math.floor(1000 + Math.random() * 9000); // 4 számjegy (1000–9999)
  return `${now}${rand}`;
}

/**
 * Layer Redux Reducers
 * @param  {Object} [state={}]
 * @param  {Object} action
 * @return {Object}            state
 */
const reducers = (state = DEFAULT_STATE, action: ActionTypes = {}) => {

  switch (action.type) {

    case 'ADD_NOTIFICATION':
      {
        const item = {
          id: uniqueId(),
          ...action.item,
        }

        const itemIndex = state.items.findIndex((i) => i.id === item.id);
        const items = (itemIndex === -1) ? [...state.items, item] : replaceAt(state.items, itemIndex, item);

        return {
          items,
          active: true,
        };
      }

    case 'UPDATE_NOTIFICATION':
      {
        const itemIndex = state.items.findIndex((i) => i.id === action.item.id);

        if (itemIndex === -1) {
          return state;
        }

        const nextItem = { ...state.items[itemIndex], ...action.item };
        const items = replaceAt(state.items, itemIndex, nextItem);

        return ({
          items,
          active: true,
        });
      }

    case 'REMOVE_NOTIFICATION':
      {
        const itemIndex = state.items.findIndex((i) => i.id === action.id);

        if (itemIndex === -1) {
          return state;
        }

        const items = state.items.filter((i) => i.id !== action.id);

        return ({
          items,
          active: items.length > 0,
        });
      }



    case 'FLUSH_NOTIFICATION':
      {
        return { ...DEFAULT_STATE };
      }

    default:
      return state;
  }
};


export const GET_NOTIFICATION_PAYLOAD = (
  id: string,
  key: false | string = false
) => ({ notification }) => {

  const item = (notification.items || []).find(n => n.id === id);

  if (!item || !item.payload) {
    return undefined;
  }

  return key ? item.payload[key] : item.payload;
};



export default reducers;
