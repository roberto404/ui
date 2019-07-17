import PropTypes from 'prop-types';

export default {
  rowNum: PropTypes.number,
  colNum: PropTypes.number,
  rowHeight: PropTypes.number,
  colWidth: PropTypes.number,
  firstDayIndex: PropTypes.number,
  lastDayIndex: PropTypes.number,
  calendarCoord: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
  }),
  startDate: PropTypes.instanceOf(Date),
  endDate: PropTypes.instanceOf(Date),
  className: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.number)),
  onClick: PropTypes.func,
  UI: PropTypes.func,
};
