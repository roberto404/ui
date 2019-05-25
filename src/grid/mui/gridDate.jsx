
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import capitalizeFirstLetter from '@1studio/utils/string/capitalizeFirstLetter';


/* !- React Elements */

import RaisedButton from 'material-ui/RaisedButton';
import Popover from 'material-ui/Popover';
import Paper from 'material-ui/Paper';
import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';

import {
  Table,
  TableBody,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

import IconDone from 'material-ui/svg-icons/action/done';
import { pinkA400 } from 'material-ui/styles/colors';

import
{
  Date,
}
from '../../form/mui';


/* !- Actions */

import { setValues } from '../../form/actions';


moment.locale('hu');

/**
 * Grid Date Filter Stateless Component
 * @example
 */
class GridDate extends Component
{
  constructor(props)
  {
    super(props);

    this.label = '-';

    this.state = {
      open: false,
    };
  }

  /* !- Handlers */

  onClickButtonHandler = (event) =>
  {
    event.preventDefault();

    this.setState({
      open: true,
      anchorEl: event.currentTarget,
    });
  }

  /* !- Listener */

  popoverCloseListener = () =>
  {
    this.setState({
      open: false,
    });
  }

  render()
  {
    const { options, changeValue, dateFrom, dateTo } = this.props;

    const list = options.map((getOption, index) =>
    {
      let option = getOption;

      if (typeof getOption === 'function')
      {
        option = getOption();
      }

      const active = (dateFrom === option.from && dateTo === option.to);

      if (active)
      {
        this.label = option.label;
      }

      return {
        ...option,
        active,
        index,
      };
    });

    return (
      <div>

        <RaisedButton
          onTouchTap={this.onClickButtonHandler}
          label={this.props.label + this.label}
        />

        <Popover
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
          targetOrigin={{ horizontal: 'left', vertical: 'top' }}
          onRequestClose={this.popoverCloseListener}
        >
          <Paper
            rounded={false}
          >
            <List>
              {
                list.map(({ index, label, active, from, to }) =>
                {
                  return (
                    <ListItem
                      key={index}
                      primaryText={label}
                      leftIcon={active ?
                        <IconDone color={pinkA400} />
                        :
                        <spam />
                      }
                      onClick={() =>
                      {
                        this.popoverCloseListener();
                        changeValue({ dateFrom: from, dateTo: to });
                      }}
                    />
                  );
                })
              }
            </List>
            {/* <Divider />
            <Subheader>Egyéni időszak</Subheader>
            <Table
              selectable={false}
            >
              <TableBody
                displayRowCheckbox={false}
              >
                <TableRow>
                  <TableRowColumn>
                    <Date
                      id="dateFrom"
                      label="mettől"
                      onChange={relay => changeValue({ [relay.id]: relay.value })}
                    />
                  </TableRowColumn>
                  <TableRowColumn>
                    <Date
                      id="dateTo"
                      label="meddig"
                      onChange={relay => changeValue({ [relay.id]: relay.value })}
                    />
                  </TableRowColumn>
                </TableRow>
              </TableBody>
            </Table> */}
          </Paper>
        </Popover>
      </div>
    );
  }
}


/**
 * propTypes
 * @type {Object}
 */
GridDate.propTypes =
{
  /**
   * Redux form state id
   */
  // id: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.shape({
        label: PropTypes.string,
        from: PropTypes.string,
        to: PropTypes.string,
      }),
      PropTypes.func,
    ]),
  ),
  /**
   * @private
   */
  dateFrom: PropTypes.string.isRequired,
  /**
   * @private
   */
  dateTo: PropTypes.string.isRequired,
  /**
   * Callback function that is fired when the input value changes.
   * setValues Form Action
   *
   * @private
   */
  changeValue: PropTypes.func.isRequired,
};



/**
 * defaultProps
 * @type {Object}
 */
GridDate.defaultProps =
{
  // id: 'date',
  options: [
    () => ({
      label: 'Ma',
      from: moment().startOf('day').format('x'),
      to: moment().endOf('day').format('x'),
    }),
    () => ({
      label: 'Héten',
      from: moment().startOf('week').format('x'),
      to: moment().endOf('week').format('x'),
    }),
    () => ({
      label: 'Jövő héten',
      from: moment().startOf('week').add(1, 'weeks').format('x'),
      to: moment().endOf('week').add(1, 'weeks').format('x'),
    }),
    () => ({
      label: capitalizeFirstLetter(moment().format('MMMM')),
      from: moment().startOf('month').format('x'),
      to: moment().endOf('month').format('x'),
    }),
    () => ({
      label: capitalizeFirstLetter(moment().subtract(1, 'months').format('MMMM')),
      from: moment().startOf('month').subtract(1, 'months').format('x'),
      to: moment().endOf('month').subtract(1, 'months').format('x'),
    }),
    {
      label: 'Összes',
      from: '',
      to: '',
    },
  ],
};

export default connect(
  (state, props) =>
  ({
    ...props,
    dateFrom: state.form.dateFrom || '',
    dateTo: state.form.dateTo || '',
  }),
  {
    changeValue: setValues,
  },
)(GridDate);
