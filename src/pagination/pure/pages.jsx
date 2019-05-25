
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import clamp from '@1studio/utils/math/clamp';


const Page = ({ active, onClick, page }) =>
  <a className={classNames({ active })} onClick={onClick}><span className="page">{page}</span></a>;

export const Pages = (
{
  totalPage,
  page,
  goToPage,
  limit,
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
        <Page
          key={i}
          page={thisPage}
          active={thisPage === page}
          onClick={
            (e) =>
            {
              e.preventDefault();
              goToPage(thisPage, page);
            }
          }
        />,
      );
    }
  }

  return (
    <div className="pages">
      {nodes}
    </div>
  );
};


Pages.propTypes =
{
  limit: PropTypes.number,
};

Pages.defaultProps =
{
  limit: 0,
};

export default Pages;
