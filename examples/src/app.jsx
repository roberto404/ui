
import React, { Component } from 'react';
import Tree from '@1studio/utils/models/tree';
import getParam from '@1studio/utils/location/getParam';


/* !- React Elements */

import Connect from '../../src/connect';
import NestedList, { Menu as NestedListItem } from '../../src/grid/pure/nestedList';
import Layer from '../../src/layer';
import GitHubIcon from '../../src/icon/la/github';


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

    let example = getParam('example').split('/');

    if (example.length !== 2)
    {
      example = ['form', 'fields'];
    }

    this.state = {
      title: `${example[0]} / ${example[1]}`,
      component: Examples[example[0]][example[1]],
      path: example,
    };
  }

  onClickItemHandler = ({ pid, title }) =>
  {
    const parent = Menu.getItem(pid);

    this.setState({
      title: `${parent.title} / ${title}`,
      component: Examples[parent.title][title],
      path: [parent.title, title],
    });
  }

  onClickGitHubHandler = () =>
  {
    const url = `https://github.com/roberto404/ui/blob/master/examples/src/${this.state.path[0]}/${this.state.path[1]}.jsx`;
    const newTab = window.open(url, '_blank');
    newTab.focus();
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
            <div className="relative">
              <button className="w-auto pin-r absolute" onClick={this.onClickGitHubHandler}>
                <GitHubIcon className="text-xxl" />
              </button>
              <h2>{this.state.title}</h2>
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
