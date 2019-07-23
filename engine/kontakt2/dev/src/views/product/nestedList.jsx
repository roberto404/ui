import React, { Component } from 'react';
import PropTypes from 'prop-types';

/* !- React Actions */

import { modifyRecord } from '@1studio/ui/grid/actions';
import { dialog, menu, close } from '@1studio/ui/layer/actions';
import { setValues } from '@1studio/ui/form/actions';


/* !- React Elements */

import Connect from '@1studio/ui/grid/connect';
import NestedList from '@1studio/ui/grid/pure/nestedList';
import { RowAvatarTitleAction as Row } from '@1studio/ui/grid/pure//rows';
import { Toggle, Dropdown } from '@1studio/ui/form/pure';

import IconExplode from '@1studio/ui/icon/mui/action/swap_horiz';
import IconPullOut from '@1studio/ui/icon/mui/hardver/keyboard_backspace';

import Product from '../../components/product';


/* !- Constants */

import { IMAGE_URL } from './const';



const Level1 = (minLength, context) => ({ index, level, items, children, groupBy }) =>
{
  const { register, api, store } = context;

  if (items.length < minLength)
  {
    return <span />;
  }

  const groupByField = groupBy[level];
  let title = items[0][groupByField];


  if (groupByField === 'category' && register.data.product)
  {
    title = register.data.product.categories.find(({ id }) => id === title).title;
  }

  return (
    <div className="mb-4">
      <table>
        <Row
          title={<span className="text-m bold">{title}</span>}
          // subtitle={`${items[0].brand} ${title}`}
          img={`${IMAGE_URL + items[0].manufacturer}/${items[0].id}-01.jpg`}
          action={
            (items.length > 1 && groupBy[0] === 'related_id') &&
            <IconExplode
              className="w-3 p-1/2 fill-gray circle hover:bg-gray-light pointer"
              onClick={() =>
              {
                const payload = {
                  id: [],
                  related_id: [],
                };

                items.forEach(({ id }) =>
                {
                  payload.id.push(id);
                  payload.related_id.push(id);
                });

                api({
                  payload,
                }).then(({ records }) =>
                {
                  records.forEach((record) =>
                  {
                    store.dispatch(modifyRecord(record, 'product'));
                  });
                });
              }}
            />
          }
        />
      </table>
      <div className="px-4 py-1">
        <table>
          { children }
        </table>
      </div>
    </div>
  );
};

Level1.contextTypes =
{
  store: PropTypes.object,
};

const Level2 = ({ items, groupBy }, { store, api }) =>
{
  const onClickRowHandler = () =>
  {
    store.dispatch(dialog(<Product {...items} />, { className: 'w-786' }));
  };

  const title = (
    <div>
      <span className="text-gray">{`${items.id} • `}</span>
      <span className="text-red">{`${items.brand} ${items.title}`}</span>
      { items.color &&
        <span className="text-black-light">{` • ${items.color}`}</span>
      }
    </div>
  );

  let action;

  // only group by related_id
  if (groupBy[0] === 'related_id' && items.related_id !== items.id)
  {
    const onClickActionHandler = (event) =>
    {
      event.stopPropagation();

      api({
        payload: {
          id: items.id,
          related_id: items.id,
        },
      }).then(({ records }) =>
      {
        store.dispatch(modifyRecord(records, 'product'));
      });
    };

    action = (
      <IconPullOut
        className="w-3 p-1/2 fill-gray circle hover:bg-gray-light flip-vertical pointer"
        onClick={onClickActionHandler}
      />
    );
  }

  return (
    <Row
      onClick={onClickRowHandler}
      title={title}
      action={action}
    />
  );
};

Level2.contextTypes =
{
  api: PropTypes.func,
  store: PropTypes.object,
};

/**
 * [ProductNestedList description]
 * @extends Component
 */
class ProductNestedList extends Component
{
  constructor(props)
  {
    super(props);

    this.state =
    {
      groupBy: 'related_id',
      minLength: 1,
    };
  }


  onClickMenuItemHandler = ({ id }) =>
  {
    this.context.store.dispatch(close());

    this.setState({
      groupBy: id,
    });
  }

  onClickGroupByHandler = () =>
  {
    const menuProps = {
      items: this.groupByData.map(({ id, title }) => (
        {
          id,
          title,
          handler: this.onClickMenuItemHandler,
          className: this.state.groupBy === id ? 'active' : '',
        }
      )),
    };

    this.context.store.dispatch(menu(menuProps));
  }

  onChangeMinLengthHandler= ({ id, value }) =>
  {
    this.setState({ minLength: value ? 2 : 1 });
    this.context.store.dispatch(setValues({ id, value }));
  }

  groupByData = [
    { id: 'related_id', title: 'Összevont azonosító' },
    { id: 'manufacturer', title: 'Gyártó' },
    { id: 'brand', title: 'Márka' },
    { id: 'category', title: 'Kategória' },
    { id: 'color', title: 'Színcsoport' },
  ]

  render()
  {
    const groupByTitle = this.groupByData.find(({ id }) => id === this.state.groupBy).title;

    return (
      <div className="w-full p-2 scroll-y">

        <Toggle
          label="Csak az összevontak mutatása"
          id="minLength"
          onChange={this.onChangeMinLengthHandler}
        />

        <button
          onClick={this.onClickGroupByHandler}
          className="outline shadow embed-angle-down-gray w-auto"
        >
          {groupByTitle}
        </button>

        <Connect
          UI={NestedList}
          listen={['data', 'hook']}
          uiProps={{
            groupBy: [this.state.groupBy],
            UI: [Level1(this.state.minLength, this.context), Level2],
            className: 'm-auto w-max-768',
          }}
        />
      </div>
    );
  }
}

ProductNestedList.contextTypes =
{
  api: PropTypes.func,
  register: PropTypes.object,
  store: PropTypes.object,
};


export default ProductNestedList;
