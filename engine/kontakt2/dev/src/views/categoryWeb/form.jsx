
import React from 'react';
import PropTypes from 'prop-types';
import Tree from '@1studio/utils/models/tree';


/* !- React Elements */

import Form from '@1studio/ui/view/form';
import { Input, Select, Submit } from '@1studio/ui/form/pure/intl';
import Connect from '@1studio/ui/form/connect';


/* !- Actions */

import { setValues } from '@1studio/ui/form/actions';


/* !- React Elements */

const Parent = props =>
  (<Select
    {...props}
    data={[
      { id: '0', title: 'Kategóriák' },
      ...new Tree(props._config.categories).getTree(true),
    ]}
  />);

Parent.propTypes =
{
  _config: PropTypes.shape({
    categories: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([
          PropTypes.number,
          PropTypes.string,
        ]).isRequired,
        title: PropTypes.string.isRequired,
        pid: PropTypes.oneOfType([
          PropTypes.number,
          PropTypes.string,
        ]).isRequired,
        pos: PropTypes.oneOfType([
          PropTypes.number,
          PropTypes.string,
        ]).isRequired,
      }),
    ),
  }),
};

Parent.defaultProps =
{
  _config: { category: [] },
};


const Position = props =>
  (<Select
    {...props}
    default="0"
    data={[
      { id: '0', title: 'Első' },
      ...new Tree(props._config.categories)
        .getChildren(props.pid)
        .map(({ pos, title }) => ({ id: parseInt(pos) + 1, title: `'${title}' után` })),
    ]}
  />);


Position.defaultProps =
{
  _config: { category: [] },
  pid: 0,
};



/* !- Constants */

import { FIELDS, SCHEME } from './const';



/**
* CategoryForm Component
*/
const CategoryForm = ( props, { store } ) =>
{
  const onChangeFormHandler = (next, prev) =>
  {
    const categoryStore = store.getState().form.category;

    if (categoryStore && next.pid !== prev.pid)
    {
      const pos = new Tree(categoryStore._config.categories).getChildren(next.pid).length;
      store.dispatch(setValues({ pos }, 'category'));
    }
  }

  return (
    <Form
      id="category"
      scheme={SCHEME}
      fields={FIELDS}
      onChange={onChangeFormHandler}
      className="_card"
    >
      {/*
      <div className="title">Új kategória</div>
      */}

      <Input {...FIELDS.title} />

      <Connect
        UI={Parent}
        uiProps={FIELDS.pid}
      />

      <Connect
        UI={Position}
        uiProps={FIELDS.pos}
      />

      <Submit />
    </Form>
  );
};

CategoryForm.contextTypes =
{
  store: PropTypes.object,
};

export default CategoryForm;
