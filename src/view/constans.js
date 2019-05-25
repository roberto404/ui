import PropTypes from 'prop-types';

export const SCHEME = {
  settings: PropTypes.shape({
    active: PropTypes.string,
    groups: PropTypes.objectOf(
      PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          status: PropTypes.oneOf([0, 1]).isRequired,
          pos: PropTypes.number,
          title: PropTypes.oneOfType([
            // PropTypes.element,
            PropTypes.func,
            PropTypes.string,
          ]),
        }),
      ),
    ),
  }),
};
