
import React, { Component } from 'react';
import Tree from '@1studio/utils/models/tree';


/* !- React Elements */

import Connect from '../../../src/connect';
import NestedList from '../../../src/grid/pure/nestedList';
import IconArrow from '../../../src/icon/mui/navigation/expand_more';


/* !- Constants */

const Menu = new Tree([
  { id: 1, status: 1, title: 'Item 1.0', pid: 0, pos: 0 },
  { id: 2, status: 1, title: 'Item 1.2', pid: 1, pos: 1 },
  { id: 3, status: 1, title: 'Item 1.1', pid: 1, pos: 0 },
  { id: 4, status: 1, title: 'Item 2.1', pid: 5, pos: 0 },
  { id: 5, status: 1, title: 'Item 2.0', pid: 0, pos: 1 },
  { id: 6, status: 1, title: 'Item 1.3', pid: 1, pos: 2 },
  { id: 7, status: 1, title: 'Item 1.2.1', pid: 2, pos: 0 },
]);

/**
 * import { Parent } from '../../../src/grid/pure/nestedList';
 */
class Parent extends Component
{
  constructor(props)
  {
    super(props);

    this.state = { active: false };
  }

  onClickButtonHandler = (event) =>
  {
    event.preventDefault();
    this.setState({ active: !this.state.active });
  }

  render()
  {
    const rotate = 270 * (+!this.state.active);

    return (
      <div style={{ padding: `0 0 1rem ${this.props.level * 2}rem` }}>
        <div className="pb-1 h-center pointer" onClick={this.onClickButtonHandler}>
          <IconArrow
            className={`w-2 h-2 rotate-${rotate}`}
            style={{ transition: 'all 0.2s ease-out' }}/>
          <span className="pl-1">{this.props.title}</span>
        </div>
        { this.state.active === true &&
        <div className="pt-1">
          {this.props.children}
        </div>
        }
      </div>
    );
  }
}


/**
 * import NestedList, { Menu as NestedListItem } from '../../src/grid/pure/nestedList';
 *
 * <NestedList
 *   nestedData={Menu.getNestedTree()}
 *   UI={NestedListItem(Menu)}
 * />
 */
const NestedListItem = ({ index, children, level, items }) =>
{
  if (children && children.length)
  {
    return (
      <Parent
        level={level}
        title={Menu.getItem(index.substring(1)).title}
      >
        {children}
      </Parent>
    );
  }

  return (
    <div className="" style={{ padding: `0 0 1rem ${Math.max(level + 3, 5)}rem` }}>
      {Menu.getItem(index.substring(1)).title}
    </div>
  );
};


/**
 * GridView + Filters + Connect + Paginate
 */
const Example = () =>
(
  <div className="card m-0 p-0 shadow-outer border border-white column h-screen">
    <div className="grid grow overflow">
      <div className="col-1-3 bg-white-semi-light p-4 scroll-y">
        <Connect>
          <NestedList
            nestedData={Menu.getNestedTree()}
            UI={NestedListItem}
          />
        </Connect>
      </div>
      <div className="col-2-3 border-left border-gray-light p-4 scroll-y">
        ...
      </div>

    </div>
  </div>
);

export default Example;
