
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import find from 'lodash/find';


/* !- React Elements */

import Chip from 'material-ui/Chip';
import Avatar from 'material-ui/Avatar';


/* !- Actions */

import { detachFilter } from '../actions';
import { unsetValues } from '../../form/actions';

function handleRequestDelete() {
  alert('You clicked the delete button.');
}
/**
* Grid Filters Stateless Component
*
* Show enabled filters
*/
const GridFilters = (
  {
    filters,
    hook,
    helpers,
    deleteValue,
  }
) =>
{
  return (
    <div>
      {
        filters.map(({ column, title, icon, value }) =>
        (
          <Chip
            key={`${column}-${value}`}
            onRequestDelete={() =>
            {
              deleteValue({ [column]: value });
            }}
          >
            <Avatar color="#444" icon={icon} />
            {title}
          </Chip>
        ))
      }
    </div>
  );
};


const mapStateToProps = ({ grid, form }) =>
{
  const filters = [];

  if (grid.hook === undefined)
  {
    return { filters };
  }

  Object.keys(grid.hook).forEach((column) =>
  {
    if (typeof form[column] !== 'undefined')
    {
      let titles = form[column];

      if (typeof titles !== 'object')
      {
        titles = [titles];
      }

      // const helperIndex = column.replace(/(.+)Id$/, '$1s');
      const helper = grid.helper[column];
      const icon = grid.hook[column].icon;

      titles.forEach((thisTitle) =>
      {
        let title = thisTitle;

        if (helper)
        {
          /**
           * Object helper
           * { 0: inactive, 1: active, ... }
           */
          if (typeof helper.length === 'undefined')
          {
            if (helper[title])
            {
              title = helper[title];
            }
          }
          /**
           * Array helper
           * [ { id: 0, title: 'inactive' }, ...]
           */
          else
          {
            const thisHelper = find(helper, { id: title });

            if (thisHelper && typeof thisHelper.title !== 'undefined')
            {
              title = thisHelper.title;
            }
          }
        }

        filters.push({
          column,
          title,
          icon,
          value: thisTitle,
        });
      });
    }
  });

  return { filters };
};

export default connect(
  mapStateToProps,
  {
    deleteValue: unsetValues,
  },
)(GridFilters);
