
import React, { Component } from 'react';
import moment from 'moment';


/* !- React Elements */

import { Grid as GridView } from '../../../src/view';
import Connect from '../../../src/connect';
import NestedList from '../../../src/grid/pure/nestedList';
import Messages from '../../../src/grid/pure/nestedItems/messages';
import IconArrow from '../../../src/icon/mui/navigation/expand_more';


/* !- Constants */

import { DATE_FORMAT, DATETIME_FORMAT } from '../../../src/calendar/constants';
import { DATA, DATA_MESSAGES, SETTINGS } from './constants';

const fakeApi = () => new Promise(resolve => resolve({ status: 'SUCCESS', records: DATA }));
const fakeApiMessages = () => new Promise(resolve => resolve({ status: 'SUCCESS', records: DATA_MESSAGES }));



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
      <div style={{ padding: `0 0 1.5rem ${this.props.level * 2}rem` }}>
        <div className="h-center pointer" onClick={this.onClickButtonHandler}>
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



const NestedListItem = ({ index, children, level, items }) =>
{
  if (children)
  {
    return (
      <Parent
        level={level}
        title={index.substring(1)}
      >
        {children}
      </Parent>
    );
  }

  return (
    <div className="" style={{ padding: `0 0 1.5rem ${Math.max(level + 1, 3)}rem` }}>
      {items.name}
    </div>
  );
};


/**
 * GridView + Filters + Connect + Paginate
 */
const Example = () =>
(
  <div>
    <h1>NestedList</h1>

    <GridView
      id="sample"
      api={fakeApi}
      settings={SETTINGS}
    >
      <div className="p-2">
        <h2>Tree style nested list</h2>
        <Connect>
          <NestedList
            groupBy={['visits', 'gender']}
            UI={NestedListItem}
          />
        </Connect>
      </div>

    </GridView>

    <GridView
      id="sample-chat"
      api={fakeApiMessages}
      settings={SETTINGS}
      responseParser={({ records }) => records.map(record => ({
        ...record,
        createdDate: moment(record.createdDateTime, DATETIME_FORMAT).format(DATE_FORMAT),
      }))}
    >
      <div className="p-2">
        <h2>Chat style nested list (group by time and user)</h2>
        <Connect>
          <NestedList
            groupBy={['createdDate', 'userId']}
            UI={Messages}
            UiProps={{
              userId: 2,
            }}
          />
        </Connect>
      </div>

    </GridView>

  </div>
);

export default Example;
