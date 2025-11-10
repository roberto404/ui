import React, { useState } from 'react';
import copyToClipboard from '@1studio/utils/string/copyToClipboard';
import classNames from 'classnames';

/* !-- Actions */


/* !-- Components */


/* !-- Constants */


/* !-- Types */

type PropTypes = {
  text: string;
  className?: string;
  inactiveClassName?: string;
  activeClassName?: string;
  children?: React.ReactNode;
  duration?: number;
};


/**
*
*/
const CopyToClipboard = ({
  text,
  className = 'pointer transition',
  activeClassName,
  inactiveClassName,
  children,
  duration = 1000,
}: PropTypes) => {

  const [active, setActive] = useState(false);
  const [hover, setHover] = useState(false);

  const onClickHandler = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    copyToClipboard(text);

    setActive(true);

    setTimeout(() => {
      setActive(false);
    }, duration);
  }

  return (
    <>
      <div
        onMouseOver={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={onClickHandler}
        className={classNames({
          [className]: true,
          [activeClassName]: active,
          [inactiveClassName]: !active,
        })}>
        {text}
      </div>
      {hover && children}
    </>
  );
}

export default CopyToClipboard;