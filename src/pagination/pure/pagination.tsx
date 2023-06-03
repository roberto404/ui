
import React from 'react';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';

import { Pages } from './pages';


/* !- Types */

const defaultProps =
{
  limit: 0,
  prevText: 'global.prev',
  nextText: 'global.next',
};

type PropTypes = Partial<typeof defaultProps> & {
  limit: number,
  prevText: string | JSX.Element,
  nextText: string | JSX.Element,
}

/**
 */
export const Pager = (
{
  totalPage,
  page,
  onChangePage,
  prevText,
  nextText,
  limit,
}: PropTypes,
) =>
{
  const onClickButtonHandler = (event) =>
  {
    event.preventDefault();
    const direction = parseInt(event.currentTarget.dataset.direction);
    const nextPage = parseInt(page) + direction;

    onChangePage(nextPage);
  };

  const prev = (typeof prevText === 'string') ? <FormattedMessage id={prevText} /> : prevText;
  const next = (typeof nextText === 'string') ? <FormattedMessage id={nextText} /> : nextText;


  return (
    <div className="pager">

      <div className="prev">
        <button
          className={classNames({ active: page !== 1 })}
          onClick={onClickButtonHandler}
          data-direction="-1"
        >
          {prev}
        </button>
      </div>

      <Pages
        totalPage={totalPage}
        page={page}
        goToPage={onChangePage}
        limit={limit}
      />

      <div className="next">
        <button
          className={classNames({ active: page !== totalPage && totalPage > 0 })}
          onClick={onClickButtonHandler}
          data-direction="1"
        >
          {next}
        </button>
      </div>

    </div>
  );
};

Pager.defaultProps = defaultProps;

export default Pager;
