
import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context';



/* !- Redux Actions */

import { modal, close, preload } from '../layer/actions';
import { logout } from './actions';


/* !- Types */ 

const defaultProps =
{
  className: '',
  intl: {
    formatMessage: ({ id }) => id,
  },
};

type PropTypes = Partial<typeof defaultProps> &
{
  /**
   * @private
   * Authentication Redux action
   */
  className: string,
}



/**
* Logout Component.
* Automatically call logout API and notice Redux. Finally redirect to home.
*/
const Logout = (
  {
    className,
    intl,
  }: PropTypes
) =>
{
  const navigate = useNavigate();
  const { api } = useAppContext();
  const dispatch = useDispatch();


  api('logout')
    .then((response) =>
    {
      navigate('/', { replace: true });

      if (typeof response === 'object' && response.modal)
      {
        dispatch(modal(response.modal));
      }
      else
      {
        dispatch(close());
      }

      dispatch(logout());

      window.location.reload();
    });

    dispatch(preload());

  return (
    <div className={className}>{intl.formatMessage({ id: 'logout.inprogress' })}</div>
  );
};


Logout.defaultProps = defaultProps;


export default Logout;
