
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import classNames from 'classnames';
import clamp from '@1studio/utils/math/clamp';
import { useAppContext } from '../../context';


/* !- Redux Actions */

import { goToPage } from '../../grid/actions';


/* !- React Elements */

const Page = ({ active, onClick, page }) =>
  <a className={classNames({ active })} onClick={onClick}><span className="page">{page}</span></a>;


/* !- Types */

const defaultProps =
{
  className: 'pages',
  limit: 0,
  UI: Page,
};

type PropTypes = Partial<typeof defaultProps> & {
  id?: string,
  page: number,
  totalPage: number,
  goToPage: (page: number, id: string) => void,
}

/**
 * [Pages description]
 */
export const Pages = ({
  id,
  limit,
  UI,
  className,
  page,
  totalPage,
  goToPage,
} : PropTypes) =>
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


Pages.defaultProps = defaultProps;

export const ConnectedPages = (props) =>
{
  const { id } = props;

  const dispatch = useDispatch();

  const { pages, totalPage } = useSelector(
    (state) =>
    {
      const grid = state.grid[id] || {};

      return ({
        totalPage: grid.totalPage,
        page: grid.page,
      });
    }
  );

  const goToPageHandler = (page, id) =>
  {
    dispatch(goToPage(page, id));
  }

  return (
    <Pages
      {...props}
      pages={pages}
      totalPage={totalPage}
      goToPage={goToPageHandler}
    />
  );
};


export default ConnectedPages;
