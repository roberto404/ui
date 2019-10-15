import React from 'react';
import PropTypes from 'prop-types';
import copyToClipboard from '@1studio/utils/string/copyToClipboard';


/* !- React Actions */

import { popover, flush } from '@1studio/ui/layer/actions';


/* !- React Elements */

import IconShare from '../../icons/share_alt';


/**
 * Share Component
 */
const Share = ({ label }, { store }) =>
{
  const onClickShareButtonHandler = (event) =>
  {
    event.preventDefault();

    // @Todo
    // const form = store.getState().form;
    copyToClipboard(window.location.href);


    store.dispatch(popover(<div>Másolva!</div>, event));

    setTimeout(() => store.dispatch(flush()), 1250);
  };

  return (
    <button onClick={onClickShareButtonHandler} className="small w-auto ml-auto">
      <IconShare />
      <span>{label}</span>
    </button>
  );
};

Share.propTypes =
{
  label: PropTypes.string,
};

Share.defaultProps =
{
  label: 'Megosztás',
};

Share.contextTypes =
{
  store: PropTypes.object,
};

export default Share;
