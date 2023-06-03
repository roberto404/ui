import { combineReducers } from 'redux';

import form from './form/reducers'; // 18
import grid from './grid/reducers'; // 50 Kbyte
import view, { StateTypes as ViewStateTypes } from './view/reducers'; // 4
import layer from './layer/reducers'; // 33 Kbyte
import user from './authentication/reducers'; // 65 Kbyte

export type StateTypes =
{
  view: ViewStateTypes,
}

export const reducers = {
  form,
  grid,
  view,
  layer,
  user,
};

export default combineReducers(reducers);
