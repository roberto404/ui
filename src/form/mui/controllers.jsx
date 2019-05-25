import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';


/* !- Redux Actions */

import { modal } from '/Users/roberto/Dropbox/Sites/ui/src/layer/actions';


/* !- React Elements */

import MuiFlatButton from 'material-ui/FlatButton';
import SubmitField from './submit';
import IconDelete from '../../icon/delete';


/* !- Constants */

const Submit = injectIntl(SubmitField);


/**
* Controllers Component
*
* @example
*/
const Controllers = (
{
  saveButton,
  cancelButton,
  deleteButton,
  saveLabel,
  cancelLabel,
  deleteLabel,
  // onSaveHandler,
  // onCancelHandler,
  // onDeleteHandler,
  intl
},
{
  api,
  store,
  form,
  onFinish,
  // onSave,
  // onCancel,
  // onDelete,
},
) =>
{
  const state = store.getState().form[form];
  const isNew = !(state && state.id);

  const onDelete = () =>
  {
    api({
      method: 'delete',
      payload: state,
    })
      .then((response) =>
      {
        onFinish(response);
        // store.dispatch(close());
      });
  };

  const onClickDeleteHandler = () =>
  {
    store.dispatch(
      modal({
        title: intl ? intl.formatMessage({ id: 'modal.delete.title' }) : 'Biztosan törölni kívánja a teljes adatlapot?',
        content: intl ? intl.formatMessage({ id: 'modal.delete.content' }) : 'A törlés visszavonhatatlan művelet.',
        icon: <IconDelete />,
        button:
        {
          title: intl ? intl.formatMessage({ id: 'global.delete' }) : 'Törlés',
          handler: () => onDelete(),
        },
      }),
    );

    return true;
  };

  return (
    <div className="grid desktop:grid-2 mt-2">

      <div className="desktop:col-3-12">

      { saveButton &&
        <Submit
          label={saveLabel}
        />
      }

      { cancelButton &&

        <Link to={location.pathname.replace(/(.*)\/.*$/, '$1')}>
          <MuiFlatButton
            label={<FormattedMessage id={cancelLabel} />}
          />
        </Link>
      }
      </div>


      <div className="desktop:col-6-12" />

      { deleteButton && !isNew &&
      <div className="col-2-12 text-right">
        <Submit
          classes="warn"
          label={<FormattedMessage id={deleteLabel} />}
          iconButton
          icon={<IconDelete />}
          onClick={onClickDeleteHandler}
        />
      </div>
      }

    </div>
  );
};


/**
 * propTypes
 * @type {Object}
 */
Controllers.propTypes =
{
  /**
   * Cancel button label
   */
  cancelLabel: PropTypes.string,
  /**
   * Save button label
   */
  saveLabel: PropTypes.string,
  /**
   * Delete button label
   */
  deleteLabel: PropTypes.string,
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
Controllers.defaultProps =
{
  cancelLabel: 'global.cancel',
  saveLabel: 'global.save',
  deleteLabel: 'global.delete',
  cancelButton: true,
  saveButton: true,
  deleteButton: true,
};

/**
 * contextTypes
 * @type {Object}
 */
Controllers.contextTypes = {
  store: PropTypes.object,
  form: PropTypes.string,
  api: PropTypes.func,
  onFinish: PropTypes.func,
//   onSave: PropTypes.func,
//   onCancel: PropTypes.func,
//   onDelete: PropTypes.func,
};

export default Controllers;
