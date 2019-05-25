
import React from 'react';
import PropTypes from 'prop-types';


/* !- React Elements */

import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';

import IconArrowRight from 'material-ui/svg-icons/hardware/keyboard-arrow-right';
import IconArrowLeft from 'material-ui/svg-icons/hardware/keyboard-arrow-left';

/**
 * Pagination Stateless Component
 *
 * @example
 <Pagination
    page={1}
    totalPage={2}
    onChange={(page)=>goToPage(page)}
  />
 */
const Pagination = ({
  page,
  totalPage,
  onChange,
}) =>
{
  const nextPageAvailable = (page < totalPage);
  const prevPageAvailable = (page > 1);

  /* !- Handlers */

  /**
   * @private
   * @return {void}
   */
  const onClickPrevHandler = () =>
  {
    onChange(page - 1);
  };

  /**
   * @private
   * @param  {SytheticEvent} event
   * @return {void}
   */
  const onChangePageHandler = (event) =>
  {
    const value = parseInt(event.target.value);

    if (value)
    {
      onChange(value);
    }
    else
    {
      page = '';
    }
  };

  /**
   * @private
   * @return {void}
   */
  const onClickNextHandler = () =>
  {
    onChange(page + 1);
  };

  if (typeof totalPage !== 'number' || totalPage < 1)
  {
    return null;
  }

  return (

    <div
      className="mt-2 text-center"
    >

      <IconButton
        onClick={onClickPrevHandler}
        disabled={!prevPageAvailable}
      >
        <IconArrowLeft />
      </IconButton>

      <TextField
        hintText={page}
        floatingLabelText={`${page} of ${totalPage}`}
        style={{ width: '120px' }}
        onChange={onChangePageHandler}
        onClick={(e) => {
           e.currentTarget.select();
         }}
        value={page}
        disabled={(totalPage < 2)}
      />

      <IconButton
        onClick={onClickNextHandler}
        disabled={!nextPageAvailable}
      >
        <IconArrowRight />
      </IconButton>

    </div>
  )
}

Pagination.propTypes =
{
  page: PropTypes.number.isRequired,
  totalPage: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
};

Pagination.defaultProps =
{
  page: 0,
  totalPage: 0,
};

export default Pagination;
