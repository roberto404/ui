
import React from 'react';

/* !- React Elements */

import Form from '../form/form';
import Textarea from '../form/pure/textarea';
import IconDelete from '../icon/mui/action/delete_forever';
import IconSubmit from '../icon/mui/action/done';



export const AVAILABLE_METHODS = ['popover', 'fullscreen', 'dialog', 'sidebar', 'preload'];
export const DEFAULT_METHOD = 'dialog';


export const MODAL_PROPS = {
  submit: (callback) =>
  ({
    title: 'Are you sure you want to submit?',
    // content: '',
    icon: IconSubmit,
    className: 'green w-full',
    button: {
      title: 'Submit',
      handler: callback,
    },
    buttonSecondary: {
      title: 'Cancel',
    },
  }),
  submitWithMessage: (callback) =>
  ({
    title: 'Are you sure you want to submit?',
    content: (
      <Form id="modal" className="p-0 m-0">
        <Textarea resizeAble={false} className="m-0" id="message" rows={2} autoFocus />
      </Form>
    ),
    icon: IconSubmit,
    className: 'green w-full',
    button: {
      title: 'Submit',
      handler: callback,
    },
    buttonSecondary: {
      title: 'Cancel',
    },
  }),
  delete: (callback) =>
  ({
    title: 'Are you sure you want to delete?',
    content: 'This item will be deleted immediately. You can\'t undo this action.',
    icon: IconDelete,
    className: 'red w-full',
    button: {
      title: 'Delete',
      handler: callback,
    },
    buttonSecondary: {
      title: 'Cancel',
    },
  }),
  deleteWithMessage: (callback) =>
  ({
    title: 'Are you sure you want to delete?',
    content: (
      <Form id="modal" className="p-0 m-0">
        <Textarea resizeAble={false} className="m-0" id="message" rows={2} autoFocus />
      </Form>
    ),
    icon: IconDelete,
    className: 'red w-full',
    button: {
      title: 'Delete',
      handler: callback,
    },
    buttonSecondary: {
      title: 'Cancel',
    },
  }),
};


export default {
  AVAILABLE_METHODS,
  DEFAULT_METHOD,
};
