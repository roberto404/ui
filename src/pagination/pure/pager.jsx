
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';


export const Pager = (
{
  totalPage,
  page,
  goToPage,
  prevText,
  nextText,
},
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


Pager.propTypes =
{
  prevText: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
  ]),
  nextText: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
  ]),
};

Pager.defaultProps =
{
  prevText: 'global.prev',
  nextText: 'global.next',
};

export default Pager;
