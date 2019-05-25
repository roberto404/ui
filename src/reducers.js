import { combineReducers } from 'redux';
import form from './form/reducers';
import grid from './grid/reducers';
import view from './view/reducers';
import layer from './layer/reducers';
import user from './authentication/reducers';
// import calendar from './calendar/reducers';

export const reducers = {
  form,
  grid,
  view,
  layer,
  user,
  // calendar,
};

export default combineReducers(reducers);
