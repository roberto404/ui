
import React, { Component } from 'react';
import Tree from '@1studio/utils/models/tree';
import getParam from '@1studio/utils/location/getParam';
import PropTypes from 'prop-types';


/* !- React Elements */

import Connect from '../../src/connect';
import NestedList, { Menu as NestedListItem } from '../../src/grid/pure/nestedList';
import Layer from '../../src/layer';
import GitHubIcon from '../../src/icon/la/github';

import IconForward from '../../src/icon/mui/navigation/arrow_forward';


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


  getChildContext()
  {
    return {
      // api: this.injectedApi,
      // media: this.state.media,
      register: this.props.app.register,
      // config: this.props.app.getProjectConfig(),
      addListener: this.props.app.addListener,
      removeListener: this.props.app.removeListener,
      addShortcuts: this.props.app.addShortcuts,
      removeShortcuts: this.props.app.removeShortcuts,
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

  onClickForwardHandler = () =>
  {
    const parent = Menu.getTree().find(({ title }) => title === this.state.path[0]);
    const item = Menu.getTree().find(({ title, pid }) => pid === parent.id && title === this.state.path[1]);

    const siblings = Menu.getChildren(parent.id);

    const nextPos = item.pos + 1;

    this.onClickItemHandler(siblings.find(({ pos }) => pos === (siblings.length > nextPos ? nextPos : 0)));
  }

  render()
  {
    if (
      this.state.path[0] === 'sticky'
    )
    {
      return React.createElement(this.state.component)
    }


    return (
      <div className="column h-screen">
        <div className="px-4 py-2 grow overflow grid">
          <div className="col-1-4 mobile:hidden scroll-y bg-gray-light p-2 no-select">
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

              <div className="button gray shadow my-4 inline-block w-auto" onClick={this.onClickForwardHandler}>
                <IconForward />
              </div>

            </div>
          </div>
        </div>
      </div>
    );
  }
}

/**
 * childContextTypes
 * @type {Object}
 */
Content.childContextTypes = {
  // api: PropTypes.func,
  // media: PropTypes.string,
  register: PropTypes.object,
  config: PropTypes.object,
  addListener: PropTypes.func,
  removeListener: PropTypes.func,
  addShortcuts: PropTypes.func,
  removeShortcuts: PropTypes.func,
};


export default (props) =>
(
  <div className="application">
    <Content {...props} />
    <Layer />
  </div>
);
