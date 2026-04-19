
import React from 'react';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';
import clamp from '@1studio/utils/math/clamp';


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
  goToPage: (nextPage: number, page: number) => void,
  infinity?: boolean,
};


export const Pager = (
  {
    page,
    totalPage,
    prevText = defaultProps.prevText,
    nextText = defaultProps.nextText,
    goToPage,
    infinity = false,
  }: PropTypes,
) => {

  const onClickButtonHandler = (event) => {
    event.preventDefault();
    const direction = parseInt(event.currentTarget.dataset.direction);

    let nextPage = parseInt(page) + direction;

    if (infinity) {
      if (nextPage < 0) {
        nextPage = totalPage;
      }
      else if (nextPage > totalPage) {
        nextPage = 0;
      }
    } else {
      nextPage = clamp(nextPage, 0, totalPage)
    }

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

export default Pager;
