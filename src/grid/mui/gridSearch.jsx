
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import forEach from 'lodash/forEach';
import * as Filters from '../filters';

/* !- React Elements */

// import Paper from 'material-ui/Paper';
// import Menu from 'material-ui/Menu';
// import MenuItem from 'material-ui/MenuItem';
import Input from '../../form/mui/input';


/* !- Actions */

import { setValues } from '../../form/actions';



/**
* Grid Search Stateless Component
*
* Connected to grid state via Redux.
* @example
// id same Redux form[id] and grid.filters[id]

<GridSearch
  id="search"
/>
*/
const GridSearch = (
  {
    id,
    label,
    term,
    autocomplete,
    changeValue,
    hook,
  },
) =>
{


  const style = {
    position: 'absolute',
    zIndex: 2,
    width: '100%',
  };

  const menuItems = [];

  if (term !== undefined && typeof autocomplete === 'object')
  {
    forEach(autocomplete, (items, column) =>
    {
      if (Array.isArray(items))
      {
        items.forEach((item) =>
        {
          let subject = '';

          if (typeof item.title === 'string')
          {
            subject = item.title;
          }
          else if (typeof hook[column] !== 'undefined' && typeof hook[column].format === 'function')
          {
            subject = hook[column].format({ value: item.id, helper: autocomplete, column });
          }

          if (Filters.compare._default(subject, term))
          {
            menuItems.push({
              id: item.id,
              column,
              title: subject,
            })
          }
        });
      }
      else
      {
        forEach(items, (title, index) =>
        {
          if (Filters.compare._default(title, term))
          {
            menuItems.push({
              id: index,
              column,
              title,
            });
          }
        });
      }
    });
  }


  const onItemTouchTapHandler = (event, element, index) =>
  {
    const item = menuItems[index];
    changeValue({ [item.column]: item.id });
  }

  return (
    <div>
      <Input
        id={id}
        onChange={({ value }) =>
        {
          changeValue({ [id]: value });
        }}
        label={label}
      />
      {/* { menuItems.length > 0 &&
      <Paper style={style}>
        <Menu
          disableAutoFocus
          desktop
          initiallyKeyboardFocused
          maxHeight={220}
          onItemTouchTap={onItemTouchTapHandler}
        >
          {
            menuItems.slice(0, 10).map(({ title }) => <MenuItem primaryText={title} />)
          }
        </Menu>
      </Paper>
      } */}
    </div>
  );
};


/**
 * propTypes
 * @type {Object}
 */
GridSearch.propTypes =
{
  /**
   * Redux form state id
   */
  id: PropTypes.string,
  label: PropTypes.string,
  /**
   * Callback function that is fired when the input value changes.
   * setValues Form Action
   *
   * @param {integer} nextPage
   */
  changeValue: PropTypes.func.isRequired,
};

/**
 * defaultProps
 * @type {Object}
 */
GridSearch.defaultProps =
{
  id: 'search',
  label: 'Search',
};

const mapStateToProps = ({ grid, form }, { id, autocomplete, label }) =>
{
  // if (autocomplete === undefined)
  // {
    return {
      id,
      label,
    };
  // }
  //
  // if (id === undefined)
  // {
  //   id = 'search';
  // }
  //
  // console.log(grid);
  //
  // return {
  //   hook: grid.hook,
  //   term: form[id],
  //   id,
  //   autocomplete,
  // };
};

export default connect(
  mapStateToProps,
  {
    changeValue: setValues,
  },
)(GridSearch);
