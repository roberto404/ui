
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import clamp from '@1studio/utils/math/clamp';


/* !- Redux Actions */

import * as GridActions from '../../grid/actions';


/* !- React Elements */

const Page = ({ active, onClick, page }) =>
  <a className={classNames({ active })} onClick={onClick}><span className="page">{page}</span></a>;


/**
 * [Pages description]
 */
export const Pages = (
{
  id,
  totalPage,
  page,
  goToPage,
  limit,
  UI,
  className,
},
) =>
{
  if (totalPage < 2)
  {
    return <span />;
  }

  const nodes = [];

  let start = 0;
  let end = totalPage;

  if (limit)
  {
    const half = Math.floor(limit / 2);

    start = clamp(page - 1 - half, 0, totalPage - limit);
    end = clamp(page + half, Math.min(limit, totalPage), totalPage);
  }

  if (end > 0)
  {
    for (let i = start; i < end; i += 1)
    {
      const thisPage = i + 1;

      nodes.push(
        React.createElement(UI, {
          key: i,
          page: thisPage,
          active: thisPage === page,
          onClick: (e) =>
          {
            e.preventDefault();
            goToPage(thisPage, id);
          },
        })
      );
    }
  }

  return (
    <div className={className}>
      {nodes}
    </div>
  );
};


Pages.propTypes =
{
  className: PropTypes.string,
  limit: PropTypes.number,
  UI: PropTypes.func,
};

Pages.defaultProps =
{
  className: 'pages',
  limit: 0,
  UI: Page,
};


export const ConnectedPages = connect(
  (state, { id }) =>
  {
    const grid = state.grid[id] || {};

    return ({
      totalPage: grid.totalPage,
      page: grid.page,
    });
  },
  {
    goToPage: GridActions.goToPage,
  },
)(Pages);

export default ConnectedPages;
