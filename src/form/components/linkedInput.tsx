import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';


/* !- Contexts */

import { bindFormContexts } from '../context';


/* !- React Elements */

import Field from '../formField';
import IconSwap from '../../icon/mui/action/swap_horiz';


/* !- Helpers */

import { formatNumber, parseNumber, round } from '../linkedTransform';


/* !- Megjelenés: assets/style/components/linkedInput.scss */


const SIDES = ['left', 'right'];

// szám beírása közben elfogadott szöveg ("-", "1 000", "7,")
const INPUT_REGEX = /^-?[\d\s]*([.,]\d*)?$/;


/**
* Két összekapcsolt szám-mező: mindkettő szerkeszthető, az egyik változása átváltással
* frissíti a másikat. A redux store-ba csak az egyik oldal értéke kerül (`store`).
*
* @extends Field
* @example
* <LinkedInput
*   id="discount"
*   label="Kedvezmény (bruttó Ft)"
*   left={{ postfix: 'Ft', decimals: 0 }}
*   right={{ postfix: '%', decimals: 1 }}
*   transform={percentOf(12990)}
* />
*/
class LinkedInput extends Field {
  constructor(props, context) {
    super(props, context);

    // a fókuszban lévő oldal nyers szövege (különben beírás közben átformázódna)
    this.state = { ...this.state, editing: null };
  }

  componentDidMount() {
    super.componentDidMount();

    // a Field csak string kezdőértéket ír a store-ba (value.length), a számot itt pótoljuk
    if (typeof this.props.value === 'number' && this.context.store) {
      const state = this.context.store.getState().form;
      const form = this.props.form || this.context.form;
      const formState = form ? state[form] : state;

      if (!formState || typeof formState[this.props.id] === 'undefined') {
        this.onChangeHandler(this.props.value);
      }
    }
  }

  /* !- Helpers */

  getSide(side) {
    return this.props[side] || {};
  }

  /**
   * Store-ban lévő érték → az adott oldal száma
   */
  getSideNumber(side) {
    const value = parseNumber(this.state.value);

    if (typeof value === 'undefined') {
      return undefined;
    }

    if (side === this.props.store) {
      return value;
    }

    const { toLeft, toRight } = this.props.transform;

    return side === 'right' ? toRight(value) : toLeft(value);
  }

  getSideText(side) {
    if (this.state.editing && this.state.editing.side === side) {
      return this.state.editing.text;
    }

    const value = this.getSideNumber(side);

    if (typeof value === 'undefined') {
      return '';
    }

    const { decimals, format } = this.getSide(side);

    return format ? format(value) : formatNumber(value, decimals, this.props.decimalSeparator);
  }

  /**
   * Beírt érték az adott oldalon → store-ba kerülő érték
   */
  toStoreValue(side, value) {
    const { store, transform } = this.props;

    if (side === store) {
      return value;
    }

    const storeValue = side === 'right' ? transform.toLeft(value) : transform.toRight(value);

    return round(storeValue, this.getSide(store).decimals);
  }

  /* !- Handlers */

  onChangeSideHandler = side => (event) => {
    const text = event.target.value;

    if (!INPUT_REGEX.test(text)) {
      return;
    }

    this.setState({ editing: { side, text } });

    const value = parseNumber(text);

    // pl. csak "-" van beírva: még nincs mit tárolni
    if (typeof value === 'undefined' && text.replace(/\s/g, '') !== '') {
      return;
    }

    this.onChangeHandler(
      typeof value === 'undefined' ? undefined : this.toStoreValue(side, value),
      event,
    );
  };

  onFocusSideHandler = side => (event) => {
    this.setState({ editing: { side, text: event.target.value } });
    this.onFocusHandler(event);
  };

  onBlurSideHandler = (event) => {
    this.setState({ editing: null });
    this.onBlurHandler(event);
  };

  /* !- Renders */

  renderSide(side, index) {
    const { prefix, postfix, placeholder } = this.getSide(side);
    const ratio = this.props.ratio[index] ?? 1;

    return (
      <label
        key={side}
        className={`linked-input-side linked-input-${side}`}
        // a két oldal egymáshoz viszonyított szélessége
        style={{ flexGrow: ratio }}
      >
        {prefix &&
          <div className="prefix">{this.getTranslatedViewValue(prefix)}</div>
        }

        <input
          id={index === 0 ? this.props.id : `${this.props.id}-${side}`}
          name={`${this.props.name || this.props.id}-${side}`}
          type="text"
          inputMode="decimal"
          value={this.getSideText(side)}
          placeholder={this.getTranslatedViewValue(placeholder) || ''}
          disabled={this.props.disabled}
          readOnly={this.props.disabled}
          autoComplete="off"
          aria-labelledby={this.props.id}

          onChange={this.onChangeSideHandler(side)}
          onFocus={this.onFocusSideHandler(side)}
          onBlur={this.onBlurSideHandler}

          ref={(ref) => {
            if (index === 0) {
              this.element = ref;
            }
          }}
        />

        {postfix &&
          <div className="postfix">{this.getTranslatedViewValue(postfix)}</div>
        }
      </label>
    );
  }

  renderPlainField() {
    const text = side => [
      this.getTranslatedViewValue(this.getSide(side).prefix),
      this.getSideText(side),
      this.getTranslatedViewValue(this.getSide(side).postfix),
    ].filter(Boolean).join(' ');

    return (
      <div className={this.getClasses('plain')}>
        {this.label}
        <div className="h-center">
          <div>{this.getSideText(this.props.store) ? `${text('left')} / ${text('right')}` : this.state.placeholder}</div>
        </div>
      </div>
    );
  }

  render() {
    return super.render() || (
      <div
        className={classNames(this.getClasses('linked-input'), { disabled: this.props.disabled })}
        data-tutorial={this.props['data-tutorial']}
      >

        {this.label}

        <div className="linked-input">
          {this.renderSide(SIDES[0], 0)}

          {this.props.separator &&
            <div className="linked-input-separator" aria-hidden="true">
              {this.props.separator}
            </div>
          }

          {this.renderSide(SIDES[1], 1)}
        </div>

        {this.state.error &&
          <div className="error">{this.state.error}</div>
        }
      </div>
    );
  }
}


const sideShape = PropTypes.shape({
  /**
   * Inline elem a mező elején / végén (pl. 'Ft', '%', 'cm')
   */
  prefix: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  postfix: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  placeholder: PropTypes.string,
  /**
   * Megjelenítés (és store-ba íráskor) kerekítés tizedesjegyre
   */
  decimals: PropTypes.number,
  /**
   * Egyedi megjelenítés: (value: number) => string
   */
  format: PropTypes.func,
});


/**
 * propTypes
 * @override
 */
LinkedInput.propTypes =
{
  ...LinkedInput.propTypes,
  left: sideShape,
  right: sideShape,
  /**
   * Átváltás a két oldal között, lásd form/linkedTransform (factor, percentOf)
   * { toRight: (left) => right, toLeft: (right) => left }
   */
  transform: PropTypes.shape({
    toRight: PropTypes.func.isRequired,
    toLeft: PropTypes.func.isRequired,
  }).isRequired,
  /**
   * Melyik oldal értéke kerül a redux store-ba (`id` kulcson)
   */
  store: PropTypes.oneOf(SIDES),
  /**
   * A két oldal egymáshoz viszonyított szélessége (flex-grow), pl. [2, 1]
   */
  ratio: PropTypes.arrayOf(PropTypes.number),
  /**
   * Elválasztó elem középen (false = nincs)
   */
  separator: PropTypes.oneOfType([PropTypes.element, PropTypes.bool]),
  decimalSeparator: PropTypes.string,
};


/**
 * defaultProps
 * @override
 */
LinkedInput.defaultProps =
{
  ...LinkedInput.defaultProps,
  left: {},
  right: {},
  store: 'left',
  ratio: [1, 1],
  separator: <IconSwap />,
  decimalSeparator: ',',
};

export default bindFormContexts(LinkedInput);
