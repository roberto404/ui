
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import sum from 'lodash/sum';
import mean from 'lodash/mean';
import round from 'lodash/round';


/* !- React Elements */

import { Card, CardHeader } from 'material-ui/Card';
import IconFace from 'material-ui/svg-icons/action/face';

import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';


/**
 * Example Grid View: User Activity
 */
const PivotTable = (
  {
    dataModel,
    // api,
    // settings,
  },
) =>
{
  if (dataModel === undefined)
  {
    return <span />;
  }

  return (
    <div>
      <Card
        expanded={false}
        // onExpandChange={()=>true}
      >
        <CardHeader
          title="Összes foglalás"
          subtitle={round(dataModel.getPivotTable('person', mean), 1)}
          // avatar={
          //   <IconMenu
          //     iconButtonElement={<IconButton><IconFace /></IconButton>}
          //     // open={true}
          //     // onRequestChange={this.handleOnRequestChange}
          //   >
          //     <MenuItem value="1" primaryText="Windows App" />
          //     <MenuItem value="2" primaryText="Mac App" />
          //     <MenuItem value="3" primaryText="Android App" />
          //     <MenuItem value="4" primaryText="iOS App" />
          //   </IconMenu>
          // }
          // subtitle={this.store._data.getResults().length}
          // showExpandableButton
        />
      </Card>
    </div>
  );
};


/**
 * propTypes
 * @type {Object}
 */
PivotTable.propTypes =
{
};

/**
 * defaultProps
 * @type {Object}
 */
PivotTable.defaultProps =
{
};


export default connect(
  (state, props) => ({
    ...props,
    dataModel: state.grid.model,
    data: state.grid.data,
  }),
)(PivotTable);
