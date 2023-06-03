
import React from 'react';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';


/* !- Types */

const defaultProps =
{
  prevText: 'global.prev',
  nextText: 'global.next',
};


type PropTypes = Partial<typeof defaultProps> & {
  page: number,
  totalPage: number,
  prevText: string | JSX.Element,
  nextText: string | JSX.Element,
  goToPage: () => void,
};


export const Pager = (
{
  page,
  totalPage,
  prevText,
  nextText,
  goToPage,
}: PropTypes,
) =>
{
  const onClickButtonHandler = (event) =>
  {
    event.preventDefault();
    const direction = parseInt(event.currentTarget.dataset.direction);
    const nextPage = parseInt(page) + direction;

    goToPage(nextPage, page);
  };

  const prev = (typeof prevText === 'string') ? <FormattedMessage id={prevText} /> : prevText;
  const next = (typeof nextText === 'string') ? <FormattedMessage id={nextText} /> : nextText;


  return (
    <div className="pager">
      <button
        className={classNames({ active: page !== 1 })}
        onClick={onClickButtonHandler}
        data-direction="-1"
      >
        {prev}
      </button>
      <button
        className={classNames({ active: page < totalPage && totalPage > 0 })}
        onClick={onClickButtonHandler}
        data-direction="1"
      >
        {next}
      </button>
    </div>
  );
};

Pager.defaultProps = defaultProps;

export default Pager;
