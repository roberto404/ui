import React from 'react';
import PropTypes from 'prop-types';

/* !- React Elements */

import MuiFlatButton from 'material-ui/FlatButton';
import MuiRaisedButton from 'material-ui/RaisedButton';
import MuiIconButton from 'material-ui/IconButton';
import MuiIconActionDelete from 'material-ui/svg-icons/action/delete';


/**
* Submit Component
*
* @example
*/
const Submit = (
{
  saveButton,
  cancelButton,
  deleteButton,
  saveText,
  cancelText,
  deleteText,
  onSaveHandler,
  onCancelHandler,
  onDeleteHandler,
},
{
  onSave,
  onCancel,
  onDelete,
},
) =>
(
  <div className="controllers bottom">

    { saveButton &&
      <MuiRaisedButton
        label={saveText}
        onClick={onSaveHandler || onSave}
        primary
      />
    }

    { cancelButton &&
      <MuiFlatButton
        label={cancelText}
        onClick={onCancelHandler || onCancel}
      />
    }

    { deleteButton &&
      <MuiIconButton
        style={{ float: 'right' }}
        tooltip={deleteText}
        onClick={onDeleteHandler || onDelete}
      >
        <MuiIconActionDelete />
      </MuiIconButton>
      }

  </div>
);

/**
 * propTypes
 * @type {Object}
 */
Submit.propTypes =
{
  /**
   * Cancel button label
   */
  cancelText: PropTypes.string,
  /**
   * Save button label
   */
  saveText: PropTypes.string,
  /**
   * Delete button label
   */
  deleteText: PropTypes.string,
  /**
   * Enable cancel
   */
  cancelButton: PropTypes.bool,
  /**
   * Enable save
   */
  saveButton: PropTypes.bool,
  /**
   * Enable delete button
   */
  deleteButton: PropTypes.bool,
  /**
   * Callback function that is fired when the save button click.
   *
   * @param {SytheticEvent} event
   */
  onCancelHandler: PropTypes.func,
  /**
   * Callback function that is fired when the save button click.
   *
   * @param {SytheticEvent} event
   */
  onSaveHandler: PropTypes.func,
  /**
   * Callback function that is fired when the save button click.
   *
   * @param {SytheticEvent} event
   */
  onDeleteHandler: PropTypes.func,
};

/**
 * defaultProps
 * @type {Object}
 */
Submit.defaultProps =
{
  cancelText: 'Mégsem',
  saveText: 'Mentés',
  deleteText: 'Törlés',
  cancelButton: true,
  saveButton: true,
  deleteButton: true,
};

/**
 * contextTypes
 * @type {Object}
 */
Submit.contextTypes = {
  onSave: PropTypes.func,
  onCancel: PropTypes.func,
  onDelete: PropTypes.func,
};


export default Submit;
