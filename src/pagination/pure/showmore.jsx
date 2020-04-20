
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import clamp from '@1studio/utils/math/clamp';


import { modifyLimit } from '../../grid/actions';

import IconMore from '../../icon/mui/navigation/expand_more';


export const ShowMore = (
{
  model,
  data,
  label,
  addLimit,
  format,
  className,
  buttonClassName,
  exponentialLimit,
  disableLimitExponential,
},
{
  store,
  grid,
},
) =>
{
  if (!Array.isArray(data))
  {
    return <div />;
  }

  const onClickButtonHandler = (event) =>
  {
    event.preventDefault();

    const multiplier = disableLimitExponential ?
      1 : Math.min(Math.ceil(model.paginate.limit / addLimit), exponentialLimit);

    const limit = model.paginate.limit + (multiplier * addLimit);
    store.dispatch(modifyLimit(limit, grid));
  };

  const current = data.length;
  const limit = model.results.length;
  const percent = (current / limit) * 100;

  if (current === limit)
  {
    return <div />;
  }

  return (
    <div className={className}>
      <div className="grid" style={{ height: '4px' }}>
        <div className="bg-yellow rounded" style={{ width: `${percent}%` }} />
        <div className="bg-gray-light" style={{ width: `${100 - percent}%` }} />
      </div>
      <div className="text-center py-2">{format({ current, limit })}</div>
      <button
        className={buttonClassName}
        onClick={onClickButtonHandler}
      >
        <IconMore />
        <span>{label}</span>
      </button>
    </div>
  );
};


ShowMore.propTypes =
{
  label: PropTypes.string,
  className: PropTypes.string,
  buttonClassName: PropTypes.string,
  addLimit: PropTypes.number,
  exponentialLimit: PropTypes.number,
  disableLimitExponential: PropTypes.bool,
  format: PropTypes.func,
};

ShowMore.defaultProps =
{
  label: 'Show More',
  addLimit: 24,
  exponentialLimit: 240,
  disableLimitExponential: false,
  className: 'desktop:col-1-4 mobile:px-4 m-auto mt-4',
  buttonClassName: 'primary w-auto m-auto',
  format: ({ current, limit }) => `${current} of ${limit} items`,
};

ShowMore.contextTypes =
{
  store: PropTypes.object,
  grid: PropTypes.string,
};

export default ShowMore;
