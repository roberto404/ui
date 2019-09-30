
import React from 'react';
import PropTypes from 'prop-types';
import Tree from '@1studio/utils/models/tree';


/* !- React Elements */

// import Form from '@1studio/ui/view/form';
import Form from '@1studio/ui/form/pure';
import { Input, Select, Submit } from '@1studio/ui/form/pure/intl';
import FormConnect from '@1studio/ui/form/connect';
import GridConnect from '@1studio/ui/grid/connect';


/* !- Actions */

import { setValues } from '@1studio/ui/form/actions';
import { setData } from '@1studio/ui/grid/actions';


/* !- Constants */

import { SETTINGS, FIELDS, SCHEME } from './const';


/* !- React Elements */

const Parent = ({ data }) =>
  (<Select
    {...FIELDS.pid}
    data={[
      { id: '0', title: 'Nyitólap' },
      ...new Tree(data).getTree(true),
    ]}
  />);


const Position = ({ pid, data }) =>
  (<Select
    {...FIELDS.pos}
    default="0"
    data={[
      { id: '0', title: 'Első' },
      ...new Tree(data)
        .getChildren(pid)
        .map(({ pos, title }) => ({ id: parseInt(pos) + 1, title: `'${title}' után` })),
    ]}
  />);


Position.defaultProps =
{
  pid: 0,
};

Position.contextTypes =
{
  store: PropTypes.object,
};





/**
* WebMenuForm Component
*/
const WebMenuForm = (props, { store }) =>
{
  const onChangeFormHandler = (next, prev) =>
  {
    if (next.pid !== prev.pid)
    {
      const pos = new Tree(store.getState().grid.menu.data).getChildren(next.pid).length;
      store.dispatch(setValues({ pos }, 'menu'));
    }
  }

  const onSaveListener = (respond) =>
  {
    // store.dispatch(setValues(respond.record, 'menu'));
    store.dispatch(setData(respond.records, SETTINGS, 'menu'));
  };

  return (
    <Form
      id="menu"
      scheme={SCHEME}
      fields={FIELDS}
      onChange={onChangeFormHandler}
      onSuccess={onSaveListener}
    >
      <Input {...FIELDS.title} />

      <GridConnect
        UI={({ data }) => (
          <fieldset>
            <FormConnect
              UI={Parent}
              uiProps={{ data }}
            />
            <FormConnect
              UI={Position}
              uiProps={{ data }}
            />
          </fieldset>
        )}
      />


      {/*<GridConnect>
        <FormConnect UI={Parent} />
      </GridConnect>*/}


      <Submit />
    </Form>
  );
};

WebMenuForm.contextTypes =
{
  store: PropTypes.object,
};

export default WebMenuForm;
