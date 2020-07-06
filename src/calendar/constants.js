
import moment from 'moment';

export const ONE_HOUR = 60 * 60 * 1000;
export const ONE_DAY = 24 * ONE_HOUR;
export const Y_MOVEMENT_ACCURANCY = 15; // in minutes

export const DATE_FORMAT = 'YYYY-MM-DD';
export const DATETIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';
export const DATE_FORMAT_HTML5 = 'YYYY-MM-DDTHH:mm';

export const DATE_REGEX_HTML5 = /^20[0-2][0-9]-[0-1][0-9]-[0-3][0-9]T[0-2][0-9]:[0-5][0-9]$/;
export const DATE_REGEX_L = /^20[0-2][0-9]\.1?[0-9]\.[1-3]?[0-9].$/;

export const isDateHTML5 = date => DATE_REGEX_HTML5.exec(date) !== null && moment(date, 'l').isValid();
export const isDateL = date => DATE_REGEX_L.exec(date) !== null && moment(date, 'l').isValid();

export default {
  ONE_HOUR,
  ONE_DAY,
  Y_MOVEMENT_ACCURANCY,
  DATE_FORMAT,
  DATE_FORMAT_HTML5,
  DATE_REGEX_L,
};
