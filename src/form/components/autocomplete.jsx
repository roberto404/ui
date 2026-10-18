import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MergedContexts } from '../../context';
import { bindFormContexts } from '../context';
import { useAppContext } from '../../context';


/* !- Redux Actions */

import { popover, menu, updateMenu, flush } from '../../layer/actions';
import { setValues } from '../actions';


/* !- React Elements */

import Input from './input';
import IconClose from '../../icon/mui/navigation/close';
import IconArrowDown from '../../icon/mui/navigation/expand_more';
import classNames from 'classnames';


/**
 * Tag: { id, title }
 * Szabad szöveg (freeText): { text }
 * Utolsó string elem: az input mező értéke, itt nem jelenik meg
 */
export const isTag = item => !!item && typeof item === 'object' && typeof item.text === 'undefined' && !!item.title;
export const isText = item => !!item && typeof item === 'object' && typeof item.text === 'string';

const Tags = (props) => (
  <div className='scroll' style={{ maxWidth: '100%' }}>
    <div className="h-center nowrap no-select">
      {
        (props.items || []).map((item, index) => {
          if (isText(item)) {
            return <span className="text-gray-dark" key={`${index}-text`}>{item.text}</span>;
          }

          if (!isTag(item)) {
            return null;
          }

          return (
            <div className="tag gray-light mx-1/2 rounded text-line-s v-center" key={`${index}-${item.id}`}>
              <span className='text-gray-dark'>{item.title}</span>
              <IconClose className="w-1 h-1 fill-gray-dark pointer hover:fill-black" onClick={() => props.onClose(index)} />
            </div>
          );
        })
      }
    </div>
  </div>
);

export const TagsMenu = (props) => {
  const { store } = useAppContext();
  const items = (props.items || []).filter(i => typeof i === 'object' && i.title);

  const onClickMandatoryHandler = (a, b, c) => {
    store.dispatch(flush());
  }

  const onClickStatusHandler = (a, b, c) => {
    store.dispatch(flush());
  }

  const onClickHandler = (item, index, event) => {
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




/**
 * freeText: a gépelt szöveg végén álló keresőszó (pl. "méret, szí" → "szí")
 */
const SEARCH_TERM_REGEX = /[^\s,.;:/()\-]*$/;

const SHORTCUTS_NAME = 'autocomplete';

const getSearchTerm = (value = '') => (value.match(SEARCH_TERM_REGEX) || [''])[0];


/**
* Autocomplete Component
*
* @example multiple: tagek, a gépelt szóból Enter/blur/';' után tag lesz
* <Autocomplete id="options" data={[{ id, title }]} multiple />
* // => [{ id, title }, ..., '<input value>']
*
* @example freeText: tagek és szabad szöveg vegyesen, a gépelt szó végére ajánl
* <Autocomplete id="template" data={[{ id, title }]} multiple freeText />
* // => [{ id, title }, { text: ', ' }, { id, title }, '<input value>']
*
* @example inlineSuggestion: faded first suggestion in the input, no menu
* <Autocomplete id="search" data={[{ id, title }]} inlineSuggestion suggestionMenu={false} />
*
* @example format / stateFormat: store value <-> component value (like Field)
* <Autocomplete
*   id="template_subtitle"
*   data={[{ id: '{features/10}', title: 'Szín' }]}
*   stateFormat={value => parseTemplate(value, titles)}
*   format={stringifyTemplate}
*   multiple
*   freeText
* />
* // => redux: '{features/10}, ...'
*
* @example custom menu: row, sticky header / footer, async data
* <Autocomplete
*   id="product"
*   data={apiResults}
*   filter={false}
*   limit={5}
*   rowElement={({ item, focus }) => <Row product={item} focus={focus} />}
*   headerElement={({ records }) => <div>{records.length} találat</div>}
*   footerElement={({ isAll, showAll }) => !isAll && <a onClick={showAll}>Összes</a>}
*   menuFullWidth
* />
*/
class Autocomplete extends Component {
  getForm = () =>
    this.props.form || this.context.form;

  getStoreValue = () => {
    const form = this.getForm();
    const state = this.context.store.getState().form;

    // no form: the value is in the root of the form state (like FormField)
    return ((form ? state[form] : state) || {})[this.props.id] || this.props.value;
  }

  /**
   * Store value -> component value (props.stateFormat like Field)
   */
  getState = () =>
    this.props.stateFormat(this.getStoreValue()) || (this.props.multiple ? [] : '');

  /**
   * multiple: the tags (prefix) render from the store value -> rerender if it changes
   * inlineSuggestion: the faded completion as well
   */
  componentDidMount() {
    if ((this.props.multiple || this.props.inlineSuggestion) && this.context.store) {
      this.storeValue = this.getStoreValue();

      this.unsubscribe = this.context.store.subscribe(() => {
        const storeValue = this.getStoreValue();

        if (storeValue !== this.storeValue) {
          this.storeValue = storeValue;
          this.forceUpdate();
        }
      });
    }
  }

  /**
   * async data (ex. API search result) / limit changed -> the open menu follows it
   */
  componentDidUpdate(prevProps) {
    // async data: no keyboard handling was added on focus while the data was empty
    if (this.isFocused && !prevProps.data.length !== !this.props.data.length) {
      this.addShortcuts();
    }

    if (prevProps.data !== this.props.data || prevProps.limit !== this.props.limit) {
      this.refreshMenu();
    }
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }

    this.removeShortcuts();
  }

  /**
   * multiple: always a copy, never mutate redux state / props
   */
  getStateArray = () => {
    const state = this.getState();

    return Array.isArray(state) ? [...state] : [];
  }

  getInputValue = (state = this.getState()) => this.inputStateFormat(state);

  /**
   * Search term of the input value (freeText: the last word), lowercase
   */
  getTerm = (inputValue = '') =>
    ((this.props.freeText ? getSearchTerm(inputValue) : inputValue) || '').toString().toLowerCase();

  /**
   * Every record of data which matches the input value (without limit)
   */
  getMatchedRecords = (inputValue = '') => {
    const { multiple, filter } = this.props;
    const state = multiple ? this.getStateArray() : [];
    const term = this.getTerm(inputValue);

    return this.props.data
      .filter(record =>
        (multiple === false || !state.some(item => isTag(item) && item.id === record.id))
        && (
          filter === false
          || !term
          || (typeof filter === 'function' ?
            filter(record, term) : record.title.toString().toLowerCase().indexOf(term) !== -1)
        )
      );
  }

  getLimit = () =>
    (this.isShowAll ? Infinity : this.props.limit);

  getMenuItems = (inputValue = '', records = this.getMatchedRecords(inputValue), minCount = 0) =>
    records
      .slice(0, Math.max(this.getLimit(), minCount))
      .map(i => ({ handler: this.onClickMenuHandler, ...i }));

  /**
   * Records / items / focused index of the menu
   * selectedValue (single, opening by focus / arrow): if it is the title of a record (selected value),
   * every record is listed and the selected one is focused -> the menu opens at the same place
   */
  getMenuState = (inputValue = '', selectedValue) => {
    if (!this.props.multiple && typeof selectedValue === 'string' && selectedValue) {
      const records = this.getMatchedRecords('');
      const value = selectedValue.toLowerCase();
      const index = records.findIndex(record => record.title.toString().toLowerCase() === value);

      if (index !== -1) {
        return { records, items: this.getMenuItems('', records, index + 1), term: '', index, isSelected: true };
      }
    }

    const records = this.getMatchedRecords(inputValue);

    return {
      records,
      items: this.getMenuItems(inputValue, records),
      term: this.getTerm(inputValue),
      index: 0,
      isSelected: false,
    };
  }

  /**
   * inlineSuggestion: the first suggestion which starts with the input value
   * @return {string} title of the suggestion or ''
   */
  getInlineSuggestion = (inputValue = this.getInputValue()) => {
    if (!this.props.inlineSuggestion || this.props.multiple || typeof inputValue !== 'string' || !inputValue) {
      return '';
    }

    const term = inputValue.toLowerCase();
    const item = this.props.data.find(record => record.title.toString().toLowerCase().indexOf(term) === 0);

    return item ? item.title.toString() : '';
  }


  /* !- Handlers */


  onChangeHandler = (value, options) => {
    if (
      !this.props.freeText
      && value.length
      && (this.inputStateFormat(value) || '').slice(-1) === ';'
    ) {
      this.submitInputValue();
      return;
    }

    // component value -> store value (props.format like Field)
    const formattedValue = this.props.format(value);

    if (typeof this.props.onChange === 'function') {
      this.props.onChange({ id: this.props.id, value: formattedValue }, options);
    }
    else {
      this.context.store.dispatch(setValues({ [this.props.id]: formattedValue }, this.getForm()));
    }

    if (this.props.multiple || this.props.inlineSuggestion) {
      this.forceUpdate();
    }
  }

  onClickMenuHandler = (props) => {
    let value = props.title;

    if (typeof this.props.onSelect === 'function') {
      const respond = this.props.onSelect(props, { target: this });

      if (respond === false) {
        return;
      }
      else if (respond) {
        value = respond;
      }
    }

    if (this.props.multiple) {
      const item = { id: props.id, title: props.title };

      value = this.getStateArray();

      const lastValue = value[value.length - 1];

      // [{id, title}..., <string>] input value replaced by the tag
      if (typeof lastValue === 'string') {
        value.pop();

        // freeText: only the search term replaced, the text before it stays
        if (this.props.freeText) {
          const text = lastValue.slice(0, lastValue.length - getSearchTerm(lastValue).length);

          if (text) {
            value.push({ text });
          }
        }
      }

      value.push(item);
    }

    this.menuItems = [];
    this.isMenuPending = false;
    this.isSelectedMenu = false;
    this.context.store.dispatch(flush());

    this.onChangeHandler(value);
  }

  onBlurHandler = () => {

    this.isFocused = false;
    this.isMenuPending = false;
    this.isSelectedMenu = false;
    this.removeShortcuts();
    this.menuItems = [];

    /** Workaround:
     * If Input has value and you click to auto suggestion item:
     * 1. onBlur run fist and submit Input value and flush layer
     * 2. Menu click not will trigger
    */
    if (!this.props.freeText) {
      setTimeout(() => { this.submitInputValue(); }, 100);
    }
  }

  onFocusHandler = (payload, event) => {

    this.isFocused = true;
    this.addShortcuts();

    if (event && (!this.props.freeText || getSearchTerm(this.getInputValue()))) {
      this.showMenu(payload, event, payload?.value);
    }
  }


  /**
   */
  onChangeInputHandler = (payload, { event }) => {
    // new search: the limit is back (showAll)
    if (event) {
      this.isShowAll = false;
    }

    // no event: initial value on mount (FormField props.value / default) -> no menu
    if (!event) {
      this.menuItems = [];
    }
    // freeText: menu only for a search term (not after space, comma...)
    else if (this.props.freeText && !getSearchTerm(this.inputStateFormat(payload.value))) {
      this.menuItems = [];
      this.isMenuPending = false;
      this.context.store.dispatch(flush());
    }
    else {
      this.showMenu(payload, event);
    }

    this.onChangeHandler(payload.value);
  }

  onClickRemoveValueHandler = (index) => {
    const stateValue = this.getStateArray();

    this.onChangeHandler([...stateValue.slice(0, index), ...stateValue.slice(index + 1)]);
  }

  onEnterListener = (event) => {
    const focusedItem = this.isMenuVisible() && this.menuItems[this.menuIndex];

    if (focusedItem) {
      event.preventDefault();
      this.onClickMenuHandler(focusedItem);
      return;
    }

    // single: Enter not handled (form)
    if (!this.props.multiple) {
      return;
    }

    event.preventDefault();

    // freeText: Enter = first suggestion of the search term
    if (this.props.freeText) {
      const inputValue = this.getInputValue();
      const [item] = getSearchTerm(inputValue) ? this.getMenuItems(inputValue) : [];

      if (item) {
        this.onClickMenuHandler(item);
      }

      return;
    }

    this.submitInputValue();
  }

  onBackspaceListener = (event) => {
    const state = this.getStateArray();

    if (this.getInputValue(state)) {
      return;
    }

    // empty input string
    if (typeof state[state.length - 1] === 'string') {
      state.pop();
    }

    if (!state.length) {
      return;
    }

    event.preventDefault();

    this.context.store.dispatch(flush());

    state.pop();

    // freeText: previous text back to the input
    if (isText(state[state.length - 1])) {
      state.push(state.pop().text);
    }

    this.onChangeHandler(state);
  }


  /**
   * @param {object} payload { value } filter of the records
   * @param {object} event
   * @param {string} [selectedValue] opening (focus / arrow): the selected value is focused (see getMenuState)
   */
  showMenu = ({ value } = {}, event, selectedValue) => {
    if (!this.props.suggestionMenu) {
      this.menuItems = [];
      return;
    }

    let inputValue = value;

    if (this.props.multiple) {
      inputValue = Array.isArray(value) ? this.inputStateFormat(value) : (typeof value === 'string' ? value : '');
    }

    const { records, items, term, index, isSelected } = this.getMenuState(inputValue || '', selectedValue);

    // the first (or the selected) item is focused by default -> Enter selects it
    this.menuItems = items;
    this.menuRecords = records;
    this.menuTerm = term;
    this.menuIndex = index;
    this.isSelectedMenu = isSelected;
    this.menuAnchor = this.getMenuAnchor(event);
    // async data (ex. API search): the menu opens when the data arrives
    this.isMenuPending = true;

    if (items.length) {
      this.openMenu();
    }
    else {
      this.context.store.dispatch(flush());
    }
  }

  /**
   * The menu is positioned to this element
   * menuFullWidth: the row of the input (prefix + input + postfix)
   */
  getMenuAnchor = (event = {}) => {
    const target = event.currentTarget || event.target;

    if (!this.props.menuFullWidth || !target || typeof target.closest !== 'function') {
      return target;
    }

    const input = target.tagName === 'INPUT' ?
      target : target.closest('.field')?.querySelector('input');

    return input?.parentElement || target;
  }

  openMenu = () => {
    const anchor = this.menuAnchor;
    const options = this.props.menuFullWidth && anchor ?
      { containerStyle: { width: anchor.offsetWidth } } : {};

    this.context.store.dispatch(menu(this.getMenuProps(), { currentTarget: anchor }, options));
  }

  /**
   * Data (ex. async API result) or limit changed: refresh the open menu,
   * or open it if it waits for the data
   */
  refreshMenu = () => {
    const isVisible = this.isMenuVisible();

    if (!this.isFocused || !this.props.suggestionMenu || (!isVisible && !this.isMenuPending)) {
      return;
    }

    const inputValue = this.getInputValue();
    const { records, items, term, isSelected } = this.getMenuState(
      inputValue || '',
      this.isSelectedMenu ? inputValue : undefined,
    );

    this.menuItems = items;
    this.menuRecords = records;
    this.menuTerm = term;
    this.menuIndex = Math.min(this.menuIndex || 0, Math.max(items.length - 1, 0));
    this.isSelectedMenu = isSelected;

    if (!items.length) {
      if (isVisible) {
        this.context.store.dispatch(flush());
      }
    }
    else if (isVisible) {
      this.context.store.dispatch(updateMenu(this.getMenuProps()));
    }
    else if (this.menuAnchor) {
      this.openMenu();
    }
  }

  /**
   * Header / footer: show every matched record (no limit) until the next search
   */
  showAll = () => {
    this.isShowAll = true;
    this.refreshMenu();
  }

  /**
   * The menu of this component is visible
   */
  isMenuVisible = () => {
    const { layer = {} } = this.context.store.getState();

    return !!this.menuItems?.length && layer.active && layer.method === 'popover';
  }

  /**
   * ArrowUp / ArrowDown: move the focus in the menu
   * @param {number} direction -1 | +1
   */
  onArrowListener = direction => (event) => {
    event.preventDefault();

    // closed menu: open by the input field
    if (!this.isMenuVisible()) {
      const inputValue = this.getInputValue();

      this.showMenu({ value: inputValue }, { currentTarget: event.target }, inputValue);

      return;
    }

    const length = this.menuItems.length;

    this.menuIndex = (this.menuIndex + direction + length) % length;

    this.context.store.dispatch(updateMenu(this.getMenuProps()));
  }

  /**
   * Arrow icon: keep the focus of the input (mousedown would blur it -> shortcuts removed)
   */
  onMouseDownArrowHandler = (event) => {
    event.preventDefault();
  }

  /**
   * Arrow icon: focus the input (shortcuts: ArrowUp / ArrowDown / Enter) and show every suggestion
   */
  onClickArrowHandler = (event) => {
    const input = event.currentTarget.closest('.field')?.querySelector('input');

    if (input && document.activeElement !== input) {
      input.focus();
    }

    this.showMenu({}, { currentTarget: input || event.currentTarget }, this.getInputValue());
  }

  /**
   * Menu props: focused item, custom rows (rowElement), header / footer
   * headerElement / footerElement props: the props of Autocomplete +
   * { data, records (every match), items (visible), term, isAll, showAll }
   */
  getMenuProps = () => {
    const {
      rowElement: Row,
      headerElement: Header,
      footerElement: Footer,
    } = this.props;

    const term = this.menuTerm || '';

    const items = this.menuItems.map((item, index) => {
      const focus = index === this.menuIndex;

      return {
        ...item,
        className: classNames(item.className, { focus }),
        element: Row ? <Row item={item} index={index} focus={focus} term={term} /> : undefined,
      };
    });

    const partProps = {
      ...this.props,
      records: this.menuRecords || [],
      items: this.menuItems,
      term,
      isAll: this.menuItems.length >= (this.menuRecords || []).length,
      showAll: this.showAll,
    };

    return {
      items,
      header: Header ? <Header {...partProps} /> : undefined,
      footer: Footer ? <Footer {...partProps} /> : undefined,
      // clicking the header / footer / scrollbar does not blur the input (-> no submit, menu stays)
      keepFocus: !!(Row || Header || Footer),
    };
  }


  addShortcuts = () => {

    // no menu: no keyboard handling (Tab leaves the field as usual)
    if (this.context.addShortcuts && this.props.data.length && !this.props.suggestionMenu) {
      this.removeShortcuts();
    }
    else if (this.context.addShortcuts && this.props.data.length) {
      this.removeShortcuts(); // force Update always invoke focus event

      this.context.addShortcuts(
        [
          {
            keyCode: 'ArrowDown',
            handler: this.onArrowListener(+1),
            description: 'Next suggestion',
          },
          {
            keyCode: 'ArrowUp',
            handler: this.onArrowListener(-1),
            description: 'Previous suggestion',
          },
          {
            keyCode: 'Enter',
            handler: this.onEnterListener,
            description: 'Select suggestion / submit tag',
          },
          ...(this.props.multiple ? [{
            keyCode: 'Backspace',
            handler: this.onBackspaceListener,
            description: 'Remove last tag',
          }] : []),
        ],
        SHORTCUTS_NAME,
      );
    }
    else if (this.context.addShortcuts && this.props.multiple) {
      this.removeShortcuts();

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
        SHORTCUTS_NAME,
      );
    }
  }

  removeShortcuts = () => {
    if (this.context.removeShortcuts) {
      this.context.removeShortcuts(SHORTCUTS_NAME);
    }
  }

  /**
   * Input field value -> component value
   * (multiple: the input value is the last string item of the tokens)
   */
  inputFormat = (value, reduce) => {
    if (this.props.multiple) {
      const stateValue = this.getStateArray();

      if (typeof value === 'string') {
        // last item is the input value -> replace
        if (typeof stateValue[stateValue.length - 1] === 'string') {
          stateValue.pop();
        }

        stateValue.push(value);
      }

      return stateValue;
    }

    return value;
  }

  inputStateFormat = (value) => {
    if (this.props.multiple) {
      if (!Array.isArray(value)) {
        return typeof value === 'string' ? value : '';
      }

      const lastValue = value[value.length - 1];

      return typeof lastValue === 'string' ? lastValue : '';
    }

    return value;
  }

  submitInputValue = () => {
    // single: the value is the input string (getStateArray() would be [] -> value lost)
    if (!this.props.multiple) {
      const state = this.getState();

      if (state) {
        this.context.store.dispatch(flush());
        this.onChangeHandler(state);
      }

      return;
    }

    const state = this.getStateArray();
    const inputState = this.getInputValue(state);

    if (inputState) {
      // remove ';' char
      const title = inputState.slice(0, (inputState.slice(-1) === ';' ? -1 : undefined));
      const item = { id: title, title };

      state[state.length - 1] = item;

      this.context.store.dispatch(flush());
      this.onChangeHandler(state);
    }
  }

  /* !- Renders */

  render() {
    const state = this.getState();
    const Prefix = this.props.tags;
    const {
      freeText,
      inlineSuggestion,
      suggestionMenu,
      rowElement,
      headerElement,
      footerElement,
      limit,
      filter,
      menuFullWidth,
      ...props
    } = this.props;
    const hasMenuArrow = this.props.data.length && suggestionMenu;

    return (
      <Input
        {...props}
        className={classNames({
          [this.props.className]: true,
          "prefix-join": this.props.multiple,
          "postfix-inside prefix-80": hasMenuArrow,
        })}
        suggestion={inlineSuggestion ? this.getInlineSuggestion() : undefined}
        onChange={this.onChangeInputHandler}
        onFocus={this.onFocusHandler}
        onBlur={this.onBlurHandler}
        format={this.inputFormat}
        stateFormat={value => this.inputStateFormat(this.props.stateFormat(value))}
        prefix={
          this.props.multiple ?
            <Prefix items={state} onClose={this.onClickRemoveValueHandler} /> : this.props.prefix
        }
        postfix={
          this.props.postfix || (hasMenuArrow ? <IconArrowDown
              className="w-1 h-1 fill-gray pointer"
              onMouseDown={this.onMouseDownArrowHandler}
              onClick={this.onClickArrowHandler}
            /> : undefined)
        }
      />
    );
  }
}

Autocomplete.propTypes =
{
  multiple: PropTypes.bool,
  /**
   * multiple mode: free text between the tags ({ text }), the search term is the last word of the input
   */
  freeText: PropTypes.bool,
  /**
   * Faded completion in the input: the first suggestion which starts with the value
   * (only shown, single mode only)
   */
  inlineSuggestion: PropTypes.bool,
  /**
   * Show the suggestions in a popover menu (ArrowUp / ArrowDown / Enter)
   */
  suggestionMenu: PropTypes.bool,
  /**
   * component value -> store value
   */
  format: PropTypes.func,
  /**
   * store value -> component value
   */
  stateFormat: PropTypes.func,
  /**
   * Custom menu row: ({ item, index, focus, term }) => element
   * item = the data record (+ handler)
   */
  rowElement: PropTypes.elementType,
  /**
   * Sticky menu header, props: the props of Autocomplete +
   * { data, records (every match), items (visible), term, isAll, showAll() }
   * @example ({ records }) => <div>{records.length} találat</div>
   */
  headerElement: PropTypes.elementType,
  /**
   * Sticky menu footer, props like headerElement
   */
  footerElement: PropTypes.elementType,
  /**
   * Max number of visible suggestions (showAll() removes it until the next search)
   */
  limit: PropTypes.number,
  /**
   * Filter of data by the search term
   * true: title contains the term, false: no filter (ex. already filtered by the API),
   * function: (record, term) => bool (term is lowercase)
   */
  filter: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  /**
   * The menu is as wide as the field (prefix + input + postfix)
   */
  menuFullWidth: PropTypes.bool,
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
  freeText: false,
  inlineSuggestion: false,
  suggestionMenu: true,
  limit: 10,
  filter: true,
  menuFullWidth: false,
  data: [],
  format: v => v,
  stateFormat: v => v,
};

Autocomplete.contextType = MergedContexts;

export default bindFormContexts(Autocomplete);
