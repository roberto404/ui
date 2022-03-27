import React, { Component } from 'react';
import PropTypes from 'prop-types';


/* !- Redux Actions */

import { popover, menu, flush } from '../../../src/layer/actions';
import { setValues } from '../actions';


/* !- React Elements */

import Input from './input';
import IconClose from '../../icon/mui/navigation/close';
import IconArrowDown from '../../icon/mui/navigation/expand_more';
import classNames from 'classnames';


const Tags = (props) =>
{
  const items = (props.items || []).filter(i => typeof i === 'object' && i.title);

  return (
    <div className="h-center nowrap no-select">
      {
        items.map(({ id, title }, index) => (
          <div className="tag gray-light mx-1/2 rounded text-line-s v-center" key={`${index}-${id}`}>
            <span className='text-gray-dark'>{title}</span>
            <IconClose className="w-1 h-1 fill-gray-dark pointer hover:fill-black" onClick={() => props.onClose(index)} />
          </div>
        ))
      }
    </div>
  )
};

export const TagsMenu = (props, { store }) =>
{
  const items = (props.items || []).filter(i => typeof i === 'object' && i.title);

  const onClickMandatoryHandler = (a,b,c) =>
  {
    console.log(a,b,c);
    store.dispatch(flush());
  }

  const onClickStatusHandler = (a,b,c) =>
  {
    console.log(a,b,c);
    store.dispatch(flush());
  }

  const onClickHandler = (item, index, event) =>
  {
    const menuItems = [
      { id: 'mandatory', title: 'Kötelező', handler: onClickMandatoryHandler },
      { id: 'status', title: 'Inaktív', handler: onClickStatusHandler },
    ]

    store.dispatch(menu({ items: menuItems }, event));
  }

  return (
    <div className="h-center nowrap no-select">
      {
        items.map((item, index) => (
          <div
            className="tag gray-light mx-1/2 rounded text-line-s v-center  pointer hover:fill-black"
            key={`${index}-${item.id}`}
            onClick={(event) => onClickHandler(item, index, event)}
          >
            <span className='text-gray-dark'>{item.title}</span>
            <IconArrowDown className="w-1 h-1 fill-gray-dark" />
          </div>
        ))
      }
    </div>
  )
}

TagsMenu.contextTypes = 
{
  store: PropTypes.store,
}




/**
* Autocomplete Component
*/
class Autocomplete extends Component
{
  constructor(props)
  {
    super(props);

    this.state =
    {
      data: props.data.map(i => ({ handler: this.onClickMenuHandler, ...i })),
    }
  }

  getForm = () =>
    this.props.form || this.context.form;

  getState = () =>
    (this.context.store.getState().form[this.getForm()] || {})[this.props.id]
    || this.props.value || (this.props.multiple ? [] : '');


  /* !- Handlers */


  onChangeHandler = (value) =>
  {
    if (value.length && this.stateFormat(value).slice(-1) === ';')
    {
      this.submitInputValue();
      return;
    }

    if (typeof this.props.onChange === 'function')
    {
      this.props.onChange({ id: this.props.id, value });
    }
    else
    {
      this.context.store.dispatch(setValues({[this.props.id]: value}, this.getForm()));
    }

    if (this.props.multiple)
    {
      this.forceUpdate();
    }
  }
  
  onClickMenuHandler = (props) =>
  {
    if (typeof this.props.onSelect === 'function')
    {
      this.props.onSelect(props);
    }

    let value = props.title;

    if (this.props.multiple)
    {
      const item = { id: props.id, title: props.title };

      value = this.getState() || [];

      if (value.length && typeof value[value.length - 1] === 'object')
      {
        value.push(item);
      }

      /**
       * Empty yet or last value is string
       * [{id, title}..., <string>]
       */
      value[(value.length || 1) - 1] = item;
    }

    this.context.store.dispatch(flush());
    
    this.onChangeHandler(value);
  }

  onBlurHandler = () =>
  {
    this.removeShortcuts();

    /** Workaround:
     * If Input has value and you click to auto suggestion item:
     * 1. onBlur run fist and submit Input value and flush layer
     * 2. Menu click not will trigger
    */
     setTimeout(() => { this.submitInputValue(); }, 100);
    
  }

  onFocusHandler = (payload, event) =>
  {
    this.addShortcuts();
    this.showMenu(payload);
  }


  /**
   */
  onChangeInputHandler = (payload, { event }) =>
  {
    this.onFocusHandler(payload, event);
    this.onChangeHandler(payload.value);
  }

  onClickRemoveValueHandler = (index) =>
  {
    const stateValue = this.getState();

    this.onChangeHandler([...stateValue.slice(0, index), ...stateValue.slice(index + 1)]);
  }

  onEnterListener = (event) =>
  {
    event.preventDefault();
    this.submitInputValue();    
  }

  onBackspaceListener = (event) =>
  {
    const state = this.getState();
    const inputState = this.stateFormat(state);

    if (!inputState && state.length)
    {
      event.preventDefault();

      this.context.store.dispatch(flush());
      this.onChangeHandler(state.slice(0, -1)); 
    }
  }


  showMenu = (payload = {}, event) =>
  {
    const state = this.getState();
    let inputValue = payload.value;
    
    if (this.props.multiple && inputValue)
    {
      inputValue = typeof payload.value[payload.value.length - 1] === 'string' ? payload.value[payload.value.length - 1] : '';
    }

    // menu items
    const items = this.state.data
      .filter(record =>
        (this.props.multiple === false || !state.some(({ id }) => id === record.id))
        && (!inputValue || record.title.indexOf(inputValue) !== -1)
      );


    if (items.length)
    {
      this.context.store.dispatch(menu({ items }, event));
    }
    else
    {
      this.context.store.dispatch(flush());
    }
  }


  addShortcuts = () =>
  {
    if (this.context.addShortcuts)
    {
      if (this.props.multiple)
      {
        this.removeShortcuts(); // force Update always invoke focus event

        this.context.addShortcuts(
          [
            {
              keyCode: 'Enter',
              handler: this.onEnterListener,
              description: 'Submit tag',
            },
            {
              keyCode: 'Backspace',
              handler: this.onBackspaceListener,
              description: 'Remove last tag',
            },
          ],
          'enter',
        );
      }
    }
  }

  removeShortcuts = () =>
  {
    if (this.context.removeShortcuts)
    {
      this.context.removeShortcuts('enter');
    }
  }

  /**
   * This return will pass to redux
   * 
   * In case of multiple, value contains only input field value
   */
  format = (value, reduce) =>
  {
    if (this.props.multiple)
    {
      const stateValue = this.getState();

      // empty state
      if (!stateValue || !Array.isArray(stateValue))
      {
        return [value];
      }

      const lastValue = stateValue[stateValue.length - 1];

      // state is not empty (visible some tags) and new word first char on input field
      if (typeof value === 'string')
      {
        if (typeof lastValue === 'object' && lastValue.title)
        {
          stateValue.push(value);
        }
        else
        {
          stateValue.pop();
          stateValue.push(value);
        }
      }

      return stateValue;
    }

    return value;
  }
  
  stateFormat = (value) =>
  {
    if (this.props.multiple)
    {
      const lastValue = value[value.length - 1];

      return typeof lastValue === 'object' && lastValue.title ? '' : lastValue;
    }

    return value;
  }

  submitInputValue = () =>
  {
    const state = this.getState();
    const inputState = this.stateFormat(state);

    if (inputState)
    {
      if (this.props.multiple)
      {
        // remove ';' char
        const title = inputState.slice(0, (inputState.slice(-1) === ';' ? -1 : undefined));
        const item = { id: title, title };
  
        state[state.length - 1] = item;
      }

      this.context.store.dispatch(flush());
      this.onChangeHandler(state);
    }

  }

  /* !- Renders */

  render()
  {
    const state = this.getState();
    const Prefix = this.props.tags;

    return (
      <Input
        { ...this.props }
        className={classNames({
          [this.props.className]: true,
          "prefix-join": this.props.multiple,
          "postfix-inside": this.props.data.length,
        })}
        onChange={this.onChangeInputHandler}
        onFocus={this.onFocusHandler}
        onBlur={this.onBlurHandler}
        format={this.format}
        stateFormat={this.stateFormat}
        prefix={
          this.props.multiple ?
          <Prefix items={state} onClose={this.onClickRemoveValueHandler} /> : this.props.prefix
        }
        postfix={
          this.props.postfix || (this.props.data.length ? <IconArrowDown className="w-1 h-1 fill-gray" onClick={e => this.showMenu({}, e)}/> : undefined)
        }
      />
    );
  }
}

/**
 * propTypes
 * @override
 * @type {Object}
 */
Autocomplete.propTypes =
{
};

/**
 * defaultProps
 * @override
 * @type {Object}
 */
Autocomplete.defaultProps =
{
  tags: Tags,
  multiple: false,
  data: [],
};

Autocomplete.contextTypes =
{
  store: PropTypes.object,
  form: PropTypes.string,
  addShortcuts: PropTypes.func,
  removeShortcuts: PropTypes.func,
}


export default Autocomplete;
