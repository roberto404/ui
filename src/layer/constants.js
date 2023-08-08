
import React from 'react';

/* !- React Elements */

import Form from '../form/form'; // 8
import Textarea from '../form/components/textarea'; // 18
import IconDelete from '../icon/mui/action/delete_forever';
import IconSubmit from '../icon/mui/action/done';



export const AVAILABLE_METHODS = ['popover', 'fullscreen', 'dialog', 'sidebar', 'preload'];
export const DEFAULT_METHOD = 'dialog';


export const MODAL_PROPS = {
  submit: (callback) =>
  ({
    title: 'modal.title.submit',
    // content: '',
    icon: IconSubmit,
    className: 'green w-full',
    button: {
      title: 'modal.button.submit',
      handler: callback,
    },
    buttonSecondary: {
      title: 'modal.button.cancel',
    },
  }),
  submitWithMessage: (callback) =>
  ({
    title: 'modal.title.submit',
    content: (
      <Form id="modal" className="p-0 m-0">
        <Textarea resizeAble={false} className="m-0" id="message" rows={2} autoFocus />
      </Form>
    ),
    icon: IconSubmit,
    className: 'green w-full',
    button: {
      title: 'modal.button.submit',
      handler: callback,
    },
    buttonSecondary: {
      title: 'modal.button.cancel',
    },
  }),
  delete: (callback) =>
  ({
    title: 'modal.title.delete',
    content: 'modal.content.delete',
    icon: IconDelete,
    className: 'red w-full',
    button: {
      title: 'modal.button.delete',
      handler: callback,
    },
    buttonSecondary: {
      title: 'modal.button.cancel',
    },
  }),
  deleteWithMessage: (callback) =>
  ({
    title: 'modal.delete.title',
    content: (
      <Form id="modal" className="p-0 m-0">
        <Textarea resizeAble={false} className="m-0" id="message" rows={2} autoFocus />
      </Form>
    ),
    icon: IconDelete,
    className: 'red w-full',
    button: {
      title: 'modal.button.delete',
      handler: callback,
    },
    buttonSecondary: {
      title: 'modal.button.cancel',
    },
  }),
};


export default {
  AVAILABLE_METHODS,
  DEFAULT_METHOD,
};
