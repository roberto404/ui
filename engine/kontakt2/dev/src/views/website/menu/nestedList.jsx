
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';


/* !- Redux Action */

import { setValues } from '@1studio/ui/form/actions';

/* !- React Elements */

import IconArrow from '@1studio/ui/icon/mui/navigation/expand_more';




class Parent extends Component
{
  constructor(props, context)
  {
    super(props);

    const register = context.register.data[props.registerID] || [];

    this.state = { active: register.indexOf(props.id) !== -1 };
  }

  onClickArrowHandler = () =>
  {
    /**
     * Save open or close state to register
     */
    if (this.props.registerID)
    {
      const register = this.context.register.data[this.props.registerID] || [];
      const index = register.indexOf(this.props.id);

      // closing
      if (this.state.active && index !== -1)
      {
        register.splice(index, 1);
      }
      // opening
      else if (this.state.active === false && index === -1)
      {
        register.push(this.props.id);
      }

      this.context.register.add({ [this.props.registerID]: register });
    }

    this.setState({ active: !this.state.active });
  }

  onClickTitleHandler = () =>
  {
    this.onClickArrowHandler();
    this.props.onClick();
  }

  render()
  {
    const rotate = 270 * (+!this.state.active);

    return (
      <div
        className={`${this.props.isActive ? 'active' : ''}`}
        style={{ padding: `0 0 1rem ${this.props.level * 2}rem` }}
      >
        <div className="pb-1 h-center">
          <IconArrow
            className={`w-2 h-2 rotate-${rotate} pointer`}
            style={{ transition: 'all 0.2s ease-out' }}
            onClick={this.onClickArrowHandler}
          />
          <div
            className="pl-1 pointer"
            onClick={this.onClickTitleHandler}
          >
            {this.props.title}
          </div>
        </div>
        { this.state.active === true &&
        <div className="pt-1">
          {this.props.children}
        </div>
        }
      </div>
    );
  }
};

Parent.contextTypes =
{
  store: PropTypes.object,
  register: PropTypes.object,
};

const NestedListItem = (Menu) =>
{
  const Item = ({ index, children, level, items, setValues, id }) =>
  {
    index = index.substring(1); // eslint-disable-line
    const isActive = parseInt(index) === parseInt(id);

    const onClickHandler = () =>
    {
      setValues(Menu.getItem(index), 'menu');
    }

    if (children && children.length)
    {
      return (
        <Parent
          level={level}
          id={index}
          registerID="menuParents"
          title={Menu.getItem(index).title}
          onClick={onClickHandler}
          isActive={isActive}
        >
          {children}
        </Parent>
      );
    }

    return (
      <div
        className={`pointer ${isActive ? 'active' : ''}`}
        style={{ padding: `0 0 1rem ${(level + 3)}rem` }}
        // style={{ padding: `0 0 1rem ${Math.max(level + 3, 5)}rem` }}
        onClick={onClickHandler}
      >
        {Menu.getItem(index).title}
      </div>
    );
  };

  return connect(
    ({ form }) => ({
      id: (form.menu || {}).id,
    }),
    {
      setValues,
    },
  )(Item);
};


export default NestedListItem;
