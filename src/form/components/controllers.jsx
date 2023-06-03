import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';


/* !- Redux Actions */

import { modal } from '../../layer/actions';


/* !- React Elements */

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
  saveText,
  cancelText,
  deleteText,
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
    <div className="controllers grid desktop:grid-2">

      { saveButton &&
      <div className="desktop:col-3-12">
        <Submit
          label={saveText}
        />
      </div>
      }

      { cancelButton &&
      <div className="desktop:col-2-12">
        <Link to={location.pathname.replace(/(.*)\/.*$/, '$1')}>
          <button className="field">
            <FormattedMessage id={cancelText} />
          </button>
        </Link>
      </div>
      }

      <div className="desktop:col-5-12" />

      { deleteButton && !isNew &&
      <div className="desktop:col-2-12">
        <Submit
          className="warn"
          label={<FormattedMessage id={deleteText} />}
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
Controllers.defaultProps =
{
  cancelText: 'global.cancel',
  saveText: 'global.save',
  deleteText: 'global.delete',
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
