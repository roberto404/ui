import React from 'react';


/* !- Types */

const defaultProps =
{
  title: 'hello',
  className: 'button outline',
}

type PropTypes = Partial<typeof defaultProps> & {
  title: string,
  className: string,
  onClick?: ({}) => void,
};

const Component = ({
  title,
  className,
  onClick,
}: PropTypes) =>
{
  return (
    <div onClick={onClick} className={className}>{title}</div>
  )
}

Component.defaultProps = defaultProps;

export default Component;