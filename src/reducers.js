import { combineReducers } from 'redux';

import form from './form/reducers';
import grid from './grid/reducers';
import view from './view/reducers';
import layer from './layer/reducers';
import user from './authentication/reducers';

export const reducers = {
  form,
  grid,
  view,
  layer,
  user,
};

export default combineReducers(reducers);
