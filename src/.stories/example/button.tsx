import React, { useState } from 'react';


/* !- Types */



const defaultProps = 
{
  /**
   * title description
   */
  title: 'Hello world!',
};

type PropTypes =
{
  /**
   * className description
   */
  className?: string,
  primary?: boolean,
} & typeof defaultProps;


/**
 * UI component description
*/
export const Button = ({
  title,
  className,
}: PropTypes) =>
{
  const [value, setValue] = useState('Secondary');
  const [isPrimary, setIsPrimary] = useState(false);

  // Sets a click handler to change the label's value
  const handleOnChange = () => {
    if (!isPrimary)
    {
      setIsPrimary(true);
      setValue('Primary');
    }
  };

  return (
    <div className={className} onClick={handleOnChange}>{`${title}: ${value}`}</div>
  )
}

Button.defaultProps = defaultProps;

export default Button;