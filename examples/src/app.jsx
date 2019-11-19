
import React, { Component } from 'react';
import Tree from '@1studio/utils/models/tree';


/* !- React Elements */

import Connect from '../../src/connect';
import NestedList, { Menu as NestedListItem } from '../../src/grid/pure/nestedList';
import Layer from '../../src/layer';


/* !- Constants */

import Examples from './examples';

const ExamplesTree = [];

Object.keys(Examples).forEach((parent, parentIndex) =>
{
  const parentId = ExamplesTree.length + 1;

  ExamplesTree.push({
    id: parentId,
    status: 1,
    title: parent,
    pid: 0,
    pos: parentIndex,
  });

  Object.keys(Examples[parent]).forEach((child, childIndex) =>
  {
    const childId = ExamplesTree.length + 1;

    ExamplesTree.push({
      id: childId,
      status: 1,
      title: child,
      pid: parentId,
      pos: childIndex,
    });
  });
});


const Menu = new Tree(ExamplesTree);

/**
 * [Content description]
 * @extends Component
 */
class Content extends Component
{
  constructor(props)
  {
    super(props);

    this.state = {
      title: 'Form / Fields',
      component: Examples.form.fields,
    };
  }

  onClickItemHandler = ({ pid, title }) =>
  {
    const parent = Menu.getItem(pid);

    this.setState({
      title: `${parent.title} / ${title}`,
      component: Examples[parent.title][title],
    });
  }

  render()
  {
    return (
      <div className="column h-screen">
        <div className="px-4 py-2 grow overflow grid">
          <div className="col-1-4 scroll-y bg-gray-light p-2">
            <Connect>
              <NestedList
                nestedData={Menu.getNestedTree()}
                UI={NestedListItem(Menu, this.onClickItemHandler)}
              />
            </Connect>
          </div>
          <div className="scroll-y bg-white-light p-2">
            <h2>{this.state.title}</h2>
            <div>
              {React.createElement(this.state.component)}
            </div>
          </div>
        </div>
      </div>
    );
  }
}


export default () =>
(
  <div className="application">
    <Content />
    <Layer />
  </div>
);
