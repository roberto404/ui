
import React from 'react';
import PropTypes from 'prop-types';
import Tree from '@1studio/utils/models/tree';


/* !- React Elements */

import IconSave from '@1studio/ui/icon/mui/action/done';
import Form from '@1studio/ui/form/pure';
import { Input, Select, Collection, Submit, Controllers } from '@1studio/ui/form/pure/intl';
import FormConnect from '@1studio/ui/form/connect';
import GridConnect from '@1studio/ui/grid/connect';
import NestedCollectionItem from './nestedCollection';


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


const Position = ({ pid, data, id }) =>
  (<Select
    {...FIELDS.pos}
    default="0"
    data={[
      { id: '0', title: 'Első' },
      ...new Tree(data)
        .getChildren(pid)
        .filter(item => item.id !== id)
        .map(item => ({ id: parseInt(item.pos) + 1, title: `'${item.title}' után` })),
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
 * Submit button
 * @param {[type]} onClick [description]
 */
const SubmitButton = ({ onClick }) =>
(
  <div className="pin-br w-auto column center p-3 py-2">
    <button className="action large red shadow mt-1/2" onClick={onClick}><IconSave /></button>
  </div>
);



/**
* WebMenuForm Component
*/
const WebMenuForm = (props, { store }) =>
{
  const onChangeFormHandler = (next, prev) =>
  {
    // console.warn(next, prev);
    // return;
    if (prev.id === next.id && prev.pid !== next.pid)
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
          <div>
            <FormConnect
              UI={Parent}
              uiProps={{ data }}
            />
            <FormConnect
              UI={Position}
              uiProps={{ data }}
            />
          </div>
        )}
      />

      <Collection
        id="props"
        UI={NestedCollectionItem}
        label="Komponensek"
        value={[
          {
            modul: 'ProductGrid',
            title: '',
            subTitle: '',
            props: {
              colNum: 4,
              rowNum: 0,
              features: ['order', 'filter'],
              filters: [{ field: 'id', operator: '=', value: '' }],
            },
          },
        ]}
      />


      <Submit><SubmitButton /></Submit>

    </Form>
  );
};

WebMenuForm.contextTypes =
{
  store: PropTypes.object,
};

export default WebMenuForm;
