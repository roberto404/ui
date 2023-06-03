import React from 'react';


/* !- React Actions */

// ...


/* !- React Elements */

import Submit from './submit';
import IconSave from '../../icon/mui/action/done';
import IconDelete from '../../icon/mui/navigation/cancel';


/* !- PropTypes */

const defaultProps =
{
  disableDelete: false,
}

type PropTypes = Partial<typeof defaultProps> &
{
  disableDelete?: boolean,
  onSave?: React.MouseEventHandler<HTMLButtonElement>,
  onDelete?: React.MouseEventHandler<HTMLButtonElement> ,
};



/**
 * Floating action buttons
 */
const SubmitButtons = ({
  disableDelete,
}: PropTypes) =>
{
  const Buttons = ({ onSave, onDelete }: PropTypes) =>
  (
    <div className="buttons action">
      { disableDelete !== true &&
      <button onClick={onDelete}><IconDelete /></button>
      }
      <button onClick={onSave}><IconSave /></button>
    </div>
  );

  return (
    <Submit>
      <Buttons />
    </Submit>
  );
};

SubmitButtons.defaultProps = defaultProps;

export default SubmitButtons;